# AUDIT-V2 - X-Zone Fitness

Audit réalisé sur le working tree courant. Aucun fichier du projet n'a été modifié pendant l'audit, à part la création de ce rapport.

## Périmètre réellement lu

✅ OK - Fichiers source lus : `index.html`, `galerie.html`, `offres.html`, `css/styles.css`, `js/main.js`, `js/i18n.js`, `js/contact.js`, `js/gallery.js`, `lang/fr.json`, `lang/en.json`, `netlify.toml`, `netlify/functions/send-telegram.js`, `.gitignore`, `AUDIT.md`, les deux fichiers de docs dans `docs/superpowers/`.

✅ OK - Images inspectées par existence et dimensions : tout le dossier `images/`.

✅ OK - Checks exécutés :
- `node --check js/main.js`
- `node --check js/i18n.js`
- `node --check js/contact.js`
- `node --check js/gallery.js`
- `node --check netlify/functions/send-telegram.js`
- validation JSON FR/EN
- HTTP local : `index.html`, `galerie.html`, `offres.html` répondent en `200` sur `127.0.0.1:8123`

## 1. COHÉRENCE ARCHITECTURALE

❌ Problème critique - `offres.html` existe encore.
- Fichier : `offres.html`
- Preuves : ancienne navbar `offres.html:21`, lien "Programmes" vers `offres.html` `offres.html:33`, ancien hero court `offres.html:64`, grille programmes `offres.html:75`, CTA final `offres.html:220`, footer ancien `offres.html:231`.
- Action : supprimer `offres.html` et supprimer toutes ses règles CSS/i18n associées.

✅ OK - `contact.html` n'existe plus dans le working tree.
- Preuve : `Test-Path contact.html` retourne `False`.
- Note : `git status` indique une suppression non commitée de `contact.html`. À confirmer avant déploiement.

⚠️ À corriger - Liens `href="#"` utilisés comme boutons JS.
- Fichiers/lignes : `galerie.html:20`, `galerie.html:102`, `index.html:192`, `offres.html:55`, `offres.html:250`, `offres.html:253`, `offres.html:256`, `offres.html:259`.
- Impact : ce ne sont pas des liens cassés si JS fonctionne, mais ils sont fragiles et mauvais pour accessibilité/SEO. Les liens sociaux dans `offres.html` sont de vrais placeholders.
- Action : remplacer les contacts par boutons ou `href="#contact-popup"` avec handler, et supprimer les liens sociaux si `offres.html` disparaît.

✅ OK - Les ancres principales de `index.html` et `galerie.html` correspondent à des IDs existants.
- Preuves : `#coach`, `#videos`, `#contact-popup`, `index.html#coach`, `index.html#videos` sont résolus.

⚠️ À corriger - Flux de navigation incohérent entre `index.html` et `galerie.html`.
- Fichiers/lignes : nav intégrée hero dans `index.html:45`, nav sticky/glass séparée dans `galerie.html:14`.
- Impact : deux systèmes visuels et structurels différents pour la navigation.
- Action : soit assumer une nav galerie compacte, soit aligner le style/structure sur la nav hero.

✅ OK - Les boutons Contact des pages actives appellent bien `openContactPopup()`.
- Preuves : `index.html:51`, `index.html:108`, `index.html:192`, `galerie.html:20`, `galerie.html:102`.

## 2. RÉSIDUS DE L'ANCIENNE DA

✅ OK - `index.html` ne contient plus les anciennes sections stats, témoignages, CTA final ou programmes.
- Preuve : scans négatifs sur `stats-section`, `stats-grid`, `stat-card`, `testimonials`, `cta-section`, `cta-card`, `program-card`, `offres-grid`.

❌ Problème critique - `offres.html` contient encore l'ancienne DA complète.
- Fichier/lignes : navbar ancienne `offres.html:21`, `hero-short` `offres.html:64`, programmes `offres.html:75`, CTA vert `offres.html:220`, footer `offres.html:231`.
- Action : supprimer la page entière si la nouvelle architecture ne garde que `index.html` + `galerie.html`.

