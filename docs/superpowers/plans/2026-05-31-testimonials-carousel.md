# Testimonials Hybrid Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer la grille statique de témoignages sur `index.html` par un carousel hybride — coverflow 3D sur desktop, carte unique style stories sur mobile — sans aucune dépendance externe.

**Architecture:** Carousel vanilla JS injecté à `DOMContentLoaded`, piloté par bascule de classes CSS (`tc-card--center / --left / --right / --hidden`). Desktop : CSS `perspective` + `rotateY` / `scale` / `translateX`. Mobile : media-query override qui aplatit le 3D et affiche une seule carte à la fois via fade opacity. Le code d'init est inséré **avant** le `return` lightbox ligne 55 de `main.js` qui stoppe tout le reste du code sur les pages sans lightbox (dont `index.html`).

**Tech Stack:** HTML5, CSS3 (custom properties, transforms 3D, perspective), JS ES6+, i18n.js existant, Git.

---

## Fichiers modifiés

| Fichier | Rôle |
|---|---|
| `lang/fr.json` | Ajout clé racine `testimonialsTitle` |
| `lang/en.json` | Ajout clé racine `testimonialsTitle` |
| `css/styles.css` | Remplacement bloc `=== TESTIMONIALS ===` par styles carousel (`.tc-*`, `.testimonials-section`, `.testimonials-dots`, `.testimonials-arrows`) |
| `index.html` | Remplacement `<section>` testimonials statique par la coquille HTML carousel |
| `js/main.js` | Ajout tableau `testimonials[]` + `initTestimonialsCarousel()` avant le `return` lightbox |

---

## Task 1 : Clés i18n

**Files:**
- Modify: `lang/fr.json`
- Modify: `lang/en.json`

- [ ] **Step 1 : Ajouter la clé FR dans `lang/fr.json`**

Ouvrir `lang/fr.json`. Ajouter après l'entrée `"footer": { ... }` (avant le `}` fermant du JSON racine) :

```json
  "testimonialsTitle": "CE QUE DISENT NOS CLIENTS"
```

Le fichier doit rester du JSON valide (virgule après `footer` si besoin).

- [ ] **Step 2 : Ajouter la clé EN dans `lang/en.json`**

Même opération dans `lang/en.json` :

```json
  "testimonialsTitle": "WHAT OUR CLIENTS SAY"
```

- [ ] **Step 3 : Valider le JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('lang/fr.json','utf8')); JSON.parse(require('fs').readFileSync('lang/en.json','utf8')); console.log('OK')"
```

Sortie attendue : `OK`

- [ ] **Step 4 : Commit**

```bash
git add lang/fr.json lang/en.json
git commit -m "feat: add testimonialsTitle i18n key (FR + EN)"
```

---

## Task 2 : CSS carousel

**Files:**
- Modify: `css/styles.css`

Le bloc à remplacer se situe vers la ligne 477. Il commence par `/* === TESTIMONIALS ===` et se termine par `@media (min-width: 768px) { .testimonials-grid { ... } }`.

- [ ] **Step 1 : Remplacer le bloc `=== TESTIMONIALS ===` dans `css/styles.css`**

Trouver et remplacer exactement ce bloc :

```css
/* === TESTIMONIALS === */
.testimonials-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
.testimonial-card { background: var(--color-gray-light); border-radius: var(--radius-card); padding: 2rem; }
.testimonial-quote { font-size: 3.5rem; color: var(--color-primary); line-height: 0.6; margin-bottom: 1rem; font-family: Georgia, serif; }
.testimonial-text { color: var(--color-gray-text); font-style: italic; line-height: 1.7; margin-bottom: 1.25rem; }
.testimonial-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
.testimonial-name { font-weight: 700; font-size: 0.95rem; }
.testimonial-stars { display: flex; gap: 3px; color: #f59e0b; flex-shrink: 0; }
.testimonial-stars svg { width: 15px; height: 15px; }

@media (min-width: 768px) { .testimonials-grid { grid-template-columns: repeat(3,1fr); } }
```

Par :

```css
/* === TESTIMONIALS CAROUSEL === */
.testimonials-section { padding: 4rem 0 3rem; }
.testimonials-section .section-title { margin-bottom: 3rem; padding: 0 1.25rem; }

/* Stage */
#testimonials-carousel {
  position: relative;
  perspective: 1200px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

/* Cards */
.tc-card {
  position: absolute;
  width: 300px;
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.8s cubic-bezier(.4,2,.3,1);
  will-change: transform, opacity;
  cursor: default;
}

.tc-card--center {
  transform: scale(1) translateX(0) translateY(0) rotateY(0deg);
  z-index: 3;
  opacity: 1;
  pointer-events: auto;
}

.tc-card--left {
  transform: scale(0.85) translateX(-280px) translateY(-40px) rotateY(15deg);
  z-index: 2;
  opacity: 0.7;
  pointer-events: auto;
  cursor: pointer;
}

.tc-card--right {
  transform: scale(0.85) translateX(280px) translateY(-40px) rotateY(-15deg);
  z-index: 2;
  opacity: 0.7;
  pointer-events: auto;
  cursor: pointer;
}

.tc-card--hidden {
  opacity: 0;
  pointer-events: none;
  z-index: 1;
  transform: scale(0.7) translateX(0) translateY(-40px) rotateY(0deg);
}

/* Avatar */
.tc-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  flex-shrink: 0;
  background: var(--color-primary);
}

