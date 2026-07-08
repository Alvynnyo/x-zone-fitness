const galleryItems = [
  { src: 'images/placeholder-coach.jpg', category: 'training', caption: 'Séance force — Épaules' },
  { src: 'images/placeholder-coach.jpg', category: 'training', caption: 'Circuit cardio' },
  { src: 'images/placeholder-coach.jpg', category: 'coaching', caption: 'Session coaching client' },
  { src: 'images/placeholder-coach.jpg', category: 'coaching', caption: 'Coaching personnalisé' },
  { src: 'images/placeholder-coach.jpg', category: 'results', caption: 'Résultat — 3 mois' },
  { src: 'images/placeholder-coach.jpg', category: 'results', caption: 'Transformation complète' },
  { src: 'images/placeholder-coach.jpg', category: 'training', caption: 'Deadlift — Technique' },
  { src: 'images/placeholder-coach.jpg', category: 'coaching', caption: 'Suivi hebdomadaire' },
];

let currentItems = [...galleryItems];
let lightboxIndex = 0;

function renderGallery(filter = 'all') {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  currentItems = filter === 'all' ? galleryItems : galleryItems.filter(i => i.category === filter);
  grid.innerHTML = currentItems.map((item, idx) => `
    <div class="gallery-item" onclick="openLightbox(${idx})">
      <img src="${item.src}" alt="${item.caption}" loading="lazy"
           onerror="this.src='images/placeholder-coach.jpg'">
      <div class="gallery-item-overlay">
        <span class="gallery-item-caption">${item.caption}</span>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      this.style.setProperty('--x', x + '%');
      this.style.setProperty('--y', y + '%');
    });
  });
}

function openLightbox(idx) {
  lightboxIndex = idx;
  const lb = document.getElementById('gallery-lightbox');
  if (!lb) return;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderLightboxMedia();
}

function closeLightbox() {
  const lb = document.getElementById('gallery-lightbox');
  if (!lb) return;
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + currentItems.length) % currentItems.length;
  renderLightboxMedia();
}

function renderLightboxMedia() {
  const item = currentItems[lightboxIndex];
  const media = document.getElementById('lightbox-media');
  const caption = document.getElementById('lightbox-caption');
  if (!media || !item) return;
  media.innerHTML = `<img src="${item.src}" alt="${item.caption}"
    onerror="this.src='images/placeholder-coach.jpg'">`;
  if (caption) caption.textContent = item.caption;
}

document.querySelectorAll('.gallery-filter').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderGallery(this.dataset.filter);
  });
});

document.addEventListener('keydown', e => {
  const lb = document.getElementById('gallery-lightbox');
  if (!lb?.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'Escape') closeLightbox();
});

document.getElementById('gallery-lightbox')?.addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

// Expose handlers used by inline onclick attributes (classic script globals).
Object.assign(window, { renderGallery, openLightbox, closeLightbox, lightboxNav });

document.addEventListener('DOMContentLoaded', () => renderGallery());
