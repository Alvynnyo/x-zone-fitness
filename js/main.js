const videos = [];

function refreshBodyLock() {
  const locked =
    document.getElementById('mobile-menu')?.classList.contains('is-open') ||
    document.getElementById('contact-overlay')?.classList.contains('active') ||
    document.getElementById('video-player-overlay')?.classList.contains('active');

  document.body.style.overflow = locked ? 'hidden' : '';
}

function switchLang(lang) {
  if (typeof changeLangWithCurtain === 'function') {
    changeLangWithCurtain(lang);
  } else if (typeof setLang === 'function') {
    setLang(lang);
  }
}

function toggleMobileMenu(forceOpen) {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');
  if (!menu) return;

  const nextState = typeof forceOpen === 'boolean' ? forceOpen : !menu.classList.contains('is-open');
  menu.classList.toggle('is-open', nextState);
  menu.setAttribute('aria-hidden', String(!nextState));
  hamburger?.classList.toggle('active', nextState);
  hamburger?.setAttribute('aria-expanded', String(nextState));
  refreshBodyLock();
}

function openContactPopup() {
  const overlay = document.getElementById('contact-overlay');
  if (!overlay) return;

  overlay.classList.add('active');
  document.body.classList.add('contact-open');
  refreshBodyLock();
  window.requestAnimationFrame(() => document.getElementById('contact-close')?.focus());
}

function closeContactPopup() {
  const overlay = document.getElementById('contact-overlay');
  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.classList.remove('contact-open');
  refreshBodyLock();
}

function renderVideos(category = 'all') {
  const cards = document.querySelectorAll('#videos-grid .video-card');
  if (!cards.length) return;
  cards.forEach(card => {
    card.hidden = !(category === 'all' || card.dataset.category === category);
  });
}

function openVideoPlayer(videoId) {
  const overlay = document.getElementById('video-player-overlay');
  const iframe = document.getElementById('video-iframe');
  if (!overlay || !iframe) return;

  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  overlay.classList.add('active');
  refreshBodyLock();
}

function closeVideoPlayer() {
  const overlay = document.getElementById('video-player-overlay');
  const iframe = document.getElementById('video-iframe');
  if (!overlay || !iframe) return;

  overlay.classList.remove('active');
  iframe.src = '';
  refreshBodyLock();
}

function openVideoPopup() {
  if (!videos.length) return;
  openVideoPlayer(videos[0].id);
}

function updateActiveNavLink() {
  const sections = ['formules', 'videos'];
  const links = document.querySelectorAll('#hero-links a');
  let current = '';

  sections.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;

    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      current = id;
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');

    if (current && href === `#${current}`) {
      link.classList.add('active');
    }

    if (!current && (href === '#hero' || href === '#' || href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function updateHeroNavOnScroll() {
  const heroNav = document.getElementById('hero-nav');
  if (!heroNav) return;

  if (window.scrollY > 60) {
    heroNav.classList.add('scrolled');
  } else {
    heroNav.classList.remove('scrolled');
  }

  updateActiveNavLink();
}

// Pager témoignages : 2 cartes visibles (1 sur mobile), défilement par les flèches.
function initTestimonialsPager() {
  const pair = document.getElementById('testimonials-pair');
  if (!pair) return;
  const cards = Array.from(pair.querySelectorAll('.testimonial-card'));
  const prev = document.querySelector('[data-testi-prev]');
  const next = document.querySelector('[data-testi-next]');
  if (cards.length <= 1 || !prev || !next) return;

  const total = cards.length;
  let start = 0;

  const render = () => {
    const perView = window.matchMedia('(max-width: 760px)').matches ? 1 : 2;
    const visible = new Set();
    for (let i = 0; i < perView; i++) visible.add((start + i) % total);
    cards.forEach((card, i) => { card.hidden = !visible.has(i); });
  };

  prev.addEventListener('click', () => { start = (start - 1 + total) % total; render(); });
  next.addEventListener('click', () => { start = (start + 1) % total; render(); });
  window.addEventListener('resize', render, { passive: true });
  render();
}

function initTestimonialsCarousel() {
  const carousel = document.querySelector('.testimonial-carousel');
  const slides = Array.from(document.querySelectorAll('[data-testimonial-slide]'));
  const previous = document.querySelector('[data-testimonial-prev]');
  const next = document.querySelector('[data-testimonial-next]');
  const currentLabel = document.querySelector('[data-testimonial-current]');
  if (!carousel || !slides.length || !previous || !next) return;

  let current = 0;

  const render = () => {
    slides.forEach((slide, index) => {
      const active = index === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    if (currentLabel) currentLabel.textContent = String(current + 1).padStart(2, '0');
  };

  const move = direction => {
    current = (current + direction + slides.length) % slides.length;
    render();
  };

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });

  carousel.setAttribute('tabindex', '0');
  render();
}

function initPlanAccordions() {
  const toggles = document.querySelectorAll('.plan-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.plan-card');
      const open = !card?.classList.contains('is-open');
      card?.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  });

  const syncForViewport = () => {
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    toggles.forEach((toggle, index) => {
      const card = toggle.closest('.plan-card');
      const open = !mobile || index === 0;
      card?.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  };

  syncForViewport();
  window.addEventListener('resize', syncForViewport, { passive: true });
}

// Charge une photo Pexels via la Netlify Function et l'applique sur la cible.
// `target` accepte un sélecteur CSS OU un élément. Pour un <img>, on remplace
// son `src` ; pour tout autre élément, on pose un `background-image`.
// Toute erreur (réseau, status != 200, aucune photo, image illisible) est silencieuse :
// on ne touche jamais au visuel existant — le src local / le fond CSS d'origine reste en place.
function loadGymPhoto(query, target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) {
    console.warn(`[pexels] cible introuvable: ${target}`);
    return Promise.resolve(false);
  }

  // État "chargement" : la cible affiche un skeleton et masque son visuel
  // (le hero passe en opacity 0) le temps du préchargement — pas de bascule visible.
  el.classList.add('pexels-loading');

  const endpoint = `/.netlify/functions/pexels?query=${encodeURIComponent(query)}&per_page=1`;

  return fetch(endpoint)
    .then(res => {
      if (!res.ok) throw new Error(`status ${res.status}`);
      return res.json();
    })
    .then(data => {
      const url = data?.photos?.[0]?.src?.large2x;
      if (!url) throw new Error('aucune photo retournée');

      // On précharge entièrement l'image AVANT de l'afficher (aucun rendu partiel).
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error('image non chargée'));
        img.src = url;
      });
    })
    .then(url => {
      if (el.tagName === 'IMG') {
        el.src = url;
      } else {
        el.style.backgroundImage = `url("${url}")`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.style.backgroundRepeat = 'no-repeat';
      }
      // Image préchargée prête : on retire le skeleton et on révèle directement Pexels.
      el.classList.remove('pexels-loading');
      el.classList.add('pexels-loaded');
      return true;
    })
    .catch(err => {
      // Échec silencieux : on retire le skeleton et on révèle le visuel d'origine (fallback local).
      el.classList.remove('pexels-loading');
      el.classList.add('pexels-failed');
      console.warn(`[pexels] "${query}" non chargée (${err.message}) — visuel d'origine conservé.`);
      return false;
    });
}