.tc-avatar svg,
.tc-avatar img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.tc-name {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  line-height: 1.1;
  color: var(--color-black);
  margin-bottom: 0.25rem;
}

.tc-result {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.3px;
  margin-bottom: 1rem;
}

.tc-quote {
  font-family: var(--font-body);
  font-style: italic;
  color: var(--color-gray-text);
  font-size: 0.88rem;
  line-height: 1.65;
}

/* Dots */
.testimonials-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 2rem;
}

.tc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cccccc;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s ease;
}

.tc-dot.active { background: var(--color-primary); }

/* Arrows */
.testimonials-arrows {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.testimonials-arrow-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-black);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.testimonials-arrow-btn:hover { background: var(--color-primary); }

.testimonials-arrow-btn svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Mobile — stories */
@media (max-width: 768px) {
  #testimonials-carousel {
    perspective: none;
    height: auto;
    min-height: 300px;
    padding: 0 1.25rem;
    display: flex;
    justify-content: center;
  }

  .tc-card {
    width: 100%;
    max-width: 400px;
    transition: opacity 0.4s ease, transform 0.4s ease;
    cursor: default;
  }

  .tc-card--center {
    position: relative;
    transform: translateX(0);
    opacity: 1;
  }

  .tc-card--left,
  .tc-card--right {
    position: absolute;
    transform: translateX(0);
    opacity: 0;
    pointer-events: none;
    cursor: default;
  }

  .tc-card--hidden {
    transform: translateX(0);
  }

  .tc-avatar { width: 96px; height: 96px; }
}
```

- [ ] **Step 2 : Commit**

```bash
git add css/styles.css
git commit -m "feat: add testimonials carousel CSS (3D desktop + stories mobile)"
```

---

## Task 3 : Structure HTML dans `index.html`

**Files:**
- Modify: `index.html` (lignes 161–214)

- [ ] **Step 1 : Remplacer la section testimonials statique**

Trouver le bloc suivant dans `index.html` (commence à `<!-- TÉMOIGNAGES -->`) :

```html
<!-- TÉMOIGNAGES -->
<section aria-labelledby="testimonials-title">
  <div class="container">
    <h2 class="section-title" id="testimonials-title" data-i18n="testimonials.title">ILS NOUS FONT CONFIANCE</h2>
    <div class="testimonials-grid">

      <div class="testimonial-card reveal">
        <div class="testimonial-quote" aria-hidden="true">"</div>
        <p class="testimonial-text" data-i18n="testimonials.t1_text">En 5 mois avec Ronald, j'ai perdu 18kg…</p>
        <div class="testimonial-footer">
          <span class="testimonial-name" data-i18n="testimonials.t1_name">Marie-Pier T.</span>
          <span class="testimonial-stars" aria-label="5 étoiles">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </span>
        </div>
      </div>

      <div class="testimonial-card reveal">
        <div class="testimonial-quote" aria-hidden="true">"</div>
        <p class="testimonial-text" data-i18n="testimonials.t2_text">En 3 mois d'entraînement, j'ai gagné en force…</p>
        <div class="testimonial-footer">
          <span class="testimonial-name" data-i18n="testimonials.t2_name">Jean-François B.</span>
          <span class="testimonial-stars" aria-label="5 étoiles">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </span>
        </div>
      </div>

      <div class="testimonial-card reveal">
        <div class="testimonial-quote" aria-hidden="true">"</div>
        <p class="testimonial-text" data-i18n="testimonials.t3_text">Ronald a complètement changé ma vision du fitness…</p>
        <div class="testimonial-footer">
          <span class="testimonial-name" data-i18n="testimonials.t3_name">Karine L.</span>
          <span class="testimonial-stars" aria-label="5 étoiles">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </span>
        </div>
      </div>

    </div>
  </div>
