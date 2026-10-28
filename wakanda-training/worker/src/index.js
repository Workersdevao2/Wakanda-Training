/**
 * Wakanda Training — Publish + Forms + Members Worker
 *
 * POST /publish              — admin password + catalog → Cloudinary
 * POST /submit               — public form submission → KV
 * GET  /submissions          — admin password → list submissions
 * POST /submissions/status   — admin password + id + handled → update
 * POST /submissions/delete   — admin password + id → delete
 * GET  /members              — admin password → list members
 * POST /members              — admin password + member → create/update
 * POST /members/delete       — admin password + id → delete
 * GET  /health
 *
 * Secrets: ADMIN_PASSWORD, CLOUDINARY_*
 * KV binding: SUBMISSIONS  (also stores members under mem_* keys)
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

const MAX_SUBMISSIONS_LIST = 200;
const MAX_MEMBERS_LIST = 500;

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    try {
      if (request.method === 'GET' && (path === '/' || path === '/health')) {
        return json({
          ok: true,
          service: 'wakanda-publish',
          kv: !!env.SUBMISSIONS,
          ts: new Date().toISOString()
        });
      }

      if (request.method === 'POST' && path === '/publish') {
        return handlePublish(request, env);
      }

      if (request.method === 'POST' && path === '/submit') {
        return handleSubmit(request, env);
      }

      if (request.method === 'GET' && path === '/submissions') {
        return handleListSubmissions(request, env, url);
      }

      if (request.method === 'POST' && path === '/submissions/status') {
        return handleStatus(request, env);
      }

      if (request.method === 'POST' && path === '/submissions/delete') {
        return handleDeleteSubmission(request, env);
      }

      if (request.method === 'GET' && path === '/members') {
        return handleListMembers(request, env, url);
      }

      if (request.method === 'POST' && path === '/members') {
        return handleSaveMember(request, env);
      }

      if (request.method === 'POST' && path === '/members/delete') {
        return handleDeleteMember(request, env);
      }

      return json({ error: 'Not found' }, 404);
    } catch (err) {
      console.error(err);
      return json({ error: err.message || 'Server error' }, 500);
    }
  }
};

/* ---------- Auth helper ---------- */
function checkPassword(env, password) {
  if (!env.ADMIN_PASSWORD) return { ok: false, status: 500, error: 'ADMIN_PASSWORD not set' };
  if (!password || password !== env.ADMIN_PASSWORD) {
    return { ok: false, status: 401, error: 'Invalid password' };
  }
  return { ok: true };
}

function authFromRequest(request, env, bodyPassword) {
  const headerPwd = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  return checkPassword(env, (bodyPassword || headerPwd || '').trim());
}

/* ---------- Form submit (public) ---------- */
async function handleSubmit(request, env) {
  if (!env.SUBMISSIONS) {
    return json({ error: 'KV not configured' }, 503);
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return json({ error: 'Invalid body' }, 400);
  }

  const type = String(body.type || 'form').slice(0, 64);
  const fields = body.fields && typeof body.fields === 'object' ? body.fields : {};
  const message = String(body.message || '').slice(0, 8000);
  const page = String(body.page || '').slice(0, 300);

  const nome = String(fields.nome || fields.name || '').trim();
  const telefone = String(fields.telefone || fields.phone || '').trim();
  if (!nome && !telefone && !message) {
    return json({ error: 'Empty submission' }, 400);
  }

  const id = 'sub_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  const record = {
    id,
    type,
    createdAt: new Date().toISOString(),
    handled: false,
    fields,
    message,
    page,
    ua: (request.headers.get('user-agent') || '').slice(0, 200)
  };

  await env.SUBMISSIONS.put(id, JSON.stringify(record), {
    metadata: { type, handled: '0', createdAt: record.createdAt }
  });

  return json({ ok: true, id });
}