⚠️ À corriger - CSS ancien encore présent dans `styles.css`.
- Fichier/lignes : `.programs-grid` `css/styles.css:887`, `.program-card` `css/styles.css:888`, `.offres-grid` `css/styles.css:940`, `.reassurance-section` `css/styles.css:943`, `.gallery-profiles-section` `css/styles.css:965`, `.client-profile-grid` `css/styles.css:982`, `#gallery-overlay` `css/styles.css:1101`, `#popup-carousel` `css/styles.css:1210`, `.contact-section--immersive` `css/styles.css:1325`, `.contact-grid` `css/styles.css:1376`, `.footer` `css/styles.css:1437`, `.hero-eyebrow` `css/styles.css:1489`.
- Impact : le CSS mélange l'ancien site multi-pages avec la nouvelle DA flatlay.
- Action : après suppression de `offres.html`, supprimer les blocs CSS programmes/offres/reassurance/footer/contact-page/gallery-profiles/ancien popup galerie.

⚠️ À corriger - Classes CSS potentiellement orphelines.
- Classes détectées sans usage HTML/JS courant : `.avatar-missing`, `.carousel-dot`, `.client-card-avatar`, `.client-card-content`, `.client-card-initials`, `.client-card-media`, `.client-card-name`, `.client-card-result`, `.client-profile-card`, `.client-profile-grid`, `.client-program-badge`, `.contact-block-title`, `.contact-detail`, `.contact-detail-label`, `.contact-detail-value`, `.contact-grid`, `.contact-section--immersive`, `.form-group`, `.form-input`, `.form-label`, `.form-select`, `.form-textarea`, `.gallery-heading`, `.gallery-kicker`, `.gallery-profiles-section`, `.hero-eyebrow`, `.popup-avatar-initials`, `.programs-grid`, `.section-subtitle`, `.social-links`.
- Action : supprimer ou reconnecter explicitement. Dans la DA actuelle, la plupart sont à supprimer.

⚠️ À corriger - Fonctions JS legacy dans `main.js`.
- Fichier/lignes : logique `.nav-overlay`/`.nav-hamburger` `js/main.js:45`, `js/main.js:159-177`; carousel témoignages mort `js/main.js:229-322`; ancienne lightbox `.gallery-item`/`#lightbox` `js/main.js:324-363`.
- Impact : code mort, événements clavier inutiles, dette de maintenance.
- Action : supprimer ces blocs et laisser `gallery.js` gérer la galerie actuelle.

⚠️ À corriger - Clés i18n orphelines.
- Fichiers : `lang/fr.json`, `lang/en.json`.
- Preuve : avec `offres.html` inclus, 126 clés orphelines par langue; sans `offres.html`, 193 clés orphelines par langue.
- Exemples : `hero.*`, `stats.*`, `programs_section.*`, `about.*`, `cta_section.*`, `offres.*`, `contact.*`, `galerie.*`, `testimonialsTitle`, `testimonials`.
- Action : après décision sur `offres.html`, purger les anciennes clés.

❌ Problème critique - Clé JSON dupliquée `testimonials`.
- Fichiers/lignes : `lang/fr.json:126` et `lang/fr.json:248`; `lang/en.json:126` et `lang/en.json:248`.
- Impact : en JSON, la dernière valeur gagne; l'objet `testimonials` initial est écrasé par le tableau. C'est un piège silencieux.
- Action : supprimer l'ancien objet ou renommer proprement, idéalement supprimer tout le bloc témoignages si la section n'existe plus.

## 3. COHÉRENCE VISUELLE

⚠️ À corriger - Le fond global du site reste blanc.
- Fichier/ligne : `css/styles.css:24` (`body { background: var(--color-white); }`).
- Impact : si une section manque de fond explicite, elle retombe sur l'ancienne DA claire.
- Action : passer le fond global à `#0a0a0a` ou isoler strictement les pages sombres.

✅ OK - Les sections principales de `index.html` sont sombres.
- Preuves : `#hero` `css/styles.css:75`, `#coach` `css/styles.css:400`, `#videos` `css/styles.css:536`.

⚠️ À corriger - `#videos` utilise `#0d0d0d`, pas exactement `#0a0a0a`.
- Fichier/ligne : `css/styles.css:536`.
- Impact : faible, mais le prompt demande une cohérence `#0a0a0a`.
- Action : uniformiser si la DA exige un noir strict.

❌ Problème critique - Des fonds blancs/gris clair de l'ancienne DA restent dans `styles.css`.
- Fichier/lignes : `.program-card` blanc `css/styles.css:892`, `.reassurance-section` gris clair `css/styles.css:943`, `.reassurance-card` blanc `css/styles.css:945`, `.gallery-profiles-section` blanc `css/styles.css:965`, champs legacy blancs `css/styles.css:1410`.
- Action : supprimer les blocs inutilisés ou les convertir en sombre s'ils restent réellement dans l'expérience.

