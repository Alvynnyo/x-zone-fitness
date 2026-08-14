// Les prochaines photos seront ajoutées depuis le dossier images/galerie/.
const galleryItems = [];

let currentItems = [...galleryItems];
let lightboxIndex = 0;

function renderGallery(filter = 'all') {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  const filters = document.getElementById('gallery-filters');
  if (filters) filters.hidden = galleryItems.length === 0;
  currentItems = filter === 'all' ? galleryItems : galleryItems.filter(i => i.category === filter);

  if (currentItems.length === 0) {
    grid.innerHTML = `
      <div class="gallery-empty" role="status">
        <h3>Les photos arrivent bientôt.</h3>
        <p>De nouvelles images seront ajoutées prochainement.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = currentItems.map((item, idx) => `
    <div class="gallery-item" onclick="openLightbox(${idx})">
      <img src="${item.src}" alt="${item.caption}" loading="lazy">
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
  if (currentItems.length === 0) return;
  lightboxIndex = (lightboxIndex + dir + currentItems.length) % currentItems.length;
  renderLightboxMedia();
}

function renderLightboxMedia() {
  const item = currentItems[lightboxIndex];
  const media = document.getElementById('lightbox-media');
  const caption = document.getElementById('lightbox-caption');
  if (!media || !item) return;
  media.innerHTML = `<img src="${item.src}" alt="${item.caption}">`;
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