/* ---------- List submissions (admin) ---------- */
async function handleListSubmissions(request, env, url) {
  if (!env.SUBMISSIONS) {
    return json({ error: 'KV not configured' }, 503);
  }

  const password =
    url.searchParams.get('password') ||
    (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');

  const auth = checkPassword(env, password);
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const filter = url.searchParams.get('filter') || 'all';
  const listed = await env.SUBMISSIONS.list({ prefix: 'sub_', limit: MAX_SUBMISSIONS_LIST });

  const items = [];
  for (const key of listed.keys) {
    const raw = await env.SUBMISSIONS.get(key.name);
    if (!raw) continue;
    try {
      const row = JSON.parse(raw);
      if (filter === 'open' && row.handled) continue;
      if (filter === 'handled' && !row.handled) continue;
      items.push(row);
    } catch (_) {}
  }

  items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  return json({
    ok: true,
    count: items.length,
    open: items.filter((i) => !i.handled).length,
    submissions: items
  });
}

/* ---------- Mark handled / unread (admin) ---------- */
async function handleStatus(request, env) {
  if (!env.SUBMISSIONS) {
    return json({ error: 'KV not configured' }, 503);
  }

  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Invalid body' }, 400);

  const auth = checkPassword(env, (body.password || '').trim());
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const id = String(body.id || '');
  if (!id.startsWith('sub_')) return json({ error: 'Invalid id' }, 400);

  const raw = await env.SUBMISSIONS.get(id);
  if (!raw) return json({ error: 'Not found' }, 404);

  const row = JSON.parse(raw);
  row.handled = !!body.handled;
  row.handledAt = row.handled ? new Date().toISOString() : null;

  await env.SUBMISSIONS.put(id, JSON.stringify(row), {
    metadata: {
      type: row.type || '',
      handled: row.handled ? '1' : '0',
      createdAt: row.createdAt || ''
    }
  });

  return json({ ok: true, id, handled: row.handled });
}

/* ---------- Delete submission (admin) ---------- */
async function handleDeleteSubmission(request, env) {
  if (!env.SUBMISSIONS) {
    return json({ error: 'KV not configured' }, 503);
  }

  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Invalid body' }, 400);

  const auth = checkPassword(env, (body.password || '').trim());
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const id = String(body.id || '');
  if (!id.startsWith('sub_')) return json({ error: 'Invalid id' }, 400);

  await env.SUBMISSIONS.delete(id);
  return json({ ok: true, id, deleted: true });
}

/* ---------- Members CRUD ---------- */
function normalizeMember(input, existingId) {
  const id =
    existingId ||
    (input.id && String(input.id).startsWith('mem_')
      ? String(input.id)
      : 'mem_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8));

  const now = new Date().toISOString();
  return {
    id,
    nome: String(input.nome || '').trim().slice(0, 120),
    telefone: String(input.telefone || '').trim().slice(0, 40),
    email: String(input.email || '').trim().slice(0, 120),
    enrolledAt: String(input.enrolledAt || now).slice(0, 40),
    tipo: String(input.tipo || 'Modalidade').slice(0, 64),
    modalidade: String(input.modalidade || '').slice(0, 120),
    pack: String(input.pack || '').slice(0, 200),
    startDate: String(input.startDate || '').slice(0, 20),
    endDate: String(input.endDate || '').slice(0, 20),
    classesTotal: input.classesTotal === '' || input.classesTotal == null ? null : Number(input.classesTotal),
    classesUsed: input.classesUsed === '' || input.classesUsed == null ? 0 : Number(input.classesUsed),
    status: String(input.status || 'activo').slice(0, 32),
    taxaPaga: !!input.taxaPaga,
    notes: String(input.notes || '').slice(0, 2000),
    sourceSubmissionId: input.sourceSubmissionId ? String(input.sourceSubmissionId).slice(0, 64) : null,
    createdAt: input.createdAt || now,
    updatedAt: now
  };
}

function memberStatusFromDates(m) {
  if (m.status === 'pausado' || m.status === 'cancelado') return m.status;
  if (m.endDate) {
    const end = new Date(m.endDate + 'T23:59:59');
    const now = new Date();
    if (end < now) return 'expirado';
    const days = (end - now) / (1000 * 60 * 60 * 24);
    if (days <= 7) return 'a_expirar';
  }
  if (m.classesTotal != null && m.classesUsed >= m.classesTotal) return 'esgotado';
  return m.status === 'activo' || !m.status ? 'activo' : m.status;
}

async function handleListMembers(request, env, url) {
  if (!env.SUBMISSIONS) {
    return json({ error: 'KV not configured' }, 503);
  }

  const password =
    url.searchParams.get('password') ||
    (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');

  const auth = checkPassword(env, password);
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const listed = await env.SUBMISSIONS.list({ prefix: 'mem_', limit: MAX_MEMBERS_LIST });
  const items = [];
  for (const key of listed.keys) {
    const raw = await env.SUBMISSIONS.get(key.name);
    if (!raw) continue;
    try {
      const row = JSON.parse(raw);
      row.computedStatus = memberStatusFromDates(row);
      items.push(row);
    } catch (_) {}
  }

  items.sort((a, b) => (b.updatedAt || b.createdAt || '').localeCompare(a.updatedAt || a.createdAt || ''));

  return json({
    ok: true,
    count: items.length,
    active: items.filter((m) => m.computedStatus === 'activo' || m.computedStatus === 'a_expirar').length,
    members: items
  });
}

async function handleSaveMember(request, env) {
  if (!env.SUBMISSIONS) {
    return json({ error: 'KV not configured' }, 503);
  }

  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Invalid body' }, 400);

  const auth = checkPassword(env, (body.password || '').trim());
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const input = body.member && typeof body.member === 'object' ? body.member : body;
  if (!String(input.nome || '').trim()) {
    return json({ error: 'Nome é obrigatório' }, 400);
  }

  let existing = null;
  if (input.id && String(input.id).startsWith('mem_')) {
    const raw = await env.SUBMISSIONS.get(String(input.id));
    if (raw) {
      try {
        existing = JSON.parse(raw);
      } catch (_) {}
    }
  }

  const member = normalizeMember(
    { ...(existing || {}), ...input, createdAt: (existing && existing.createdAt) || input.createdAt },
    existing ? existing.id : input.id
  );
  member.computedStatus = memberStatusFromDates(member);

  await env.SUBMISSIONS.put(member.id, JSON.stringify(member), {
    metadata: {
      nome: member.nome,
      status: member.status,
      updatedAt: member.updatedAt
    }
  });

  return json({ ok: true, member });
}

async function handleDeleteMember(request, env) {
  if (!env.SUBMISSIONS) {
    return json({ error: 'KV not configured' }, 503);
  }

  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Invalid body' }, 400);

  const auth = checkPassword(env, (body.password || '').trim());
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const id = String(body.id || '');
  if (!id.startsWith('mem_')) return json({ error: 'Invalid id' }, 400);

  await env.SUBMISSIONS.delete(id);
  return json({ ok: true, id, deleted: true });
}

/* ---------- Catalog publish (admin) ---------- */
async function handlePublish(request, env) {
  try {
    const body = await request.json();
    const password = (body.password || '').trim();
    const catalog = body.catalog;

    if (!password || !catalog || typeof catalog !== 'object') {
      return json({ error: 'Missing password or catalog' }, 400);
    }

    const auth = checkPassword(env, password);
    if (!auth.ok) return json({ error: auth.error }, auth.status);

    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const apiKey = env.CLOUDINARY_API_KEY;
    const apiSecret = env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return json({ error: 'Server misconfigured: Cloudinary secrets missing' }, 500);
    }

    const folder = env.CLOUDINARY_FOLDER || 'wakanda-training';
    const publicId = env.CATALOG_PUBLIC_ID || `${folder}/catalog.json`;

    catalog.updatedAt = new Date().toISOString();
    if (!Array.isArray(catalog.products)) catalog.products = [];
    if (!Array.isArray(catalog.zones)) catalog.zones = [];
    if (!catalog.texts || typeof catalog.texts !== 'object') catalog.texts = { pt: {}, en: {} };
    if (!catalog.images || typeof catalog.images !== 'object') catalog.images = {};

    const payload = JSON.stringify(catalog, null, 2);
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      overwrite: 'true',
      public_id: publicId,
      timestamp: String(timestamp)
    };

    const signature = await signParams(paramsToSign, apiSecret);

    const form = new FormData();
    form.append('file', new Blob([payload], { type: 'application/json' }), 'catalog.json');
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    form.append('public_id', publicId);
    form.append('overwrite', 'true');
    form.append('signature', signature);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
    const res = await fetch(uploadUrl, { method: 'POST', body: form });
    const data = await res.json();

    if (!res.ok) {
      const detail = data.error?.message || data.message || JSON.stringify(data);
      return json({ error: 'Cloudinary upload failed: ' + detail, detail }, 502);
    }

    const version = data.version;
    const versionedUrl = version
      ? `https://res.cloudinary.com/${cloudName}/raw/upload/v${version}/${data.public_id || publicId}`
      : data.secure_url || data.url;

    return json({
      ok: true,
      updatedAt: catalog.updatedAt,
      url: versionedUrl,
      version: version || null,
      public_id: data.public_id,
      products: catalog.products.length,
      zones: catalog.zones.length
    });
  } catch (err) {
    console.error(err);
    return json({ error: err.message || 'Publish failed' }, 500);
  }
}

async function signParams(params, apiSecret) {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  const toSign = sorted + apiSecret;
  const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(toSign));
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS
    }
  });
}