⚠️ À corriger - Navbar galerie différente de la navbar hero.
- Fichiers/lignes : `index.html:45`, `galerie.html:14`, styles galerie `css/styles.css:1517+`.
- Action : aligner les espacements, fonts, boutons langue et comportement mobile.

⚠️ À corriger - Fonts incohérentes.
- Fichiers/lignes : `index.html:16` charge `Inter`; `galerie.html:9` charge `DM Sans`.
- Impact : `styles.css` définit `--font-body: 'Inter'`, mais la galerie charge DM Sans au lieu d'Inter.
- Action : choisir une police corps unique ou définir une variable dédiée galerie.

✅ OK - Les CTA principaux actifs utilisent globalement le vert `#005400`.
- Preuves : `#coach-cta` `css/styles.css:479`, `.video-tab.active` `css/styles.css:578`, `.gallery-filter.active` `css/styles.css:1629`.

## 4. POPUP CONTACT

✅ OK - Le popup contact existe sur `index.html` et `galerie.html`.
- Preuves : `index.html:130`, `galerie.html:56`.

✅ OK - `js/contact.js` est chargé sur les deux pages.
- Preuves : `index.html:201`, `galerie.html:113`.

✅ OK - `openContactPopup()` est global.
- Preuves : définition `js/main.js:67`, export `window` `js/main.js:135`.

✅ OK - `formSuccess` existe sur `index.html` et `galerie.html`.
- Preuves : `index.html:174`, `galerie.html:91`.

✅ OK - Le formulaire soumet vers `/.netlify/functions/send-telegram`.
- Preuve : `js/contact.js:62`.

✅ OK - Pas de doublon `#contact-overlay` dans un même fichier HTML.
- Comptage : `index.html` = 1, `galerie.html` = 1, `offres.html` = 1.

⚠️ À corriger - `contact.js` ne gère que le premier formulaire trouvé.
- Fichier/ligne : `js/contact.js:24`.
- Impact : OK actuellement car un seul popup par page; fragile si plusieurs formulaires reviennent.
- Action : soit assumer un formulaire unique, soit binder tous les `form[data-contact-form]`.

⚠️ À corriger - Messages de succès/erreur partiellement hardcodés.
- Fichier/lignes : `js/contact.js:37`, `js/contact.js:60`, `js/contact.js:69`.
- Action : utiliser les clés i18n déjà présentes ou en supprimer les clés mortes.

## 5. SECTION VIDÉOS

❌ Problème critique - Tous les IDs vidéo sont des placeholders.
- Fichier/lignes : `js/main.js:3`, `js/main.js:9`, `js/main.js:15`, `js/main.js:21`, `js/main.js:27`, `js/main.js:33`.
- IDs : `VIDEO_ID_1`, `VIDEO_ID_2`, `VIDEO_ID_3`, `VIDEO_ID_4`, `VIDEO_ID_5`, `VIDEO_ID_6`.
- Impact : mini player hero et cartes vidéo ouvrent des embeds YouTube invalides.
- Action : remplacer par de vrais IDs YouTube ou masquer la section jusqu'à disponibilité.

⚠️ À corriger - Les thumbnails YouTube avec placeholders ne sont pas fiables.
- Fichier/lignes : thumbnails `js/main.js:6`, `js/main.js:12`, `js/main.js:18`, `js/main.js:24`, `js/main.js:30`, `js/main.js:36`; fallback `js/main.js:93`.
- Impact : le fallback `placeholder-coach.jpg` évite une image cassée, mais l'expérience vidéo reste fausse.
- Action : vrais IDs ou thumbnails locales.

✅ OK - La logique de filtre catégorie est cohérente.
- Preuves : boutons `index.html:120-124`, filtrage `js/main.js:84-90`, listener `js/main.js:185-190`.

✅ OK - Le player overlay ferme au clic extérieur et avec Escape.
- Preuves : overlay `index.html:179`, bouton close `index.html:181`, Escape `js/main.js:195-198`, fermeture `js/main.js:118-125`.

## 6. GALERIE

