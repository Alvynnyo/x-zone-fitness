# Design — Carousel Témoignages Hybride (3D Desktop / Stories Mobile)

**Date :** 2026-05-31  
**Projet :** X-Zone Fitness — `x-zone-fitness/`  
**Portée :** Remplacement de la section témoignages statique par un carousel hybride

---

## Contexte

La section testimonials actuelle (`index.html`, lignes 161–214) affiche 3 cartes statiques dans une grille CSS. Elle sera intégralement remplacée par un carousel JS interactif avec deux modes visuels distincts selon la taille d'écran.

---

## Fichiers modifiés

| Fichier | Nature du changement |
|---|---|
| `index.html` | Remplace `<section aria-labelledby="testimonials-title">` par la structure carousel |
| `js/main.js` | Ajout tableau `testimonials[]` + `initTestimonialsCarousel()` avant le `return` lightbox (ligne 55) |
| `css/styles.css` | Ajout des styles carousel (`.testimonials-section`, `.tc-stage`, `.tc-card`, `.tc-dots`, `.tc-arrow-btn`) |
| `lang/fr.json` | Ajout clé racine `"testimonialsTitle"` |
| `lang/en.json` | Ajout clé racine `"testimonialsTitle"` |

**Fichiers non touchés :** `contact.js`, `netlify.toml`, `.gitignore`, `i18n.js`

---

## Structure HTML cible (`index.html`)

```html
<section class="testimonials-section">
  <h2 class="section-title" data-i18n="testimonialsTitle">CE QUE DISENT NOS CLIENTS</h2>
  <div id="testimonials-carousel"></div>
  <div class="testimonials-dots" id="testimonials-dots"></div>
  <div class="testimonials-arrows">
    <button class="testimonials-arrow-btn" id="testimonials-prev" aria-label="Précédent">
      <!-- SVG flèche gauche inline -->
    </button>
    <button class="testimonials-arrow-btn" id="testimonials-next" aria-label="Suivant">
      <!-- SVG flèche droite inline -->
    </button>
  </div>
</section>
```

---

## Données (`js/main.js`)

```js
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
```

---

## Avatars

Aucun fichier `avatar-0*.jpg` n'existe dans `images/`. Chaque carte génère un SVG inline comme avatar par défaut : cercle `#005400`, initiales du prénom + première lettre du nom en blanc, police Bebas Neue.

Algorithme : premier caractère du premier token + premier caractère du dernier token (split par espace).  
Exemples : "Marie-Pier T." → "MT" · "Jean-François B." → "JB" · "Karine L." → "KL" · "Samuel G." → "SG".

---

## Comportement Desktop (`min-width: 769px`) — Carousel 3D

- Conteneur avec `perspective: 1200px`
- 3 cartes visibles simultanément : gauche · centre · droite
- Positions :
  - **Centre** : `scale(1)`, `translateX(0)`, `rotateY(0deg)`, `zIndex: 3`, `opacity: 1`
  - **Gauche** : `scale(0.85)`, `translateX(-280px)`, `translateY(-40px)`, `rotateY(15deg)`, `zIndex: 2`, `opacity: 0.7`
  - **Droite** : `scale(0.85)`, `translateX(280px)`, `translateY(-40px)`, `rotateY(-15deg)`, `zIndex: 2`, `opacity: 0.7`
  - **Autres** : `opacity: 0`, `pointerEvents: none`
- Clic sur carte gauche ou droite → devient la carte centrale
- Transition : `all 0.8s cubic-bezier(.4,2,.3,1)`
- Contenu de chaque carte : avatar rond 80px · nom (Bebas Neue) · résultat en `#005400` · citation (Inter, italic)

## Comportement Mobile (`max-width: 768px`) — Stories

- 1 carte visible à la fois, pleine largeur
- Layout vertical : avatar rond 96px centré · nom · résultat vert · citation
- Swipe gauche/droite (touch events) pour naviguer
- Transition : `opacity + translateX` simple (pas d'effet 3D)
- Flèches ← → visibles sous la carte

## Navigation commune

- Flèches SVG inline, boutons ronds 48px
  - Fond : `#0a0a0a` (var `--color-black`)
  - Hover : `#005400` (var `--color-primary`)
- Dots de pagination : point actif en `#005400`
- Navigation clavier ← →
- Autoplay toutes les 5 secondes — s'arrête au clic

---

## Contrainte technique clé

`main.js` contient un `return` prématuré ligne 55 (`if (!lightbox || !galleryItems.length) return`) qui stoppe tout code suivant sur les pages sans lightbox. L'appel `initTestimonialsCarousel()` doit être placé **avant** cette ligne.

---

## i18n

| Fichier | Clé | Valeur |
|---|---|---|
| `lang/fr.json` | `testimonialsTitle` | `"CE QUE DISENT NOS CLIENTS"` |
| `lang/en.json` | `testimonialsTitle` | `"WHAT OUR CLIENTS SAY"` |

La clé est au niveau racine du JSON (pas imbriquée). Le système `getVal()` de `i18n.js` supporte les clés sans point en réduisant sur un tableau d'un seul élément.

---

## CSS — Variables utilisées

Toutes les couleurs s'appuient sur les variables existantes :
- `--color-primary: #005400`
- `--color-black: #0a0a0a`
- `--color-white: #ffffff`
- `--color-gray-light: #f5f5f5`
- `--font-heading: 'Bebas Neue', sans-serif`
- `--font-body: 'Inter', sans-serif`
- `--radius-card: 16px`
- `--shadow-card`
