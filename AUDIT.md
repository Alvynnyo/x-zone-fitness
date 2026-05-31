# Audit X-Zone Fitness

Date de l'audit : 2026-05-30

Fichiers analyses : `index.html`, `contact.html`, `galerie.html`, `offres.html`, `css/styles.css`, `js/i18n.js`, `js/main.js`, `js/contact.js`, `lang/fr.json`, `lang/en.json`, `netlify.toml`, `.gitignore`, dossier `images/`.

## 1. HTML - structure et semantique

### Hierarchie des headings

- ✅ OK - `index.html` a une hierarchie claire : un `h1` hero puis des `h2` pour les sections (`index.html:91`, `index.html:150`, `index.html:164`, `index.html:220`).
- ❌ Probleme - `contact.html` n'a pas de `h1`; la page commence directement par deux `h2` (`contact.html:70`, `contact.html:104`).
  - Suggestion : ajouter un vrai titre `h1` visible ou accessible, par exemple dans une courte section hero/contact : `<h1 data-i18n="contact.hero_title">CONTACTEZ-NOUS</h1>`.
- ✅ OK - `galerie.html` a un `h1` puis des `h2` (`galerie.html:67`, `galerie.html:75`, `galerie.html:148`).
- ⚠️ A ameliorer - `offres.html` utilise plusieurs `h2` pour chaque carte programme (`offres.html:84`, `offres.html:105`, `offres.html:126`, `offres.html:148`) avant le `h2` de section reassurance (`offres.html:170`). Ce n'est pas bloquant, mais la section programmes n'a pas de titre de section visible.
  - Suggestion : ajouter un `h2 id="offres-title"` avant la grille et passer les titres de cartes en `h3`, ou supprimer l'attribut `aria-labelledby` existant si aucun titre n'est voulu.

### Attributs alt sur les images

- ✅ OK - La seule balise `<img>` est decorative et masquee aux technologies d'assistance : `alt="" aria-hidden="true"` (`index.html:88`).
- ⚠️ A ameliorer - L'image hero est critique visuellement; si elle communique du sens, elle ne devrait pas etre `aria-hidden`.
  - Suggestion : soit conserver `alt=""` si l'image est purement decorative, soit remplacer par un `alt` descriptif et retirer `aria-hidden`.

### `data-i18n` sur les elements a traduire

- ✅ OK - Toutes les cles `data-i18n` et `data-i18n-placeholder` presentes dans les HTML ont une correspondance dans `lang/fr.json` et `lang/en.json`.
- ⚠️ A ameliorer - Plusieurs textes visibles ou labels accessibles ne sont pas branches a l'i18n :
  - Navigation et langue : `aria-label="Navigation principale"`, `aria-label="Ouvrir le menu"`, `aria-label="Menu mobile"`, `aria-label="Fermer le menu"` dans les pages HTML.
  - Etoiles de temoignages : `aria-label="5 etoiles"` (`index.html:172`, `index.html:187`, `index.html:202`).
  - Galerie : labels `Transformation 1` a `Transformation 10` et `aria-label` associes (`galerie.html:77-124`).
  - Lightbox : `aria-label="Visionneuse photo"`, `Photo precedente`, `Fermer`, `Photo suivante` (`galerie.html:132-141`).
  - Reseaux sociaux : labels Instagram/Facebook/YouTube/TikTok dans les footers et la page contact.
  - Suggestion : ajouter des cles i18n pour les attributs accessibles ou etendre `i18n.js` pour gerer `data-i18n-aria-label`.

### Balises meta

- ✅ OK - Les 4 pages ont `lang="fr"`, `charset`, `viewport`, `title`, `meta description`, `canonical`, `og:title`, `og:description`, `og:image`, `og:url`.
- ⚠️ A ameliorer - `og:type` est present seulement sur `index.html` (`index.html:13`), absent de `contact.html`, `galerie.html` et `offres.html`.
  - Suggestion : ajouter `<meta property="og:type" content="website">` aux autres pages.
- ⚠️ A ameliorer - Toutes les pages pointent vers `https://xzonefitness.ca/images/og-image.jpg` (`index.html:11`, `contact.html:11`, `galerie.html:11`, `offres.html:11`), mais ce fichier n'existe pas dans `images/`.
  - Suggestion : ajouter `images/og-image.jpg` ou pointer `og:image` vers une image existante adaptee.

### JSON-LD schema.org dans `index.html`