❌ Problème critique - Toutes les images référencées par `gallery.js` sont manquantes.
- Fichier/lignes : `js/gallery.js:2-9`.
- Images manquantes :
  - `images/gallery/samuel-train-01.jpg`
  - `images/gallery/samuel-train-02.jpg`
  - `images/gallery/samuel-train-03.jpg`
  - `images/gallery/samuel-coach-01.jpg`
  - `images/gallery/samuel-coach-02.jpg`
  - `images/gallery/samuel-coach-03.jpg`
  - `images/gallery/samuel-result-01.jpg`
  - `images/gallery/samuel-result-02.jpg`
- Action : soit créer `images/gallery/` avec ces fichiers, soit modifier `galleryItems` pour utiliser les images réelles déjà présentes.

⚠️ À corriger - Images présentes mais non référencées par le code actuel.
- Images : `images/hero.png`, `images/hero-galerie.png`, `images/hero-offres.png`, `images/liquidimagetest.png`, `images/marie-pier-*.jpg`, `images/jean-francois-*.jpg`, `images/karine-*.jpg`.
- Action : supprimer les assets non utilisés ou les reconnecter à la galerie.

✅ OK - Le lightbox actuel a ouverture, navigation, fermeture clic extérieur et Escape.
- Preuves : `openLightbox` `js/gallery.js:30`, `closeLightbox` `js/gallery.js:39`, `lightboxNav` `js/gallery.js:46`, Escape `js/gallery.js:74`, clic extérieur `js/gallery.js:78`.

✅ OK - Les filtres correspondent aux catégories définies.
- Preuves : catégories `training/coaching/results` `js/gallery.js:2-9`, boutons `galerie.html:40-43`, filtre `js/gallery.js:18`.

⚠️ À corriger - Ancien système galerie/client encore présent dans CSS et `main.js`.
- Fichier/lignes : `#gallery-overlay` `css/styles.css:1101`, `#popup-carousel` `css/styles.css:1210`, legacy lightbox `js/main.js:324-363`.
- Action : supprimer pour éviter deux concepts de lightbox dans le projet.

## 7. PERFORMANCE & SEO

⚠️ À corriger - Images non lazy hors hero.
- Fichier/lignes : coach images `index.html:94`, `index.html:97`, `index.html:100`.
- Action : ajouter `loading="lazy"` aux images coach. Le hero/mini-thumb peut rester eager.

⚠️ À corriger - Images très lourdes.
- Exemples : `images/hero-flatlay.jpg` 1536x1024 ~3.4 MB, `images/placeholder-coach.jpg` 1023x1537 ~2.4 MB, plusieurs portraits ~1.8-2.0 MB.
- Action : générer versions WebP/JPEG optimisées, dimensions explicites, et versions responsive.

✅ OK - Les titres sont uniques pour les pages existantes.
- Preuves : `index.html:6`, `galerie.html:6`, `offres.html:6`.

❌ Problème critique - `galerie.html` n'a pas de meta description.
- Fichier : `galerie.html`.
- Action : ajouter une description unique.

❌ Problème critique - Open Graph incomplet.
- `galerie.html` n'a pas `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- `offres.html` a OG partiel mais manque `og:type`.
- `index.html` a OG complet, mais pointe vers une image absente.
- Action : compléter OG sur `galerie.html`, supprimer OG de `offres.html` si la page disparaît.

❌ Problème critique - `og:image` pointe vers un fichier absent.
- Fichiers/lignes : `index.html:11`, `offres.html:11`.
- Fichier absent : `images/og-image.jpg`.
- Action : ajouter `images/og-image.jpg` ou pointer vers une image existante optimisée.

✅ OK - Pas de script applicatif bloquant dans le `<head>`.
- Preuves : scripts applicatifs en fin de body `index.html:200-202`, `galerie.html:110-113`, `offres.html:320-322`.
- Note : le JSON-LD dans le head de `index.html:18` est acceptable.

✅ OK - Google Fonts utilise `preconnect`.
- Preuves : `index.html:14-15`, `galerie.html:7-8`, `offres.html:13-14`.

## 8. MOBILE & RESPONSIVE

✅ OK - Hamburger présent sur `index.html` et `galerie.html`.
- Preuves : `index.html:57`, `galerie.html:26`.

⚠️ À corriger - Le hamburger ne met pas à jour `aria-expanded`.
- Fichiers/lignes : boutons `index.html:57`, `galerie.html:26`; logique `js/main.js:25-33`.
- Impact : accessibilité mobile incomplète.
- Action : ajouter `aria-expanded="false"` au HTML et mise à jour dans `toggleMobileMenu()`.