</section>
```

Remplacer par :

```html
<!-- TÉMOIGNAGES -->
<section class="testimonials-section">
  <h2 class="section-title" data-i18n="testimonialsTitle">CE QUE DISENT NOS CLIENTS</h2>
  <div id="testimonials-carousel"></div>
  <div class="testimonials-dots" id="testimonials-dots"></div>
  <div class="testimonials-arrows">
    <button class="testimonials-arrow-btn" id="testimonials-prev" aria-label="Précédent">
      <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <button class="testimonials-arrow-btn" id="testimonials-next" aria-label="Suivant">
      <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>
    </button>
  </div>
</section>
```

- [ ] **Step 2 : Commit**

```bash
git add index.html
git commit -m "feat: replace static testimonials with carousel HTML shell"
```

---

## Task 4 : Logique JS dans `main.js`

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1 : Insérer le bloc avant le commentaire `// Lightbox`**

Dans `js/main.js`, trouver exactement :

```js
  // Lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || !galleryItems.length) return;
```

Insérer le bloc suivant **immédiatement avant** ces lignes :

```js
  // Testimonials carousel
  const testimonials = [
    {
      name: "Marie-Pier T.",
      result: "-18kg en 5 mois",
      quote: "Ronald a complètement changé mon rapport au sport. Je n'aurais jamais cru pouvoir me transformer autant en si peu de temps.",
      avatar: "images/avatar-01.jpg"
    },
    {
      name: "Jean-François B.",
      result: "+12kg de masse en 4 mois",
      quote: "Programme sérieux, suivi constant et résultats au rendez-vous. Je recommande sans hésiter à quiconque veut progresser rapidement.",
      avatar: "images/avatar-02.jpg"
    },
    {
      name: "Karine L.",
      result: "Transformation complète en 6 mois",
      quote: "Ce qui m'a le plus marquée c'est le suivi personnalisé. Ronald s'adapte vraiment à ton niveau et à tes contraintes.",
      avatar: "images/avatar-03.jpg"
    },
    {
      name: "Samuel G.",
      result: "-10kg et prise de masse",
      quote: "J'avais essayé plusieurs coachs avant Ronald. C'est le seul qui a su me pousser au bon moment sans jamais me décourager.",
      avatar: "images/avatar-04.jpg"
    },
  ];

  function getInitials(name) {
    const parts = name.replace(/\./g, '').trim().split(/\s+/);
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

    const total = testimonials.length;
    let current = 0;
    let autoplayTimer = null;

    testimonials.forEach((t, i) => {
      const card = document.createElement('div');
      card.className = 'tc-card';
      card.dataset.index = i;
      card.innerHTML = `<div class="tc-avatar">${makeAvatarSVG(t.name)}</div><div class="tc-name">${t.name}</div><div class="tc-result">${t.result}</div><p class="tc-quote">${t.quote}</p>`;
      stage.appendChild(card);
    });

    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'tc-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Témoignage ${i + 1}`);
      dot.addEventListener('click', () => goTo(i, true));
      dotsContainer.appendChild(dot);
    }

    function updatePositions() {
      const cards = stage.querySelectorAll('.tc-card');
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
      current = ((idx % total) + total) % total;
      if (stop) { clearInterval(autoplayTimer); autoplayTimer = null; }
      updatePositions();
      updateDots();
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
      if (e.key === 'ArrowLeft') goTo(current - 1, true);
      if (e.key === 'ArrowRight') goTo(current + 1, true);
    });

    let touchStartX = 0;
    stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      const d = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50) d > 0 ? goTo(current + 1, true) : goTo(current - 1, true);
    }, { passive: true });

    autoplayTimer = setInterval(() => goTo(current + 1, false), 5000);
    updatePositions();
  }

  initTestimonialsCarousel();