- ✅ OK - `index.html` contient un schema `LocalBusiness` (`index.html:18-37`).
- ⚠️ A ameliorer - Le telephone est un placeholder (`+15140000000`) et l'adresse est minimale (`index.html:25-31`).
  - Suggestion : remplacer par le vrai numero, ajouter `image`, `priceRange`, `areaServed`, `openingHoursSpecification` si disponibles.

### Liens brises ou `href="#"`

- ❌ Probleme - Les liens sociaux sont des placeholders `href="#"` :
  - `index.html:247`, `index.html:250`, `index.html:253`, `index.html:256`
  - `contact.html:87`, `contact.html:90`, `contact.html:93`, `contact.html:96`, `contact.html:173`, `contact.html:176`, `contact.html:179`, `contact.html:182`
  - `galerie.html:175`, `galerie.html:178`, `galerie.html:181`, `galerie.html:184`
  - `offres.html:250`, `offres.html:253`, `offres.html:256`, `offres.html:259`
  - Suggestion : remplacer par les vraies URL sociales ou masquer ces liens tant qu'ils ne sont pas disponibles.
- ❌ Probleme - `offres.html` contient `<section aria-labelledby="offres-title">` mais aucun element `id="offres-title"` (`offres.html:72`).
  - Suggestion : ajouter un titre avec `id="offres-title"` ou retirer l'attribut.

## 2. CSS - qualite et coherence

### Variables CSS

- ✅ OK - Les couleurs principales, polices, rayons, ombres, transition, largeur conteneur et hauteur nav sont centralises dans `:root` (`css/styles.css:2-16`).
- ⚠️ A ameliorer - Plusieurs couleurs restent hardcodees alors qu'elles pourraient devenir des tokens :
  - Bordures : `#e5e5e5` (`css/styles.css:376`), `#e0e0e0` (`css/styles.css:751`)
  - Etoiles : `#f59e0b` (`css/styles.css:484`)
  - Etats formulaire : `#e8f5e9`, `#1b5e20`, `#a5d6a7`, `#fce4ec`, `#880e4f`, `#f48fb1` (`css/styles.css:777-778`)
  - Variantes de verts en gradients (`css/styles.css:327`, `css/styles.css:451`, `css/styles.css:564-577`, `css/styles.css:612`)
  - Suggestion : ajouter `--color-border`, `--color-warning`, `--color-success-bg`, `--color-error-bg`, etc.

### Regles dupliquees ou contradictoires

- ⚠️ A ameliorer - `hero-contact.png` est reference deux fois : hero court contact (`css/styles.css:360`) et section contact immersive (`css/styles.css:673`), mais la classe `hero-short--contact` n'est pas utilisee dans `contact.html`.
  - Suggestion : supprimer `.hero-short--contact` si la page contact reste immersive.
- ⚠️ A ameliorer - Le hero a `margin: 16px` en mobile (`css/styles.css:223`), puis `margin: 16px 16px 0` en desktop (`css/styles.css:311`), ce qui retire la marge basse uniquement au desktop.
  - Suggestion : uniformiser selon l'intention visuelle (`margin: 16px` partout, ou `margin: 16px 16px 0` partout).
- ⚠️ A ameliorer - Une media query utilise `max-width` (`css/styles.css:530`) alors que le reste est majoritairement mobile-first en `min-width`.
  - Suggestion : definir d'abord le style mobile pour `.cta-section` / `.cta-card`, puis enrichir avec `@media (min-width: 768px)`.

### Classes definies mais jamais utilisees

- ⚠️ A ameliorer - Classes potentiellement inutilisees :
  - `.btn-outline` (`css/styles.css:57`)
  - `.section-subtitle` (`css/styles.css:66`)
  - `.programs-grid` et son stagger (`css/styles.css:393`, `css/styles.css:443`, `css/styles.css:826-828`)
  - `.hero-eyebrow` (`css/styles.css:839`)
  - `.hero-short--contact` (`css/styles.css:359`)
  - Suggestion : supprimer si elles ne servent plus, ou les conserver uniquement si une page future les reutilise.

### Media queries et mobile-first

- ✅ OK - La majorite des layouts partent d'une colonne mobile puis passent en grilles via `min-width` (`stats`, `programs`, `about`, `testimonials`, `offres`, `reassurance`, `gallery`, `footer`).
- ⚠️ A ameliorer - La CTA finale a une exception `@media (max-width: 768px)` (`css/styles.css:530`).
  - Suggestion : inverser en mobile-first pour garder une logique CSS plus simple.

### Valeurs hardcodees

