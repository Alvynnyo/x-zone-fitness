# Audit de consolidation et liste de purge proposée

## Décision sur la racine de production

`x-zone-fitness/` est la racine réelle du site :

- dépôt Git autonome sur la branche `main` ;
- remote `https://github.com/Alvynnyo/x-zone-fitness.git` ;
- `netlify.toml` présent dans ce dossier avec `publish = "."` ;
- aucun `index.html`, `css/styles.css` ou `js/main.js` concurrent à la racine documentaire `Coach_RONALD/`.

Il ne faut donc pas migrer le site vers `Coach_RONALD/`. Les trois pages publiées (`index.html`, `galerie.html`, `404.html`) sont désormais consolidées dans `x-zone-fitness/`.

## Fichiers actifs à conserver

### CSS

- `css/home.css` — chargé par `index.html`, `galerie.html` et `404.html`.

### JavaScript navigateur

- `js/home.js` — navigation, menu mobile, modal et infrastructure Pexels ; chargé par les trois pages.
- `js/contact.js` — formulaire Telegram ; chargé par `index.html` et `galerie.html`.
- `js/gallery.js` — filtres et lightbox ; chargé uniquement par `galerie.html`.

### Fonctions Netlify

- `netlify/functions/send-telegram.js` — endpoint utilisé par `contact.js`.
- `netlify/functions/pexels.js` — endpoint conservé pour `loadGymPhoto()`.

### Images et captures

- `images/Accueil.png` — seule image présente, référencée par l’accueil et la galerie.
- `docs/screenshots/home-mobile-390.png`
- `docs/screenshots/home-desktop-1440.png`
- `docs/screenshots/gallery-mobile-390.png`
- `docs/screenshots/gallery-desktop-1440.png`

## Suppressions exécutées après validation

### CSS orphelin supprimé

1. `css/styles.css` — 32 986 octets, chargé par aucune page.
2. `css/design.css` — 39 182 octets, chargé par aucune page.

### JavaScript orphelin supprimé

3. `js/main.js` — 13 141 octets, chargé par aucune page.

Fonctions legacy supprimées avec ce fichier :

- `refreshBodyLock`
- `switchLang`
- `toggleMobileMenu`
- `openContactPopup`
- `closeContactPopup`
- `renderVideos`
- `openVideoPlayer`
- `closeVideoPlayer`
- `openVideoPopup`
- `updateActiveNavLink`
- `updateHeroNavOnScroll`
- `initTestimonialsPager`
- `initTestimonialsCarousel`
- `initPlanAccordions`
- `loadGymPhoto`

Les comportements encore nécessaires ont une implémentation active et propre dans `js/home.js`. Les fonctions Vidéos, Témoignages, Formules et leurs gestionnaires ne correspondent plus à aucune section publiée.

4. `js/i18n.js` — 3 133 octets, chargé par aucune page.

Fonctions supprimées avec ce fichier :

- `loadTranslations`
- `getVal`
- `applyTranslations`
- `updateButtons`
- `setLang`
- `setLangButtonsDisabled`
- `changeLangWithCurtain`
- `initI18n`

### Dictionnaires et chaînes i18n orphelins supprimés

5. `lang/fr.json` — 9 785 octets.
6. `lang/en.json` — 9 024 octets.

Les deux dictionnaires contiennent les mêmes 175 clés, toutes orphelines puisque plus aucune page ne charge `i18n.js` :

