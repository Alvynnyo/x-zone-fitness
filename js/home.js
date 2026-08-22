let lastContactTrigger = null;

function refreshBodyLock() {
  const menuOpen = document.getElementById('mobile-menu')?.classList.contains('is-open');
  const contactOpen = document.getElementById('contact-overlay')?.classList.contains('is-open');
  document.body.classList.toggle('is-locked', Boolean(menuOpen || contactOpen));
}

function toggleMobileMenu(forceOpen) {
  const menu = document.getElementById('mobile-menu');
  const toggle = document.getElementById('menu-toggle');
  if (!menu) return;

  const open = typeof forceOpen === 'boolean' ? forceOpen : !menu.classList.contains('is-open');
  menu.classList.toggle('is-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  toggle?.setAttribute('aria-expanded', String(open));
  toggle?.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  refreshBodyLock();
}

// Pré-sélectionne l'objectif dans le formulaire (select caché + radio visible).
function preselectProgram(value) {
  if (!value) return;
  const form = document.getElementById('contactForm');
  if (!form) return;
  const select = form.querySelector('select.program-proxy[name="program"]');
  if (select) select.value = value;
  const radio = form.querySelector(`input[type="radio"][name="program"][value="${value}"]`);
  if (radio) radio.checked = true;
}

// `objectif` est un 2e paramètre OPTIONNEL : les appels existants openContactPopup(trigger)
// restent inchangés (aucune présélection). Passer un objectif pré-remplit le formulaire.
function openContactPopup(trigger = document.activeElement, objectif) {
  const overlay = document.getElementById('contact-overlay');
  if (!overlay) return;

  lastContactTrigger = trigger instanceof HTMLElement ? trigger : null;
  toggleMobileMenu(false);
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  preselectProgram(objectif);
  refreshBodyLock();
  window.requestAnimationFrame(() => document.getElementById('contact-close')?.focus());
}

function closeContactPopup() {
  const overlay = document.getElementById('contact-overlay');
  if (!overlay?.classList.contains('is-open')) return;

  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  refreshBodyLock();
  lastContactTrigger?.focus();
  lastContactTrigger = null;
}

function loadGymPhoto(query, target) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return Promise.resolve(false);

  const endpoint = `/.netlify/functions/pexels?query=${encodeURIComponent(query)}&per_page=1`;
  element.classList.add('pexels-loading');

  return fetch(endpoint)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      const url = data?.photos?.[0]?.src?.large2x;
      if (!url) throw new Error('Aucune photo retournée');

      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(url);
        image.onerror = () => reject(new Error('Image non chargée'));
        image.src = url;
      });
    })
    .then(url => {
      if (element.tagName === 'IMG') {
        element.src = url;
      } else {
        element.style.backgroundImage = `url("${url}")`;
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
      }
      element.classList.remove('pexels-loading');
      element.classList.add('pexels-loaded');
      return true;
    })
    .catch(error => {
      element.classList.remove('pexels-loading');
      element.classList.add('pexels-failed');
      console.warn(`[pexels] ${error.message}`);
      return false;
    });
}

Object.assign(window, {
  toggleMobileMenu,
  openContactPopup,
  closeContactPopup,
  loadGymPhoto
});

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('contact-overlay');

  document.getElementById('menu-toggle')?.addEventListener('click', () => toggleMobileMenu());
  document.querySelector('.menu-close')?.addEventListener('click', () => toggleMobileMenu(false));

  document.querySelectorAll('.mobile-menu-links a').forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  document.querySelectorAll('[data-contact-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => openContactPopup(trigger));
  });

  document.getElementById('contact-close')?.addEventListener('click', closeContactPopup);
  overlay?.addEventListener('click', event => {
    if (event.target === overlay) closeContactPopup();
  });

  document.addEventListener('click', event => {
    const toggle = document.getElementById('menu-toggle');
    if (!menu?.classList.contains('is-open')) return;
    if (menu.contains(event.target) || toggle?.contains(event.target)) return;
    toggleMobileMenu(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeContactPopup();
    toggleMobileMenu(false);
  });

  document.querySelectorAll('#contactForm input[type="radio"][name="program"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const proxy = radio.form?.querySelector('select.program-proxy[name="program"]');
      if (proxy) proxy.value = radio.value;
    });
  });

  const year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('[data-pexels-query]').forEach(element => {
    loadGymPhoto(element.dataset.pexelsQuery, element);
  });
});