- ⚠️ A ameliorer - Beaucoup de tailles, espacements et couleurs sont hardcodees. Ce n'est pas un bug, mais une dette de design system.
  - Suggestion : creer des tokens `--space-*`, `--radius-button`, `--color-border`, `--color-muted-on-dark`, etc.

## 3. JavaScript - fonctionnement

### `i18n.js`

- ✅ OK - Charge `lang/fr.json` ou `lang/en.json`, applique `data-i18n`, `data-i18n-placeholder`, met a jour `document.documentElement.lang` (`js/i18n.js:5-37`).
- ✅ OK - Toutes les cles utilisees dans les HTML existent dans les deux JSON.
- ⚠️ A ameliorer - Pas de gestion d'erreur si `fetch(lang/*.json)` echoue (`js/i18n.js:5-8`).
  - Suggestion : entourer `loadTranslations` d'un `try/catch` et conserver les textes HTML par defaut en fallback.
- ⚠️ A ameliorer - `textContent` remplace tout contenu enfant; c'est OK pour les elements actuels, mais fragile si un element traduit contient des icones ou balises internes (`js/i18n.js:14-17`).
  - Suggestion : garder cette approche pour les textes simples ou ajouter un mode `data-i18n-html` controle.
- ⚠️ A ameliorer - Les attributs `aria-label`, `title`, `value` ne sont pas traduits.
  - Suggestion : ajouter `data-i18n-aria-label` et `data-i18n-title`.

### `main.js`

- ✅ OK - Le menu hamburger ouvre/ferme l'overlay et bloque le scroll du body (`js/main.js:18-34`).
- ✅ OK - Le scroll reveal utilise `IntersectionObserver` avec fallback (`js/main.js:36-47`).
- ✅ OK - La navigation active est calculee depuis le nom de fichier courant (`js/main.js:12-16`).
- ⚠️ A ameliorer - `aria-expanded` du bouton hamburger n'est jamais mis a jour (`index.html:64`, `js/main.js:18-34`).
  - Suggestion : mettre `hamburger.setAttribute('aria-expanded', 'true/false')` dans `openMenu` / `closeMenu`.
- ⚠️ A ameliorer - Le menu mobile ne se ferme pas via touche `Escape`.
  - Suggestion : ajouter un listener `keydown` quand `.nav-overlay.open`.
- ⚠️ A ameliorer - Les items galerie ont `role="button"` et `tabindex="0"` (`galerie.html:77-124`), mais `main.js` n'ajoute qu'un listener `click` (`js/main.js:74`).
  - Suggestion : ouvrir la lightbox avec `Enter` et `Space` sur les `.gallery-item`.
- ✅ OK - La lightbox est implementee dans `main.js` avec navigation, fermeture, clavier et swipe mobile (`js/main.js:49-99`).
- ⚠️ A ameliorer - Le projet ne contient pas de `gallery.js`; la logique galerie est centralisee dans `main.js`.
  - Suggestion : soit documenter ce choix, soit extraire la lightbox dans `js/gallery.js` et l'inclure seulement sur `galerie.html`.

### `contact.js`

- ❌ Probleme - Le token et le chat ID Telegram sont des placeholders (`js/contact.js:1-2`).
  - Suggestion : ne pas exposer le token cote client; passer par une fonction serverless Netlify ou un backend. Si le token reste cote client, il sera public.
- ⚠️ A ameliorer - Les messages d'etat et validation sont hardcodes en francais (`js/contact.js:4-8`, `js/contact.js:37`, `js/contact.js:60`, `js/contact.js:64`), malgre les cles existantes `contact.sending`, `contact.success`, `contact.error`.
  - Suggestion : reutiliser les traductions chargees ou stocker les messages dans des attributs `data-*`.
- ⚠️ A ameliorer - Le message Telegram utilise des emojis (`js/contact.js:41-46`). Ce n'est pas un bug fonctionnel, mais c'est incoherent avec la regle de design "zero emoji" appliquee aux contenus visibles.
  - Suggestion : remplacer par des libelles texte simples ou des symboles ASCII.

## 4. Fichiers JSON de traduction

### Parite des cles

- ✅ OK - `lang/fr.json` et `lang/en.json` ont exactement le meme nombre de cles finales : 169 / 169.
- ✅ OK - Aucune cle manquante d'un cote ou de l'autre.
- ✅ OK - Toutes les 120 cles `data-i18n` / `data-i18n-placeholder` utilisees dans les HTML existent dans les deux fichiers.

### Cles inutilisees

