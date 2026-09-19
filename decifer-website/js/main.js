/* Decifer Sport Resort — Main JS */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const hamburger = document.querySelector(".hamburger");
  const navMobile = document.querySelector(".nav-mobile");
  const navOverlay = document.querySelector(".nav-overlay");
  const body = document.body;

  // Header scroll effect
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  const toggleMenu = () => {
    const isOpen = navMobile.classList.contains("open");
    hamburger.classList.toggle("active", !isOpen);
    navMobile.classList.toggle("open", !isOpen);
    navOverlay.classList.toggle("visible", !isOpen);
    body.classList.toggle("menu-open", !isOpen);
  };

  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", toggleMenu);
  }

  // Close menu on link click
  const mobileLinks = document.querySelectorAll(".nav-mobile a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMobile.classList.contains("open")) {
        toggleMenu();
      }
    });
  });

  // Simple form handling (prevent default + show message)
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.textContent : "";
      if (btn) {
        btn.textContent = "Enviado";
        btn.disabled = true;
      }
      setTimeout(() => {
        if (btn) {
          btn.textContent = original;
          btn.disabled = false;
        }
        form.reset();
        alert("Obrigado. Entraremos em contacto em breve via WhatsApp ou telefone.");
      }, 800);
    });
  });
});
