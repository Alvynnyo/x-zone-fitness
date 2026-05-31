document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Nav scroll shadow
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () =>
      nav.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
  }

  // Active nav link
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });

  // Hamburger
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay = document.querySelector('.nav-overlay');
  const overlayClose = document.querySelector('.nav-overlay-close');

  const openMenu = () => {
    overlay?.classList.add('open');
    hamburger?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    overlay?.classList.remove('open');
    hamburger?.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', openMenu);
  overlayClose?.addEventListener('click', closeMenu);
  overlay?.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeMenu));

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Testimonials carousel
  function getInitials(name) {
    const parts = name.replace(/\./g, '').trim().split(/\s+/);
    if (!parts[0]) return '?';
    return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
  }

  function makeAvatarSVG(name) {
    const initials = getInitials(name);
    return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="40" cy="40" r="40" fill="#005400"/><text x="40" y="40" dy=".35em" text-anchor="middle" font-family="'Bebas Neue', sans-serif" font-size="28" fill="white">${initials}</text></svg>`;
  }

  function initTestimonialsCarousel() {
    const stage = document.getElementById('testimonials-carousel');
    const dotsContainer = document.getElementById('testimonials-dots');
    const prevBtn = document.getElementById('testimonials-prev');
    const nextBtn = document.getElementById('testimonials-next');
    if (!stage || !dotsContainer) return;

    let current = 0;
    let autoplayTimer = null;

    function updatePositions() {
      const cards = stage.querySelectorAll('.tc-card');
      const total = cards.length;
      if (!total) return;
      cards.forEach((card, i) => {
        card.classList.remove('tc-card--center', 'tc-card--left', 'tc-card--right', 'tc-card--hidden');
        const offset = ((i - current) % total + total) % total;
        if (offset === 0) card.classList.add('tc-card--center');
        else if (offset === total - 1) card.classList.add('tc-card--left');
        else if (offset === 1) card.classList.add('tc-card--right');
        else card.classList.add('tc-card--hidden');
      });
    }

    function updateDots() {
      dotsContainer.querySelectorAll('.tc-dot').forEach((dot, i) =>
        dot.classList.toggle('active', i === current)
      );
    }

    function goTo(idx, stop) {
      const total = stage.querySelectorAll('.tc-card').length;
      if (!total) return;
      current = ((idx % total) + total) % total;
      if (stop) { clearInterval(autoplayTimer); autoplayTimer = null; }
      updatePositions();
      updateDots();
    }

    function buildCards() {
      const data = getVal('testimonials');
      if (!data || !data.length) return;
      const total = data.length;
      if (current >= total) current = 0;
      stage.innerHTML = '';
      dotsContainer.innerHTML = '';
      data.forEach((t, i) => {
        const card = document.createElement('div');
        card.className = 'tc-card';
        card.dataset.index = i;
        card.innerHTML = `<div class="tc-avatar">${makeAvatarSVG(t.name)}</div><div class="tc-name">${t.name}</div><div class="tc-result">${t.result}</div><p class="tc-quote">${t.quote}</p>`;
        stage.appendChild(card);
      });
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'tc-dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', `Témoignage ${i + 1}`);
        dot.addEventListener('click', () => goTo(i, true));
        dotsContainer.appendChild(dot);
      }
      updatePositions();
      if (!autoplayTimer) autoplayTimer = setInterval(() => goTo(current + 1, false), 5000);
    }

    stage.addEventListener('click', e => {
      const card = e.target.closest('.tc-card');
      if (!card) return;
      const idx = parseInt(card.dataset.index, 10);
      if (idx !== current) goTo(idx, true);
    });

    prevBtn?.addEventListener('click', () => goTo(current - 1, true));
    nextBtn?.addEventListener('click', () => goTo(current + 1, true));

    document.addEventListener('keydown', e => {
      if (document.querySelector('.lightbox.open')) return;
      if (e.key === 'ArrowLeft') goTo(current - 1, true);
      if (e.key === 'ArrowRight') goTo(current + 1, true);
    });

    let touchStartX = 0;
    stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      const d = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50) d > 0 ? goTo(current + 1, true) : goTo(current - 1, true);
    }, { passive: true });

    document.addEventListener('i18n:updated', buildCards);
  }

  initTestimonialsCarousel();

  // Lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || !galleryItems.length) return;

  const lbLabel = lightbox.querySelector('.lightbox-label');
  const lbCounter = lightbox.querySelector('.lightbox-counter');
  const lbPrev = lightbox.querySelector('.lightbox-prev');
  const lbNext = lightbox.querySelector('.lightbox-next');
  const lbClose = lightbox.querySelector('.lightbox-close');
  const total = galleryItems.length;
  let idx = 0;

  const showAt = (i) => {
    idx = ((i % total) + total) % total;
    if (lbLabel) lbLabel.textContent = galleryItems[idx].querySelector('.gallery-label')?.textContent || `Photo ${idx + 1}`;
    if (lbCounter) lbCounter.textContent = `${idx + 1} / ${total}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, i) => item.addEventListener('click', () => showAt(i)));
  lbPrev?.addEventListener('click', () => showAt(idx - 1));
  lbNext?.addEventListener('click', () => showAt(idx + 1));
  lbClose?.addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showAt(idx - 1);
    if (e.key === 'ArrowRight') showAt(idx + 1);
  });

  // Touch swipe
  let tx = 0;
  lightbox.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) d > 0 ? showAt(idx + 1) : showAt(idx - 1);
  }, { passive: true });
});