✅ OK - Escape ferme le menu mobile, le contact popup et le player vidéo.
- Preuve : `js/main.js:195-199`.

✅ OK - `#coach` et `#videos` ont des media queries mobiles.
- Preuves : coach `css/styles.css:493-510`, videos `css/styles.css:709-713`.

⚠️ À corriger - Risque de popup contact serré sur 390px.
- Fichier/lignes : `#contact-popup` padding desktop `css/styles.css:689`, mobile `css/styles.css:836`.
- État : utilisable en principe grâce à `max-height: 90vh` et `overflow-y: auto`, mais les longs champs + intro restent denses.
- Action : tester réellement à 390px et réduire l'intro ou espacement si besoin.

✅ OK - La grille galerie passe bien en 2 colonnes sur mobile.
- Preuve : `css/styles.css:1786-1787`.

## 9. SÉCURITÉ & CONFIGURATION

✅ OK - Aucun token Telegram n'est exposé dans `js/contact.js`.
- Preuve : `js/contact.js` ne contient pas `TELEGRAM_BOT_TOKEN` ni token brut.

✅ OK - La Netlify Function lit `process.env.TELEGRAM_BOT_TOKEN`.
- Preuve : `netlify/functions/send-telegram.js:3`.

⚠️ À corriger - `chatId` Telegram est hardcodé.
- Fichier/ligne : `netlify/functions/send-telegram.js:4`.
- Impact : moins critique qu'un token, mais c'est de la config sensible et non portable.
- Action : lire `TELEGRAM_CHAT_ID` depuis `process.env`.

⚠️ À corriger - La fonction Netlify manque de garde-fous.
- Fichier : `netlify/functions/send-telegram.js`.
- Problèmes : pas de `try/catch` sur `JSON.parse`, pas de validation de méthode HTTP, pas de validation serveur des champs, pas de réponse CORS explicite si besoin.
- Action : ajouter validation serveur robuste et erreurs contrôlées.

⚠️ À corriger - `netlify.toml` ne déclare pas explicitement le dossier functions.
- Fichier : `netlify.toml`.
- État : `netlify/functions` est le chemin par défaut Netlify, donc ça peut marcher; mais le projet gagnerait à être explicite.
- Action : ajouter `[functions] directory = "netlify/functions"` si vous voulez une config sans ambiguïté.

✅ OK - `.gitignore` ignore `.env` et `*.env`.
- Preuve : `.gitignore`.

## 10. BUGS POTENTIELS

✅ OK - Pas de `console.log` de debug détecté dans les JS actifs.

✅ OK - Pas de `TODO` ou `FIXME` détecté dans le code actif.

✅ OK - Pas de modules ES6 incohérents.
- Preuve : aucun `type="module"` dans les HTML, aucun `import/export` dans les scripts actifs.

✅ OK - Pas de double définition de `openContactPopup`.
- Preuve : fonction définie dans `js/main.js:67`, exportée via `window` `js/main.js:135`.

⚠️ À corriger - Deux systèmes de galerie/lightbox coexistent.
- Fichiers/lignes : système actuel `js/gallery.js:30-84`; système ancien `js/main.js:324-363`; CSS ancien `css/styles.css:1101`, `css/styles.css:1210`.
- Impact : confusion, styles morts, risque de régression si un ID ancien revient.
- Action : supprimer le système ancien de `main.js` et `styles.css`.

⚠️ À corriger - `i18n.js` remplace le contenu avec `textContent`.
- Fichier/lignes : `js/i18n.js:14-17`.
- Impact : les `<br>` de `contactIntroTitle` sont supprimés après traduction; les retours ligne JSON ne s'affichent que si le CSS le prévoit.
- Exemple : `contactIntroTitle` contient `<br>` dans `index.html:136`, mais devient une seule ligne après traduction.
- Action : ajouter un mécanisme `data-i18n-html` contrôlé ou utiliser CSS `white-space: pre-line` selon les cas.

⚠️ À corriger - `i18n.js` n'a pas de fallback si `fetch(lang/*.json)` échoue.
- Fichier/lignes : `js/i18n.js:5-8`.
- Action : `try/catch`, fallback FR ou conservation du HTML initial.

## LISTE 1 — À supprimer immédiatement

