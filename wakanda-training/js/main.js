// Wakanda Training — Main JS + Client-side Cart

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Hamburger ----------
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMobile.classList.toggle('open');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });

    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link (works with or without .html, and with ../)
  const rawPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentPage = rawPath.replace(/\.html$/, '') || 'index';
  document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop().replace(/\.html$/, '') || 'index';
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // ---------- Cart ----------
  initCart();

  // ---------- Hero slider ----------
  initHeroSlider();

  // ---------- WhatsApp forms ----------
  initWaForms();
});

// WhatsApp helper
function openWhatsApp(message = '') {
  const phone = '244940668530';
  const text = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

function openWhatsAppI18n(el) {
  const lang = (window.WakandaI18n && window.WakandaI18n.getLang()) || 'pt';
  const msg = (lang === 'en' ? el.getAttribute('data-wa-en') : el.getAttribute('data-wa-pt')) || '';
  openWhatsApp(msg);
}

/* =====================================================
   CLIENT-SIDE CART (localStorage)
   ===================================================== */

const CART_KEY = 'wakanda_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

function addToCart(id, name, price, image = '') {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }

  saveCart(cart);
  openCart();
}

function updateQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    const idx = cart.findIndex(i => i.id === id);
    cart.splice(idx, 1);
  }

  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
  renderCart();
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function formatPrice(n) {
  return n.toLocaleString('pt-AO') + ' KZ';
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const emptyEl = document.getElementById('cart-empty');
  const footerEl = document.getElementById('cart-footer');

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (footerEl) footerEl.style.display = 'block';

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)} × ${item.qty}</div>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" onclick="updateQty('${item.id}', -1)" aria-label="Diminuir">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" onclick="updateQty('${item.id}', 1)" aria-label="Aumentar">+</button>
        <button class="remove-btn" onclick="removeFromCart('${item.id}')" aria-label="Remover">×</button>
      </div>
    </div>
  `).join('');

  if (totalEl) {
    totalEl.textContent = formatPrice(getCartTotal());
  }
}

function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function checkoutWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) return;

  const name = document.getElementById('checkout-name')?.value.trim() || '';
  const phone = document.getElementById('checkout-phone')?.value.trim() || '';
  const note = document.getElementById('checkout-note')?.value.trim() || '';

  let message = 'Olá! Quero encomendar:\n\n';

  cart.forEach(item => {
    message += `• ${item.name} × ${item.qty} — ${formatPrice(item.price * item.qty)}\n`;
  });

  message += `\n*Total: ${formatPrice(getCartTotal())}*`;

  if (name) message += `\n\nNome: ${name}`;
  if (phone) message += `\nTelefone: ${phone}`;
  if (note) message += `\nNota: ${note}`;

  openWhatsApp(message);
}

function initCart() {
  updateCartBadge();
  renderCart();

  // Close on overlay click
  const overlay = document.getElementById('cart-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeCart);
  }
}

function addTshirt(colorKey, baseName, price) {
  const select = document.getElementById('size-' + colorKey);
  const size = select ? select.value : 'M';
  const id = 'tshirt-' + colorKey + '-' + size;
  const name = baseName + ' — Tamanho ' + size;
  addToCart(id, name, price);
}

/* =====================================================
   HERO MEDIA SLIDER (photos + videos alternating)
   ===================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('hero-dots');
  if (!slides.length) return;

  let current = 0;
  let timer = null;
  let onEndedHandler = null;
  const PHOTO_MS = 5000;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'hero-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Slide ' + (i + 1));
      btn.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(btn);
    });
  }

  function clearSchedule() {
    clearTimeout(timer);
    timer = null;
    if (onEndedHandler) {
      slides.forEach(s => {
        const v = s.querySelector('video');
        if (v) v.removeEventListener('ended', onEndedHandler);
      });
      onEndedHandler = null;
    }
  }

  function pauseAllVideos() {
    slides.forEach(s => {
      const v = s.querySelector('video');
      if (v) {
        v.pause();
        try { v.currentTime = 0; } catch (e) {}
      }
    });
  }

  function forceMuteInline(v) {
    // Safari requires muted + playsinline (attribute + property) before play()
    v.muted = true;
    v.defaultMuted = true;
    v.volume = 0;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('autoplay', '');
  }

  function playActiveVideo(slide) {
    const v = slide.querySelector('video');
    if (!v) return;
    forceMuteInline(v);
    v.loop = false;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.then === 'function') {
        p.catch(() => {
          // Safari may block until a user gesture — retry on first interaction
          const resume = () => {
            forceMuteInline(v);
            v.play().catch(() => {});
            document.removeEventListener('touchstart', resume);
            document.removeEventListener('click', resume);
          };
          document.addEventListener('touchstart', resume, { once: true, passive: true });
          document.addEventListener('click', resume, { once: true });
        });
      }
    };
    // If metadata not ready yet, wait then play (helps Safari)
    if (v.readyState >= 2) {
      tryPlay();
    } else {
      v.addEventListener('loadeddata', tryPlay, { once: true });
      v.load();
      tryPlay();
    }
  }

  function syncHeroMode(slide) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const isPhoto = slide.getAttribute('data-type') === 'photo';
    hero.classList.toggle('hero--photo', isPhoto);
  }

  function goTo(index) {
    slides[current].classList.remove('active');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.hero-dot') : [];
    if (dots[current]) dots[current].classList.remove('active');

    clearSchedule();
    pauseAllVideos();
    current = ((index % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    syncHeroMode(slides[current]);
    playActiveVideo(slides[current]);
    scheduleNext();
  }

  function next() {
    goTo(current + 1);
  }

  function scheduleNext() {
    clearSchedule();
    const slide = slides[current];
    const video = slide.querySelector('video');

    if (video) {
      // Advance only when the video finishes playing
      onEndedHandler = () => next();
      video.addEventListener('ended', onEndedHandler);
      // Fallback if metadata fails or video never fires ended (e.g. missing file)
      const fallbackMs = (video.duration && isFinite(video.duration))
        ? (video.duration * 1000) + 500
        : 20000;
      timer = setTimeout(next, fallbackMs);
    } else {
      // Photos stay for a fixed time
      timer = setTimeout(next, PHOTO_MS);
    }
  }

  // Start
  syncHeroMode(slides[0]);
  playActiveVideo(slides[0]);
  scheduleNext();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearSchedule();
      pauseAllVideos();
    } else {
      playActiveVideo(slides[current]);
      scheduleNext();
    }
  });
}



/* =====================================================
   WhatsApp forms (perguntas + inscrição)
   ===================================================== */
function initWaForms() {
  document.querySelectorAll('form.wa-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const type = form.getAttribute('data-form-type') || '';
      const data = {};
      let valid = true;

      form.querySelectorAll('input, select, textarea').forEach(el => {
        el.classList.remove('invalid');
        const val = (el.value || '').trim();
        data[el.name] = val;
        if (el.required && !val) {
          el.classList.add('invalid');
          valid = false;
        }
      });

      if (!valid) {
        const first = form.querySelector('.invalid');
        if (first) first.focus();
        return;
      }

      let message = '';
      const lang = (window.WakandaI18n && window.WakandaI18n.getLang()) || 'pt';
      const en = lang === 'en';
      if (type === 'inscricao') {
        if (en) {
          message =
            'Hi! I want to *join* Wakanda Training.\n\n' +
            '*Name:* ' + data.nome + '\n' +
            '*Phone:* ' + data.telefone + '\n' +
            (data.email ? '*Email:* ' + data.email + '\n' : '') +
            (data.idade ? '*Age:* ' + data.idade + '\n' : '') +
            (data.altura_peso ? '*Height / weight:* ' + data.altura_peso + '\n' : '') +
            (data.morada ? '*Address / area:* ' + data.morada + '\n' : '') +
            '*Type:* ' + data.tipo + '\n' +
            '*Program / event:* ' + data.detalhe + '\n' +
            (data.pagamento ? '*Preferred payment:* ' + data.pagamento + '\n' : '') +
            (data.horario ? '*Preferred time:* ' + data.horario + '\n' : '') +
            (data.mensagem ? '*Goals / message:* ' + data.mensagem + '\n' : '') +
            '\n_I will also send in this chat:_\n' +
            '• ID document (PDF or photo)\n' +
            '• Half-body photo\n' +
            '• A relative\'s contact';
        } else {
          message =
            'Olá! Quero *inscrever-me* na Wakanda Training.\n\n' +
            '*Nome:* ' + data.nome + '\n' +
            '*Telefone:* ' + data.telefone + '\n' +
            (data.email ? '*Email:* ' + data.email + '\n' : '') +
            (data.idade ? '*Idade:* ' + data.idade + '\n' : '') +
            (data.altura_peso ? '*Altura / peso:* ' + data.altura_peso + '\n' : '') +
            (data.morada ? '*Morada / zona:* ' + data.morada + '\n' : '') +
            '*Tipo:* ' + data.tipo + '\n' +
            '*Modalidade / evento:* ' + data.detalhe + '\n' +
            (data.pagamento ? '*Pagamento preferido:* ' + data.pagamento + '\n' : '') +
            (data.horario ? '*Horário preferido:* ' + data.horario + '\n' : '') +
            (data.mensagem ? '*Objectivos / mensagem:* ' + data.mensagem + '\n' : '') +
            '\n_Vou enviar em seguida na conversa:_\n' +
            '• Bilhete de identidade (PDF ou foto)\n' +
            '• Foto meio corpo\n' +
            '• Contacto de um parente';
        }
      } else if (type === 'pergunta-modalidade') {
        message =
          'Olá! Tenho uma *pergunta sobre modalidade*.\n\n' +
          '*Nome:* ' + data.nome + '\n' +
          '*Telefone:* ' + data.telefone + '\n' +
          '*Modalidade:* ' + data.modalidade + '\n' +
          '*Assunto:* ' + data.assunto + '\n' +
          (data.mensagem ? '*Mensagem:* ' + data.mensagem + '\n' : '');
      } else if (type === 'pergunta-evento') {
        message =
          'Olá! Tenho uma *pergunta sobre evento*.\n\n' +
          '*Nome:* ' + data.nome + '\n' +
          '*Telefone:* ' + data.telefone + '\n' +
          '*Evento:* ' + data.evento + '\n' +
          '*Assunto:* ' + data.assunto + '\n' +
          (data.mensagem ? '*Mensagem:* ' + data.mensagem + '\n' : '');
      } else {
        message = 'Olá! Contacto via formulário do site.';
      }

      openWhatsApp(message.trim());
    });
  });

  // Prefill modality from URL hash on Modalidades page
  const hash = (window.location.hash || '').replace('#', '');
  const map = {
    crossfit: 'CrossFit & Hyrox',
    musculacao: 'Musculação',
    kickboxing: 'Kickboxing',
    zumba: 'Zumba',
    kids: 'Functional Kids',
    jiujitsu: 'Jiu Jitsu Brasileiro',
    judo: 'Judô'
  };
  if (map[hash]) {
    const sel = document.getElementById('mod-modalidade');
    if (sel) sel.value = map[hash];
  }
}
