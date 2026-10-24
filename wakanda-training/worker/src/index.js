/**
 * Wakanda Training — Publish Worker
 * Receives { password, catalog } from admin panel,
 * verifies ADMIN_PASSWORD, signs a Cloudinary raw upload,
 * and overwrites the live catalog.json.
 *
 * Secrets (wrangler secret put):
 *   ADMIN_PASSWORD
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return json({ ok: true, service: 'wakanda-publish', ts: new Date().toISOString() });
    }

    if (request.method === 'POST' && (url.pathname === '/publish' || url.pathname === '/')) {
      return handlePublish(request, env);
    }

    return json({ error: 'Not found' }, 404);
  }
};

async function handlePublish(request, env) {
  try {
    const body = await request.json();
    const password = (body.password || '').trim();
    const catalog = body.catalog;

    if (!password || !catalog || typeof catalog !== 'object') {
      return json({ error: 'Missing password or catalog' }, 400);
    }

    if (!env.ADMIN_PASSWORD) {
      return json({ error: 'Server misconfigured: ADMIN_PASSWORD not set' }, 500);
    }

    if (password !== env.ADMIN_PASSWORD) {
      return json({ error: 'Invalid password' }, 401);
    }

    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const apiKey = env.CLOUDINARY_API_KEY;
    const apiSecret = env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return json({ error: 'Server misconfigured: Cloudinary secrets missing' }, 500);
    }

    const folder = env.CLOUDINARY_FOLDER || 'wakanda-training';
    // Include .json so delivery URL matches site fetch path
    const publicId = env.CATALOG_PUBLIC_ID || `${folder}/catalog.json`;

    // Ensure metadata
    catalog.updatedAt = new Date().toISOString();
    if (!Array.isArray(catalog.products)) catalog.products = [];
    if (!Array.isArray(catalog.zones)) catalog.zones = [];
    if (!catalog.texts || typeof catalog.texts !== 'object') catalog.texts = { pt: {}, en: {} };
    if (!catalog.images || typeof catalog.images !== 'object') catalog.images = {};

    const payload = JSON.stringify(catalog, null, 2);
    const timestamp = Math.floor(Date.now() / 1000);

    // Cloudinary signed raw upload
    // Sign ONLY params that go in the body except: file, api_key, cloud_name, resource_type
    // resource_type lives in the URL path (/raw/upload), never in the signature string
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
      console.error('Cloudinary error', data);
      const detail = data.error?.message || data.message || JSON.stringify(data);
      return json({
        error: 'Cloudinary upload failed: ' + detail,
        detail
      }, 502);
    }

    const secureUrl = data.secure_url || data.url;
    // Prefer versioned URL so CDN never serves a stale catalog after publish
    const version = data.version;
    const versionedUrl = version
      ? `https://res.cloudinary.com/${cloudName}/raw/upload/v${version}/${data.public_id || publicId}`
      : secureUrl;

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
  // Cloudinary: sort keys alphabetically, join as key=value, append secret, sha1
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