- ⚠️ A ameliorer - 49 cles existent mais ne sont plus utilisees dans les HTML actuels, notamment :
  - `programs_section.*` depuis la suppression de la section programmes de `index.html`
  - `hero.subtitle`
  - `contact.hero_title`, `contact.hero_subtitle`
  - `contact.sending`, `contact.success`, `contact.error`
  - `offres.*_icon`
  - Suggestion : supprimer les cles mortes ou les reconnecter au HTML/JS.

### Placeholders non remplaces

- ❌ Probleme - Numero de telephone placeholder dans les deux langues : `+1 (514) 000-0000` (`lang/fr.json:171`, `lang/fr.json:181`, `lang/en.json:171`, `lang/en.json:181`).
  - Suggestion : remplacer par le vrai numero ou retirer le telephone tant qu'il n'est pas disponible.
- ⚠️ A ameliorer - Les JSON contiennent encore des cles d'icones en emoji (`lang/fr.json:29`, `40`, `51`, `62`, `143`, `146`, `149`, `152`; idem `lang/en.json`). Elles sont inutilisees, mais incoherentes avec une direction "SVG inline uniquement".
  - Suggestion : supprimer ces cles ou remplacer par des noms d'icones symboliques.

## 5. Images

### Images referencees mais absentes

- ❌ Probleme - `og:image` pointe vers `https://xzonefitness.ca/images/og-image.jpg` dans les 4 pages, mais `images/og-image.jpg` n'existe pas localement.
  - Suggestion : ajouter ce fichier ou modifier les balises OG.
- ✅ OK - Les images CSS existent :
  - `images/hero-offres.png` (`css/styles.css:350`)
  - `images/hero-galerie.png` (`css/styles.css:355`)
  - `images/hero-contact.png` (`css/styles.css:360`, `css/styles.css:673`)
  - `images/liquidimagetest.png` (`css/styles.css:492`)
- ✅ OK - L'image HTML existe : `images/hero.png` (`index.html:88`).

### Images presentes mais jamais utilisees

- ✅ OK - Les 5 images locales sont referencees au moins une fois : `hero.png`, `hero-offres.png`, `hero-galerie.png`, `hero-contact.png`, `liquidimagetest.png`.

### `loading="lazy"`

- ⚠️ A ameliorer - L'image hero HTML n'a pas `loading="lazy"` (`index.html:88`), mais c'est acceptable pour une image above-the-fold.
  - Suggestion : garder eager pour le hero, ajouter plutot `fetchpriority="high"` et dimensions `width`/`height` pour reduire le layout shift.
- ⚠️ A ameliorer - Les images de fond CSS ne peuvent pas utiliser `loading="lazy"` directement.
  - Suggestion : si performance prioritaire, remplacer certaines images de fond par `<picture>` / `<img>` ou precharger uniquement l'image hero de la page courante.

## 6. Performance

### Nombre de requetes HTTP estimees

- ⚠️ A ameliorer - Estimation hors cache :
  - `index.html` : document + CSS + Google Fonts CSS + fichiers font + `images/hero.png` + `liquidimagetest.png` + `js/i18n.js` + `js/main.js` + `lang/fr.json` = environ 9 a 13 requetes selon le nombre de fichiers font.
  - `contact.html` : document + CSS + Google Fonts CSS + fichiers font + `hero-contact.png` + `js/i18n.js` + `js/main.js` + `js/contact.js` + `lang/fr.json` = environ 9 a 13 requetes.
  - `galerie.html` : document + CSS + Google Fonts CSS + fichiers font + `hero-galerie.png` + `liquidimagetest.png` + `js/i18n.js` + `js/main.js` + `lang/fr.json` = environ 9 a 13 requetes.
  - `offres.html` : document + CSS + Google Fonts CSS + fichiers font + `hero-offres.png` + `liquidimagetest.png` + `js/i18n.js` + `js/main.js` + `lang/fr.json` = environ 9 a 13 requetes.
  - Suggestion : optimiser les images, envisager `font-display=swap` deja present dans l'URL, precharger l'image hero de la page courante si necessaire.

### Google Fonts

- ✅ OK - `preconnect` vers `fonts.googleapis.com` et `fonts.gstatic.com` est present sur toutes les pages (`index.html:14-16`, `contact.html:13-15`, `galerie.html:13-15`, `offres.html:13-15`).
- ⚠️ A ameliorer - Les polices sont importees separement sur chaque page statique; c'est normal, mais le poids `Inter 400/500/600/700` peut charger plusieurs fichiers.
  - Suggestion : verifier les poids reellement utilises et supprimer ceux non necessaires.