`navHome`, `navCoach`, `navVideos`, `navMethod`, `navGalerie`, `navContact`, `navFormules`, `navJoin`, `heroTitle`, `heroSubtitle`, `heroTagline`, `heroBlockLeft`, `heroBlockRight`, `heroCtaPrimary`, `heroContactCta`, `heroCtaSecondary`, `heroVideoLabel`, `heroScroll`, `coachLabel`, `coachSpotlightTitle`, `coachSpotlightSubtitle`, `coachStatement`, `aboutTitle`, `aboutText1`, `aboutText2`, `aboutText3`, `aboutCta`, `coachRole`, `programsEyebrow`, `objectivesTitle`, `objectivesViewAll`, `formule1Ideal`, `formule2Ideal`, `formule3Ideal`, `trainingsTitle`, `train1Title`, `train1Desc`, `train2Title`, `train2Desc`, `train3Title`, `train3Desc`, `train4Title`, `train4Desc`, `goalsTitle`, `goal1Title`, `goal1Desc`, `goal2Title`, `goal2Desc`, `goal3Title`, `goal3Desc`, `goal4Title`, `goal4Desc`, `formulesPathTitle`, `footerCtaTitle`, `programMasseTitle`, `programMasseDesc`, `programMasseBenefit1`, `programMasseBenefit2`, `programMasseBenefit3`, `programPerteTitle`, `programPerteDesc`, `programPerteBenefit1`, `programPerteBenefit2`, `programPerteBenefit3`, `programCardioTitle`, `programCardioDesc`, `programCardioBenefit1`, `programCardioBenefit2`, `programCardioBenefit3`, `programPersoTitle`, `programPersoDesc`, `programPersoBenefit1`, `programPersoBenefit2`, `programPersoBenefit3`, `methodEyebrow`, `methodTitle`, `methodStepLabel`, `methodStep1Title`, `methodStep1Text`, `methodStep2Title`, `methodStep2Text`, `methodStep3Title`, `methodStep3Text`, `methodQuote`, `methodQuoteRole`, `videosLabel`, `videosTitle`, `videoTabAll`, `videoTabTrans`, `videoTabForce`, `videoTabCardio`, `videoTabNutrition`, `videosComingSoon`, `videoSoon`, `testimonialsEyebrow`, `testimonialsTitle`, `testimonial1Text`, `testimonial1Result`, `testimonial2Text`, `testimonial2Result`, `testimonial3Text`, `testimonial3Result`, `plansEyebrow`, `plansTitle`, `plansIntro`, `planLevelEssential`, `planLevelComplete`, `planLevelFlexible`, `planStarterText`, `planStarter1`, `planStarter2`, `planStarter3`, `planEliteText`, `planElite1`, `planElite2`, `planElite3`, `planElite4`, `planOnlineTitle`, `planOnlineText`, `planOnline1`, `planOnline2`, `planOnline3`, `planPopular`, `planCta`, `galleryTeaserEyebrow`, `galleryTeaserTitle`, `galleryTeaserText`, `galleryTeaserCta`, `galleryTeaserCaption`, `ctaEyebrow`, `ctaTitle`, `ctaText`, `ctaPrimary`, `ctaSecondary`, `ctaBadge`, `contactIntroLabel`, `contactIntroTitle`, `contactIntroText`, `formName`, `formNamePlaceholder`, `formEmail`, `formEmailPlaceholder`, `formPhone`, `formProgram`, `formProgramDefault`, `prog1Nom`, `prog2Nom`, `prog3Nom`, `prog4Nom`, `formMessage`, `formMessagePlaceholder`, `formSubmit`, `galleryEyebrow`, `galleryTitle`, `gallerySubtitle`, `filterAll`, `filterTraining`, `filterCoaching`, `filterResults`, `stat1Label`, `stat2Label`, `stat3Label`, `statsEyebrow`, `statsTitle`, `statsText`, `skillCanfit`, `skillNutrition`, `skillOnline`, `skillMobility`, `skillProgress`, `footerCopyright`, `footerTagline`, `footerNavTitle`, `footerContactTitle`, `footerSocialTitle`.

### Images déjà absentes du working tree

Ces 27 suppressions existaient avant cette passe. Elles ne sont plus référencées par le code consolidé. Le futur commit les enregistrera comme suppressions si elles sont approuvées :

1. `images/hero-coaching-session.webp`
2. `images/hero-contact.png`
3. `images/hero-flatlay.jpg`
4. `images/hero-galerie.png`
5. `images/hero-offres.png`
6. `images/hero.png`
7. `images/icon-dumbbell.webp`
8. `images/jean-francois-01.jpg`
9. `images/jean-francois-02.jpg`
10. `images/jean-francois-avatar.jpg`
11. `images/karine-01.jpg`
12. `images/karine-02.jpg`
13. `images/karine-03.jpg`
14. `images/karine-avatar.jpg`
15. `images/liquidimagetest.png`
16. `images/marie-pier-01.jpg`
17. `images/marie-pier-02.jpg`
18. `images/marie-pier-03.jpg`
19. `images/marie-pier-avatar.jpg`
20. `images/pexels/gallery-header.jpg`
21. `images/pexels/hero.jpg`
22. `images/pexels/showcase.jpg`
23. `images/pexels/train-cardio.jpg`
24. `images/pexels/train-coaching.jpg`
25. `images/pexels/train-mobility.jpg`
26. `images/pexels/train-strength.jpg`
27. `images/placeholder-coach.jpg`

## État obtenu après la purge approuvée

- un seul CSS de production : `css/home.css` ;
- trois JS navigateur actifs : `js/home.js`, `js/contact.js`, `js/gallery.js` ;
- aucun dossier `lang/` ;
- une seule image de contenu actuelle : `images/Accueil.png` ;
- aucune référence locale cassée sur `index.html`, `galerie.html` ou `404.html`.