// Préchargement Pexels lancé au plus tôt (le script est en fin de <body>, les
// cibles existent déjà) : le skeleton s'applique avant le premier paint, évitant
// tout flash du visuel local avant l'image Pexels.
loadGymPhoto('gym equipment dramatic lighting', '#gallery-header');
document.querySelectorAll('[data-pexels-query]').forEach(el =>
  loadGymPhoto(el.dataset.pexelsQuery, el)
);

Object.assign(window, {
  switchLang,
  toggleMobileMenu,
  openContactPopup,
  closeContactPopup,
  renderVideos,
  openVideoPlayer,
  closeVideoPlayer,
  openVideoPopup,
  loadGymPhoto
});

document.addEventListener('DOMContentLoaded', () => {
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();

  updateHeroNavOnScroll();
  window.addEventListener('scroll', updateHeroNavOnScroll, { passive: true });

  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () =>
      nav.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
  }

  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) link.classList.add('active');
  });

  document.querySelectorAll('a[href="#contact-popup"], #nav-contact').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      openContactPopup();
    });
  });

  document.querySelector('.mobile-menu-close')?.addEventListener('click', () => {
    toggleMobileMenu(false);
  });

  document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', event => {
      toggleMobileMenu(false);

      if (link.hasAttribute('data-mobile-contact')) {
        event.preventDefault();
        openContactPopup();
      }
    });
  });

  document.addEventListener('click', event => {
    const menu = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger');
    if (!menu?.classList.contains('is-open')) return;
    if (menu.contains(event.target) || hamburger?.contains(event.target)) return;

    toggleMobileMenu(false);
  });

  document.querySelectorAll('#contactForm input[type="radio"][name="program"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const proxy = radio.form?.querySelector('select.program-proxy[name="program"]');
      if (proxy) proxy.value = radio.value;
    });
  });

  document.querySelectorAll('.video-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.video-tab').forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      renderVideos(this.dataset.category);
    });
  });
  renderVideos();
  initTestimonialsPager();

  // Masque la vignette vidéo tant qu'aucune vidéo n'est disponible (évite un clic sans effet).
  // Se réaffiche automatiquement dès que `videos` contient au moins une entrée.
  const heroVideoThumb = document.getElementById('hero-video-thumb');
  if (heroVideoThumb) heroVideoThumb.style.display = videos.length ? '' : 'none';

  // Re-rend le message vidéos au chargement i18n initial et à chaque changement de langue.
  document.addEventListener('i18n:updated', () => {
    renderVideos();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeContactPopup();
      closeVideoPlayer();
      toggleMobileMenu(false);
    }
  });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

});
