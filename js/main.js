const videos = [];

const programsData = {
  masse: {
    title: 'PRISE DE MASSE',
    titleKey: 'programMasseLabel',
    textTitle: 'Prise de masse',
    textTitleKey: 'programMasseTextTitle',
    desc: 'Construire du muscle, solidement. Un programme structuré pour progresser sans te blesser.',
    descKey: 'programMasseDesc',
    benefits: ['Volume et charge progressifs', 'Suivi nutritionnel adapté', 'Technique et prévention blessure'],
    benefitKeys: ['programMasseBenefit1', 'programMasseBenefit2', 'programMasseBenefit3']
  },
  perte: {
    title: 'PERTE DE POIDS',
    titleKey: 'programPerteLabel',
    textTitle: 'Perte de poids',
    textTitleKey: 'programPerteTextTitle',
    desc: 'Perdre du gras, garder le muscle. Un plan réaliste, sans privation extrême.',
    descKey: 'programPerteDesc',
    benefits: ['Déficit calorique maîtrisé', 'Combinaison force et cardio', 'Suivi de la composition corporelle'],
    benefitKeys: ['programPerteBenefit1', 'programPerteBenefit2', 'programPerteBenefit3']
  },
  perso: {
    title: 'PERSONNALISE',
    titleKey: 'programPersoLabel',
    textTitle: 'Personnalisé',
    textTitleKey: 'programPersoTextTitle',
    desc: 'Ton objectif ne rentre dans aucune case. On construit le programme autour de toi.',
    descKey: 'programPersoDesc',
    benefits: ['Bilan initial complet', 'Programme évolutif', 'Ajustements réguliers avec le coach'],
    benefitKeys: ['programPersoBenefit1', 'programPersoBenefit2', 'programPersoBenefit3']
  }
};

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

function getProgramText(item, keyName, fallbackName) {
  const key = item[keyName];
  return (key && window.i18n?.t(key)) || item[fallbackName];
}

function renderProgram(programId) {
  const data = programsData[programId] || programsData.masse;
  const title = document.getElementById('programs-title');
  const textTitle = document.querySelector('.programs-text-title');
  const desc = document.querySelector('.programs-text-desc');
  const benefitEls = document.querySelectorAll('.programs-benefits [data-i18n-dynamic]');

  if (title) title.textContent = getProgramText(data, 'titleKey', 'title');
  if (textTitle) textTitle.textContent = getProgramText(data, 'textTitleKey', 'textTitle');
  if (desc) desc.textContent = getProgramText(data, 'descKey', 'desc');

  benefitEls.forEach((el, index) => {
    const key = data.benefitKeys[index];
    el.textContent = (key && window.i18n?.t(key)) || data.benefits[index] || '';
  });
}

function setActiveProgram(programId) {
  document.querySelectorAll('.programs-tab').forEach(tab => {
    const isActive = tab.dataset.program === programId;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  renderProgram(programId);
}

function initProgramsShowcase() {
  const tabs = document.querySelectorAll('.programs-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => setActiveProgram(tab.dataset.program || 'masse'));
  });

  const activeTab = document.querySelector('.programs-tab.is-active') || tabs[0];
  setActiveProgram(activeTab.dataset.program || 'masse');
}

function initProgramsVisualTilt() {
  const programsVisualWrap = document.querySelector('.programs-visual-wrap');
  const programsVisual = document.getElementById('programs-visual');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasTouch = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!programsVisualWrap || !programsVisual || !canHover || hasTouch || reduceMotion) return;

  programsVisualWrap.addEventListener('mousemove', event => {
    const rect = programsVisualWrap.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    programsVisual.style.animation = 'none';
    programsVisual.style.transform = `perspective(600px) rotateY(${x * 20}deg) rotateX(${y * -20}deg)`;
  });

  programsVisualWrap.addEventListener('mouseleave', () => {
    programsVisual.style.animation = 'programsFloat 4.5s ease-in-out infinite';
    programsVisual.style.transform = 'translateY(0px)';
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

  initProgramsShowcase();
  initProgramsVisualTilt();

  document.querySelectorAll('.video-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.video-tab').forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      renderVideos(this.dataset.category);
    });
  });
  renderVideos();

  // Re-rend le message vidéos au chargement i18n initial et à chaque changement de langue.
  document.addEventListener('i18n:updated', () => {
    renderVideos();
    const activeProgram = document.querySelector('.programs-tab.is-active')?.dataset.program || 'masse';
    renderProgram(activeProgram);
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
