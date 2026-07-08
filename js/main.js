const videos = [];

function refreshBodyLock() {
  const locked =
    document.getElementById('mobile-menu')?.classList.contains('active') ||
    document.getElementById('contact-overlay')?.classList.contains('active') ||
    document.getElementById('video-player-overlay')?.classList.contains('active');

  document.body.style.overflow = locked ? 'hidden' : '';
}

function switchLang(lang) {
  if (typeof setLang === 'function') setLang(lang);
}

function toggleMobileMenu(forceOpen) {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');
  if (!menu) return;

  const nextState = typeof forceOpen === 'boolean' ? forceOpen : !menu.classList.contains('active');
  menu.classList.toggle('active', nextState);
  hamburger?.classList.toggle('active', nextState);
  hamburger?.setAttribute('aria-expanded', String(nextState));
  refreshBodyLock();
}

function openContactPopup() {
  const overlay = document.getElementById('contact-overlay');
  if (!overlay) return;

  overlay.classList.add('active');
  refreshBodyLock();
  window.requestAnimationFrame(() => document.getElementById('contact-close')?.focus());
}

function closeContactPopup() {
  const overlay = document.getElementById('contact-overlay');
  if (!overlay) return;

  overlay.classList.remove('active');
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

Object.assign(window, {
  switchLang,
  toggleMobileMenu,
  openContactPopup,
  closeContactPopup,
  renderVideos,
  openVideoPlayer,
  closeVideoPlayer,
  openVideoPopup
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
