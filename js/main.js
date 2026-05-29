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
