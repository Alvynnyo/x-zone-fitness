const STORAGE_KEY = 'xzone_lang';
const DEFAULT_LANG = 'fr';

let translations = {};

async function loadTranslations(lang, allowDefaultFallback = true) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    translations = await res.json();
    return lang;
  } catch (error) {
    console.error('Impossible de charger les traductions:', error);

    if (allowDefaultFallback && lang !== DEFAULT_LANG) {
      return loadTranslations(DEFAULT_LANG, false);
    }

    return null;
  }
}

function getVal(keyPath) {
  return keyPath.split('.').reduce((obj, k) => obj && obj[k], translations);
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = getVal(el.dataset.i18n);
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const v = getVal(el.dataset.i18nPlaceholder);
    if (v !== undefined) el.placeholder = v;
  });
}

function updateButtons(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.lang === lang)
  );
  document.documentElement.lang = lang;
}

async function setLang(lang) {
  const resolvedLang = await loadTranslations(lang);
  if (resolvedLang) localStorage.setItem(STORAGE_KEY, resolvedLang);
  applyTranslations();
  updateButtons(resolvedLang || lang);
  document.dispatchEvent(new CustomEvent('i18n:updated'));
}

async function initI18n() {
  const lang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  const resolvedLang = await loadTranslations(lang);
  if (resolvedLang) localStorage.setItem(STORAGE_KEY, resolvedLang);
  applyTranslations();
  updateButtons(resolvedLang || lang);
  document.querySelectorAll('.lang-btn').forEach(btn =>
    btn.addEventListener('click', () => setLang(btn.dataset.lang))
  );
  document.dispatchEvent(new CustomEvent('i18n:updated'));
}

// API publique : même logique de résolution de clé que data-i18n (getVal), exposée sans duplication.
window.i18n = { t: getVal };

document.addEventListener('DOMContentLoaded', initI18n);
