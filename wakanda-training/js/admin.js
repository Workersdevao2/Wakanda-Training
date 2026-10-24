/**
 * Wakanda Training — Admin Panel
 * Drafts → localStorage | Publish → Cloudflare Worker → Cloudinary catalog.json
 */
(function () {
  'use strict';

  // ---------- CONFIG (edit after Worker deploy) ----------
  const PUBLISH_URL = 'https://wakanda-publish.workersdevao.workers.dev/publish';
  const CLOUD_NAME = 'ogtzpc3v';
  const UPLOAD_PRESET = 'wakanda_unsigned'; // create in Cloudinary dashboard (unsigned)
  const CLOUD_FOLDER = 'wakanda-training';
  const CATALOG_URL = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${CLOUD_FOLDER}/catalog.json`;

  // Session / draft keys
  const AUTH_KEY = 'wt_admin_auth';
  const DRAFT_PRODUCTS = 'wt_products_override';
  const DRAFT_ZONES = 'wt_zones_override';
  const DRAFT_TEXTS = 'wt_texts_override';
  const DRAFT_IMAGES = 'wt_images_override';
  const MEDIA_LIB = 'wt_media_library';

  // Default admin password — CHANGE after handoff (or use Worker secret only)
  // For first login before Worker is set, this local gate is used.
  const LOCAL_FALLBACK_PASSWORD = 'wakanda2026';

  // Site image slots (match data-site-img / data-site-img-bg on public pages)
  const SITE_IMAGE_SLOTS = [
    { key: 'hero-loja', label: 'Hero Loja', hint: 'Fundo da página Loja' },
    { key: 'modalidades-hero', label: 'Hero Modalidades', hint: 'Banner das modalidades' },
    { key: 'gordus', label: 'Gordus Project', hint: 'Imagem do projeto Gordus' },
    { key: 'contacto-1', label: 'Contacto espaço 1', hint: 'Galeria contacto' },
    { key: 'contacto-2', label: 'Contacto espaço 2', hint: 'Galeria contacto' },
    { key: 'contacto-3', label: 'Contacto espaço 3', hint: 'Galeria contacto' }
  ];

  // ---------- State ----------
  let products = [];
  let zones = [];
  let texts = { pt: {}, en: {} };
  let siteImages = {};
  let mediaLibrary = [];
  let editingId = null;
  let pickingSlot = null; // when choosing media for a site slot

  // ---------- DOM helpers ----------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function toast(msg, type = '') {
    const el = $('#admin-toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'admin-toast show' + (type ? ' ' + type : '');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2800);
  }

  function formatPrice(n) {
    return Number(n).toLocaleString('pt-AO') + ' KZ';
  }

  // ---------- Auth ----------
  function isAuthed() {
    return sessionStorage.getItem(AUTH_KEY) === '1' || localStorage.getItem(AUTH_KEY) === '1';
  }

  function setAuthed(remember) {
    sessionStorage.setItem(AUTH_KEY, '1');
    if (remember) localStorage.setItem(AUTH_KEY, '1');
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
    location.reload();
  }

  function tryLogin() {
    const input = $('#login-password');
    const err = $('#login-error');
    const remember = $('#login-remember')?.checked;
    const pwd = (input?.value || '').trim();
    if (!pwd) {
      if (err) err.textContent = 'Introduz a password.';
      return;
    }
    // Accept local fallback OR any non-empty if Worker will validate on publish
    if (pwd === LOCAL_FALLBACK_PASSWORD || pwd.length >= 6) {
      setAuthed(remember);
      showShell();
      loadAll();
    } else {
      if (err) err.textContent = 'Password incorrecta.';
    }
  }

  function showShell() {
    $('#admin-login')?.classList.add('hidden');
    const shell = $('#admin-shell');
    if (shell) {
      shell.classList.add('is-open');
      shell.style.display = 'block';
    }
    $('#admin-login') && ($('#admin-login').style.display = 'none');
  }

  // ---------- Storage ----------
  function loadDrafts() {
    try {
      const p = localStorage.getItem(DRAFT_PRODUCTS);
      const z = localStorage.getItem(DRAFT_ZONES);
      const t = localStorage.getItem(DRAFT_TEXTS);
      const i = localStorage.getItem(DRAFT_IMAGES);
      const m = localStorage.getItem(MEDIA_LIB);
      if (p) products = JSON.parse(p);
      if (z) zones = JSON.parse(z);
      if (t) texts = JSON.parse(t);
      if (i) siteImages = JSON.parse(i);
      if (m) mediaLibrary = JSON.parse(m);
    } catch (e) {
      console.warn('Draft load error', e);
    }
  }

  function seedFromDefaults() {
    const d = window.WT_DEFAULTS || {};
    if (!products.length) products = JSON.parse(JSON.stringify(d.products || []));
    if (!zones.length) zones = JSON.parse(JSON.stringify(d.zones || []));
    if (!Object.keys(texts.pt || {}).length && !Object.keys(texts.en || {}).length) {
      texts = JSON.parse(JSON.stringify(d.texts || { pt: {}, en: {} }));
    }
    if (!Object.keys(siteImages).length) {
      siteImages = JSON.parse(JSON.stringify(d.images || {}));
    }
  }

  async function loadRemoteCatalog() {
    try {
      const res = await fetch(CATALOG_URL + '?t=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) return false;
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length) {
        // Only overwrite if no local draft
        if (!localStorage.getItem(DRAFT_PRODUCTS)) products = data.products;
      }
      if (Array.isArray(data.zones) && !localStorage.getItem(DRAFT_ZONES)) zones = data.zones;
      if (data.texts && !localStorage.getItem(DRAFT_TEXTS)) texts = data.texts;
      if (data.images && !localStorage.getItem(DRAFT_IMAGES)) siteImages = data.images;
      updateStatus(data.updatedAt);
      return true;
    } catch {
      return false;
    }
  }

  function saveDrafts() {
    localStorage.setItem(DRAFT_PRODUCTS, JSON.stringify(products));
    localStorage.setItem(DRAFT_ZONES, JSON.stringify(zones));
    localStorage.setItem(DRAFT_TEXTS, JSON.stringify(texts));
    localStorage.setItem(DRAFT_IMAGES, JSON.stringify(siteImages));
    localStorage.setItem(MEDIA_LIB, JSON.stringify(mediaLibrary));
    toast('Rascunho guardado neste dispositivo', 'success');
    updateStatus('rascunho local');
  }

  function updateStatus(label) {
    const el = $('#admin-status-text');
    if (el) el.innerHTML = label
      ? `<strong>${label}</strong>`
      : '<strong>—</strong>';
  }

  // ---------- Tabs ----------
  function initTabs() {
    $$('.admin-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        $$('.admin-tab').forEach((t) => t.classList.remove('active'));
        $$('.admin-panel').forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = $('#panel-' + tab.dataset.panel);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ---------- Products CRUD ----------
  function renderProducts() {
    const sorted = [...products].sort((a, b) => (a.order || 0) - (b.order || 0));
    const list = $('#product-list');
    const tbody = $('#product-table-body');

    if (list) {
      list.innerHTML = sorted.map((p) => `
        <div class="product-card-admin ${p.active === false ? 'inactive' : ''}" data-id="${p.id}">
          <img src="${resolveImg(p.image)}" alt="" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22><rect fill=%22%23111%22 width=%2264%22 height=%2264%22/></svg>'" />
          <div class="meta">
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.category || '')} ${p.sizes ? '· tamanhos' : ''}</p>
            <div class="price">${formatPrice(p.price)}</div>
            ${p.active === false ? '<span class="badge off">Inactivo</span>' : '<span class="badge">Activo</span>'}
          </div>
          <div class="actions">
            <button type="button" class="btn btn-sm btn-ghost" data-edit="${p.id}">Editar</button>
            <button type="button" class="btn btn-sm btn-danger" data-del="${p.id}">Apagar</button>
          </div>
        </div>
      `).join('') || '<p class="text-muted">Nenhum produto.</p>';
    }

    if (tbody) {
      tbody.innerHTML = sorted.map((p) => `
        <tr class="${p.active === false ? 'inactive' : ''}">
          <td><img src="${resolveImg(p.image)}" alt="" /></td>
          <td>${esc(p.name)}</td>
          <td>${formatPrice(p.price)}</td>
          <td>${esc(p.category || '')}</td>
          <td>${p.active === false ? '<span class="badge off">Off</span>' : '<span class="badge">On</span>'}</td>
          <td class="row-actions">
            <button type="button" class="btn btn-sm btn-ghost" data-edit="${p.id}">Editar</button>
            <button type="button" class="btn btn-sm btn-danger" data-del="${p.id}">Apagar</button>
          </td>
        </tr>
      `).join('');
    }

    $$('[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => openProductModal(btn.dataset.edit));
    });
    $$('[data-del]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (confirm('Apagar este produto do catálogo?')) {
          products = products.filter((p) => p.id !== btn.dataset.del);
          renderProducts();
          toast('Produto removido (guarda rascunho ou publica)');
        }
      });
    });

    const countEl = $('#stat-products');
    if (countEl) countEl.textContent = products.filter((p) => p.active !== false).length;
  }

  function resolveImg(src) {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    // admin is at /admin.html → images relative from root
    if (src.startsWith('images/')) return src;
    return src;
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function openProductModal(id) {
    editingId = id || null;
    const p = id ? products.find((x) => x.id === id) : null;
    $('#modal-product-title').textContent = p ? 'Editar produto' : 'Novo produto';
    $('#f-name').value = p?.name || '';
    $('#f-name-en').value = p?.name_en || '';
    $('#f-desc').value = p?.description || '';
    $('#f-desc-en').value = p?.description_en || '';
    $('#f-price').value = p?.price ?? '';
    $('#f-category').value = p?.category || 'accessories';
    $('#f-image').value = p?.image || '';
    $('#f-sizes').value = (p?.sizes || []).join(', ');
    $('#f-active').checked = p ? p.active !== false : true;
    $('#f-order').value = p?.order ?? products.length + 1;
    $('#product-modal')?.classList.add('open');
  }

  function closeProductModal() {
    $('#product-modal')?.classList.remove('open');
    editingId = null;
  }

  function saveProductFromForm() {
    const name = $('#f-name').value.trim();
    const price = parseInt($('#f-price').value, 10);
    if (!name || isNaN(price)) {
      toast('Nome e preço são obrigatórios', 'error');
      return;
    }
    const sizesRaw = $('#f-sizes').value.trim();
    const sizes = sizesRaw
      ? sizesRaw.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
      : null;

    const obj = {
      id: editingId || ('p-' + Date.now().toString(36)),
      name,
      name_en: $('#f-name-en').value.trim() || name,
      description: $('#f-desc').value.trim(),
      description_en: $('#f-desc-en').value.trim(),
      price,
      category: $('#f-category').value,
      image: $('#f-image').value.trim(),
      sizes,
      active: $('#f-active').checked,
      order: parseInt($('#f-order').value, 10) || 0
    };

    if (editingId) {
      const idx = products.findIndex((p) => p.id === editingId);
      if (idx >= 0) products[idx] = obj;
    } else {
      products.push(obj);
    }
    closeProductModal();
    renderProducts();
    toast('Produto actualizado');
  }

  // ---------- Zones ----------
  function renderZones() {
    const wrap = $('#zones-list');
    if (!wrap) return;
    wrap.innerHTML = zones.map((z, i) => `
      <div class="zone-row" data-i="${i}">
        <input type="text" value="${esc(z.name)}" data-zone-name="${i}" placeholder="Zona" />
        <input type="number" inputmode="decimal" value="${z.price}" data-zone-price="${i}" placeholder="Preço" />
        <button type="button" class="btn btn-sm btn-danger" data-zone-del="${i}">✕</button>
      </div>
    `).join('') || '<p class="text-muted">Sem zonas de entrega.</p>';

    $$('[data-zone-name]').forEach((inp) => {
      inp.addEventListener('change', () => {
        const i = +inp.dataset.zoneName;
        zones[i].name = inp.value.trim();
      });
    });
    $$('[data-zone-price]').forEach((inp) => {
      inp.addEventListener('change', () => {
        const i = +inp.dataset.zonePrice;
        zones[i].price = parseInt(inp.value, 10) || 0;
      });
    });
    $$('[data-zone-del]').forEach((btn) => {
      btn.addEventListener('click', () => {
        zones.splice(+btn.dataset.zoneDel, 1);
        renderZones();
      });
    });

    const countEl = $('#stat-zones');
    if (countEl) countEl.textContent = zones.length;
  }

  function addZone() {
    zones.push({ name: 'Nova zona', price: 0 });
    renderZones();
  }

  // ---------- Media ----------
  function renderMedia() {
    const grid = $('#media-grid');
    if (!grid) return;
    grid.innerHTML = mediaLibrary.map((m, i) => `
      <div class="media-item" data-media="${i}">
        <img src="${m.url}" alt="" loading="lazy" />
        <div class="media-actions">
          <button type="button" data-copy="${i}">URL</button>
          <button type="button" data-use="${i}">Usar</button>
          <button type="button" data-rm="${i}">✕</button>
        </div>
      </div>
    `).join('') || '<p class="text-muted" style="grid-column:1/-1">Ainda sem média. Carrega imagens abaixo.</p>';

    $$('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const url = mediaLibrary[+btn.dataset.copy]?.url;
        if (url) {
          try {
            await navigator.clipboard.writeText(url);
            toast('URL copiada', 'success');
          } catch {
            prompt('Copia o URL:', url);
          }
        }
      });
    });
    $$('[data-use]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = mediaLibrary[+btn.dataset.use]?.url;
        if (!url) return;
        if (pickingSlot) {
          siteImages[pickingSlot] = url;
          pickingSlot = null;
          renderSlots();
          toast('Imagem atribuída ao slot', 'success');
          // switch to images tab
          $$('.admin-tab').forEach((t) => t.classList.toggle('active', t.dataset.panel === 'images'));
          $$('.admin-panel').forEach((p) => p.classList.toggle('active', p.id === 'panel-images'));
        } else {
          const imgField = $('#f-image');
          if (imgField && $('#product-modal')?.classList.contains('open')) {
            imgField.value = url;
            toast('URL aplicada ao produto');
          } else {
            toast('Abre um produto ou slot para usar a imagem');
          }
        }
      });
    });
    $$('[data-rm]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        mediaLibrary.splice(+btn.dataset.rm, 1);
        localStorage.setItem(MEDIA_LIB, JSON.stringify(mediaLibrary));
        renderMedia();
      });
    });
  }

  async function uploadToCloudinary(file) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      toast('Configura CLOUD_NAME e UPLOAD_PRESET no admin.js', 'error');
      return null;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);
    fd.append('folder', CLOUD_FOLDER + '/media');

    toast('A carregar…');
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error?.message || 'Falha no upload', 'error');
        return null;
      }
      return data.secure_url || data.url;
    } catch (e) {
      toast('Erro de rede no upload', 'error');
      return null;
    }
  }

  async function onMediaFiles(files) {
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const url = await uploadToCloudinary(file);
      if (url) {
        mediaLibrary.unshift({ url, name: file.name, at: new Date().toISOString() });
        localStorage.setItem(MEDIA_LIB, JSON.stringify(mediaLibrary));
      }
    }
    renderMedia();
    toast('Média actualizada', 'success');
  }

  // ---------- Site image slots ----------
  function renderSlots() {
    const grid = $('#slot-grid');
    if (!grid) return;
    grid.innerHTML = SITE_IMAGE_SLOTS.map((slot) => {
      const url = siteImages[slot.key] || '';
      return `
        <div class="slot-card" data-slot="${slot.key}">
          ${url
            ? `<img src="${resolveImg(url)}" alt="" />`
            : `<div class="slot-placeholder">Sem imagem</div>`}
          <div class="slot-info">
            <h3>${esc(slot.label)}</h3>
            <p>${esc(slot.hint)}${url ? '<br>' + esc(url.slice(0, 48)) + '…' : ''}</p>
            <div class="slot-actions">
              <button type="button" class="btn btn-sm btn-ghost" data-slot-upload="${slot.key}">Carregar</button>
              <button type="button" class="btn btn-sm btn-ghost" data-slot-pick="${slot.key}">Da média</button>
              <button type="button" class="btn btn-sm btn-danger" data-slot-clear="${slot.key}">Original</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    $$('[data-slot-upload]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.slotUpload;
        const input = $('#slot-file-input');
        if (!input) return;
        input.onchange = async () => {
          const file = input.files?.[0];
          input.value = '';
          if (!file) return;
          const url = await uploadToCloudinary(file);
          if (url) {
            siteImages[key] = url;
            mediaLibrary.unshift({ url, name: file.name, at: new Date().toISOString() });
            localStorage.setItem(MEDIA_LIB, JSON.stringify(mediaLibrary));
            renderSlots();
            renderMedia();
            toast('Imagem do site actualizada', 'success');
          }
        };
        input.click();
      });
    });
    $$('[data-slot-pick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        pickingSlot = btn.dataset.slotPick;
        $$('.admin-tab').forEach((t) => t.classList.toggle('active', t.dataset.panel === 'media'));
        $$('.admin-panel').forEach((p) => p.classList.toggle('active', p.id === 'panel-media'));
        toast('Escolhe uma imagem da biblioteca (botão Usar)');
      });
    });
    $$('[data-slot-clear]').forEach((btn) => {
      btn.addEventListener('click', () => {
        delete siteImages[btn.dataset.slotClear];
        renderSlots();
        toast('Slot reposto (usa default do site)');
      });
    });
  }

  // ---------- Publish ----------
  async function publish() {
    if (!confirm(
      'Publicar na loja?\n\n' +
      `Produtos: ${products.length}\n` +
      `Zonas: ${zones.length}\n` +
      `Imagens de site: ${Object.keys(siteImages).length}\n\n` +
      'Todos os visitantes verão estes dados no próximo carregamento.'
    )) return;

    const catalog = {
      updatedAt: new Date().toISOString(),
      products,
      zones,
      texts,
      images: siteImages
    };

    // Prefer Worker
    if (PUBLISH_URL) {
      const pwd = sessionStorage.getItem('wt_publish_pwd') ||
        prompt('Password de admin (Worker):');
      if (!pwd) return;
      sessionStorage.setItem('wt_publish_pwd', pwd);

      try {
        toast('A publicar…');
        const res = await fetch(PUBLISH_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd, catalog })
        });
        const data = await res.json();
        if (!res.ok) {
          toast(data.error || 'Falha ao publicar', 'error');
          if (res.status === 401) sessionStorage.removeItem('wt_publish_pwd');
          return;
        }
        // Clear drafts so public load uses remote
        localStorage.removeItem(DRAFT_PRODUCTS);
        localStorage.removeItem(DRAFT_ZONES);
        localStorage.removeItem(DRAFT_TEXTS);
        localStorage.removeItem(DRAFT_IMAGES);
        updateStatus(data.updatedAt || 'publicado');
        toast('Publicado com sucesso', 'success');
      } catch (e) {
        toast('Erro de rede: ' + e.message, 'error');
      }
      return;
    }

    // Fallback: browser-only signed upload (requires API secret in this browser — avoid on shared phones)
    toast('PUBLISH_URL vazio — configura o Worker em admin.js', 'error');
  }

  // ---------- Dashboard ----------
  function renderDashboard() {
    const sp = $('#stat-products');
    const sz = $('#stat-zones');
    const sm = $('#stat-media');
    if (sp) sp.textContent = products.filter((p) => p.active !== false).length;
    if (sz) sz.textContent = zones.length;
    if (sm) sm.textContent = mediaLibrary.length;
  }

  // ---------- Boot ----------
  async function loadAll() {
    loadDrafts();
    seedFromDefaults();
    await loadRemoteCatalog();
    renderProducts();
    renderZones();
    renderMedia();
    renderSlots();
    renderDashboard();
  }

  function init() {
    if (isAuthed()) {
      showShell();
      loadAll();
    }

    $('#login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      tryLogin();
    });

    initTabs();

    $('#btn-new-product')?.addEventListener('click', () => openProductModal(null));
    $('#btn-save-product')?.addEventListener('click', saveProductFromForm);
    $('#btn-close-product')?.addEventListener('click', closeProductModal);
    $('#product-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'product-modal') closeProductModal();
    });

    $('#btn-add-zone')?.addEventListener('click', addZone);

    $('#media-file-input')?.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files?.length) onMediaFiles(files);
      e.target.value = '';
    });
    $('#btn-upload-media')?.addEventListener('click', () => $('#media-file-input')?.click());

    $('#btn-save-draft')?.addEventListener('click', saveDrafts);
    $('#btn-publish')?.addEventListener('click', publish);
    $('#btn-logout')?.addEventListener('click', logout);

    // Sticky bar mirrors
    $('#sticky-save')?.addEventListener('click', saveDrafts);
    $('#sticky-publish')?.addEventListener('click', publish);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