### Scripts bloquants

- ✅ OK - Les scripts applicatifs sont en fin de `body`, donc non bloquants pour le rendu initial (`index.html:268-269`, `contact.html:194-196`, `galerie.html:196-197`, `offres.html:271-272`).
- ✅ OK - Le JSON-LD dans le `head` de `index.html` est acceptable (`index.html:18`).

## 7. Responsive

### Elements potentiellement problematiques mobile

- ⚠️ A ameliorer - `stats-grid` passe a 3 colonnes des `480px` (`css/styles.css:386`). Sur petits appareils proches de 480px, les labels peuvent devenir serres.
  - Suggestion : tester 390px, 430px et 480px; garder 1 colonne jusqu'a 600px si necessaire.
- ⚠️ A ameliorer - `.cta-card` a `padding: 20px 2px` en mobile (`css/styles.css:530`), ce qui rend le contenu tres colle aux bords internes.
  - Suggestion : utiliser au moins `padding: 24px 16px`.
- ⚠️ A ameliorer - La page `contact.html` n'a pas de H1/hero mais une section immersive avec fond image; sur mobile, le contraste est bon grace a l'overlay, mais le formulaire peut etre long sans ancrage clair.
  - Suggestion : ajouter un titre H1 en haut de la section.

### Tailles de texte mobile

- ✅ OK - Les textes principaux sont majoritairement a `0.9rem` ou plus, les boutons a `1rem`.
- ⚠️ A ameliorer - Certains textes secondaires sont a `0.75rem` (`contact-detail-label`, `footer-col-title`) et peuvent etre petits sur mobile (`css/styles.css:725`, `css/styles.css:787`).
  - Suggestion : viser `0.8125rem` minimum pour les labels importants.

### Cibles tactiles

- ✅ OK - La plupart des boutons/liens principaux respectent au moins 44px : `.btn` `min-height: 48px` (`css/styles.css:46`), hamburger 48px (`css/styles.css:155-156`), boutons lightbox 48px (`css/styles.css:651-652`), social links 48px (`css/styles.css:729-730`).
- ⚠️ A ameliorer - Les liens du footer ont `min-height: 36px` (`css/styles.css:789`), sous la cible tactile recommandee de 44px.
  - Suggestion : passer a `min-height: 44px` ou augmenter le padding vertical.
- ⚠️ A ameliorer - Les boutons de langue ont `height: 30px` (`css/styles.css:135`).
  - Suggestion : utiliser au moins `44px` en hauteur sur mobile.

## 8. SEO

### Titres de pages

- ✅ OK - Les titres sont uniques et descriptifs :
  - `index.html:6`
  - `contact.html:6`
  - `galerie.html:6`
  - `offres.html:6`

### Meta descriptions

- ✅ OK - Les descriptions sont presentes et uniques (`index.html:7`, `contact.html:7`, `galerie.html:7`, `offres.html:7`).

### Open Graph

- ⚠️ A ameliorer - `og:title`, `og:description`, `og:image`, `og:url` sont presents partout.
- ❌ Probleme - `og:type` manque sur 3 pages (`contact.html`, `galerie.html`, `offres.html`).
  - Suggestion : ajouter `<meta property="og:type" content="website">`.
- ❌ Probleme - `og:image` pointe vers un fichier absent localement (`images/og-image.jpg`).
  - Suggestion : creer l'image OG en 1200x630 ou pointer vers une image existante optimisee.

## Synthese priorisee

1. ❌ Corriger les placeholders critiques : Telegram (`js/contact.js:1-2`), telephone (`lang/*.json:171`, `181`), liens sociaux `href="#"`.
2. ❌ Corriger l'accessibilite structurelle : ajouter un `h1` a `contact.html`, corriger `aria-labelledby="offres-title"` dans `offres.html`.
3. ❌ Ajouter ou corriger `og-image.jpg`, puis completer `og:type` sur les pages internes.
4. ⚠️ Brancher les textes accessibles et messages JS a l'i18n.
5. ⚠️ Nettoyer CSS : classes mortes, media query mobile-first, tokens pour couleurs hardcodees.
6. ⚠️ Optimiser images et cibles tactiles secondaires.

## Score global

**78 / 100**

Le site a une base solide : structure multi-pages claire, design coherent, i18n fonctionnel, scripts simples et globalement robustes. Les principaux points qui coutent des points sont les placeholders encore visibles/fonctionnels, quelques manques SEO/OG, une page contact sans `h1`, des liens sociaux factices, et une dette CSS/i18n moderee.
