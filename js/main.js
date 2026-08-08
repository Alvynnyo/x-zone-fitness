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
  const grid = document.getElementById('videos-grid');
  if (!grid) return;
  const msg = window.i18n?.t('videosComingSoon') || 'Vidéos bientôt disponibles.';
  grid.innerHTML = `<div class="videos-coming-soon">${msg}</div>`;
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
  const sections = ['coach', 'videos'];
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

    if (!current && (href === '#' || href === 'index.html')) {
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

// Charge une photo Pexels via la Netlify Function et l'applique en fond.
// Toute erreur (réseau, status != 200, aucune photo, image illisible) est silencieuse :
// on ne touche jamais au style existant, le fond CSS d'origine reste en place.
function loadGymPhoto(query, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) {
    console.warn(`[pexels] cible introuvable: ${targetSelector}`);
    return Promise.resolve(false);
  }

  const endpoint = `/.netlify/functions/pexels?query=${encodeURIComponent(query)}&per_page=1`;

  return fetch(endpoint)
    .then(res => {
      if (!res.ok) throw new Error(`status ${res.status}`);
      return res.json();
    })
    .then(data => {
      const url = data?.photos?.[0]?.src?.large2x;
      if (!url) throw new Error('aucune photo retournée');

      // On précharge : si l'URL Pexels échoue, on n'écrase pas le fond existant.
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error('image non chargée'));
        img.src = url;
      });
    })
    .then(url => {
      target.style.backgroundImage = `url("${url}")`;
      target.style.backgroundSize = 'cover';
      target.style.backgroundPosition = 'center';
      target.style.backgroundRepeat = 'no-repeat';
      return true;
    })
    .catch(err => {
      console.warn(`[pexels] "${query}" non chargée (${err.message}) — fond d'origine conservé.`);
      return false;
    });
}

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

  loadGymPhoto('gym equipment dramatic lighting', '#gallery-header');
});