- Fichier : `offres.html`.
- Sections HTML dans `offres.html` : navbar ancienne `offres.html:21`, mobile menu associé `offres.html:49`, hero court `offres.html:64`, programmes/offres `offres.html:73-214`, CTA final `offres.html:220`, footer `offres.html:231`, popup contact dupliqué pour une page à supprimer `offres.html:271`.
- CSS programmes/offres : `.programs-grid`, `.program-card`, `.program-badge`, `.program-icon`, `.program-title`, `.program-desc`, `.program-benefits`, `.offres-grid`, stagger `.programs-grid .reveal`, stagger `.offres-grid .reveal`.
- CSS reassurance/offres : `.reassurance-section`, `.reassurance-grid`, `.reassurance-card`, `.reassurance-icon`, `.reassurance-title`, `.reassurance-text`.
- CSS ancien profil galerie/client si non utilisé : `.gallery-profiles-section`, `.client-profile-grid`, `.client-profile-card`, `.client-card-*`, `.client-program-badge`, `#gallery-overlay`, `#gallery-popup`, `#popup-*`, `#popup-carousel`, `#carousel-*`, `.carousel-dot`.
- CSS page contact legacy : `.contact-section--immersive`, `.contact-grid`, `.contact-block-title`, `.contact-detail*`, `.social-links`, `.social-link`, `.contact-form`, `.form-*`.
- CSS footer ancien : `.footer`, `.footer-grid`, `.footer-logo`, `.footer-tagline`, `.footer-col-title`, `.footer-links`, `.footer-socials`, `.footer-social-link`, `.footer-bottom`.
- JS `main.js` legacy : bloc `.nav-overlay/.nav-hamburger` `js/main.js:159-177`, bloc `initTestimonialsCarousel()` `js/main.js:229-322`, ancien bloc lightbox `js/main.js:324-363`, requêtes `refreshBodyLock()` vers `.nav-overlay.open`, `.lightbox.open`, `#gallery-overlay.active`.
- JSON : anciennes clés `hero.*`, `stats.*`, `programs_section.*`, `about.*`, `cta_section.*`, `offres.*`, `contact.*` non utilisées, `galerie.*` legacy, `testimonialsTitle`, `testimonials`, anciennes clés plates `heroTitle`, `stat1Number`, `footerTagline`, etc.
- Assets non référencés si aucun usage prévu : `images/hero.png`, `images/hero-galerie.png`, `images/hero-offres.png`, `images/liquidimagetest.png`, et les portraits `marie-pier-*`, `jean-francois-*`, `karine-*` si la galerie ne les utilise pas.

## LISTE 2 — À corriger par priorité

### Critique

1. Supprimer `offres.html` et tous ses liens/styles/clés associés.
2. Remplacer les 6 placeholders `VIDEO_ID_X` dans `js/main.js` ou masquer la section vidéos.
3. Corriger la galerie : créer `images/gallery/*.jpg` ou modifier `galleryItems` pour utiliser les images existantes.
4. Ajouter/corriger `images/og-image.jpg` et compléter Open Graph, surtout sur `galerie.html`.
5. Corriger les doublons JSON `testimonials` dans `lang/fr.json` et `lang/en.json`.

### Important

1. Nettoyer `styles.css` des blocs anciens : offres/programmes/reassurance/footer/contact-page/gallery-profile.
2. Nettoyer `main.js` des systèmes morts : nav legacy, carousel témoignages, lightbox legacy.
3. Purger les clés i18n orphelines après suppression d'`offres.html`.
4. Ajouter `loading="lazy"` aux images coach et optimiser les images lourdes.
5. Ajouter `aria-expanded` au hamburger et le synchroniser dans `toggleMobileMenu()`.
6. Harmoniser la navbar galerie avec la nav hero ou documenter une variante stricte.
7. Déplacer `chatId` Telegram vers `process.env.TELEGRAM_CHAT_ID` et renforcer la Netlify Function.

### Mineur

1. Uniformiser `#videos` de `#0d0d0d` vers `#0a0a0a` si la DA impose un noir unique.
2. Remplacer les `href="#"` de contact par des boutons ou ancres explicites.
3. Aligner la police galerie (`DM Sans`) avec `Inter` ou définir clairement une exception.
4. Ajouter un fallback robuste dans `i18n.js`.
5. Préserver les `<br>` nécessaires dans les traductions avec une stratégie `data-i18n-html` contrôlée.
