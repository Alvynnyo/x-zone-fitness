const STORAGE_KEY = 'xzone_lang';
const DEFAULT_LANG = 'fr';

let translations = {};

async function loadTranslations(lang) {
  const res = await fetch(`lang/${lang}.json`);
  translations = await res.json();
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
  localStorage.setItem(STORAGE_KEY, lang);
  await loadTranslations(lang);
  applyTranslations();
  updateButtons(lang);
  document.dispatchEvent(new CustomEvent('i18n:updated'));
}

async function initI18n() {
  const lang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  await loadTranslations(lang);
  applyTranslations();
  updateButtons(lang);
  document.querySelectorAll('.lang-btn').forEach(btn =>
    btn.addEventListener('click', () => setLang(btn.dataset.lang))
  );
  document.dispatchEvent(new CustomEvent('i18n:updated'));
}

document.addEventListener('DOMContentLoaded', initI18n);