```

- [ ] **Step 2 : Vérifier que `initTestimonialsCarousel()` est bien avant le bloc `// Lightbox`**

```bash
grep -n "initTestimonialsCarousel\|// Lightbox" js/main.js
```

Sortie attendue : la ligne `initTestimonialsCarousel();` doit avoir un numéro **inférieur** à la ligne `// Lightbox`.

- [ ] **Step 3 : Commit**

```bash
git add js/main.js
git commit -m "feat: add testimonials carousel JS (3D desktop, stories mobile, autoplay)"
```

---

## Task 5 : Vérification navigateur

Aucun build requis — ouvrir `index.html` directement dans un navigateur.

- [ ] **Step 1 : Ouvrir dans le navigateur**

```bash
# Windows PowerShell
Start-Process "C:\Users\DELL\Documents\DO_IT\Coach_RONALD\x-zone-fitness\index.html"
```

- [ ] **Step 2 : Checks desktop (fenêtre ≥ 769px)**

  - [ ] 3 cartes visibles : centre (grand, opacité 1), gauche + droite (85% taille, légèrement inclinées, 70% opacité)
  - [ ] Cliquer carte gauche → elle passe au centre avec transition fluide 0.8s
  - [ ] Cliquer carte droite → idem
  - [ ] Flèche ← → fonctionnent
  - [ ] Clavier ← → navigue le carousel
  - [ ] Dots : le point actif est vert `#005400`, se synchronise au changement
  - [ ] Autoplay : avance automatiquement toutes les ~5 secondes
  - [ ] Clic sur flèche → l'autoplay s'arrête (vérifier en attendant 10s sans navigation)
  - [ ] Survol bouton flèche → fond passe au vert `#005400`

- [ ] **Step 3 : Checks mobile (DevTools → 375px)**

  - [ ] 1 seule carte visible, centrée, pleine largeur
  - [ ] Layout vertical : avatar 96px → nom (Bebas Neue) → résultat vert → citation italic
  - [ ] Pas d'inclinaison 3D visible
  - [ ] Swipe gauche → carte suivante
  - [ ] Swipe droite → carte précédente
  - [ ] Flèches ← → visibles et fonctionnelles sous la carte

- [ ] **Step 4 : Checks i18n**

  - [ ] Cliquer "EN" dans la nav → titre section change en "WHAT OUR CLIENTS SAY"
  - [ ] Cliquer "FR" → revient à "CE QUE DISENT NOS CLIENTS"
  - [ ] Rechargement page avec préférence EN stockée → titre correct dès le chargement

- [ ] **Step 5 : Commit final**

```bash
git status
git add -A
git commit -m "feat: testimonials hybrid carousel — 3D desktop / stories mobile"
```
