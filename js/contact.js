function validateForm(name, email, message) {
  if (!name.trim()) return 'Ajoute ton nom pour continuer.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Vérifie ton adresse courriel.';
  if (!message.trim()) return 'Dis-nous quelques mots sur ton objectif.';
  return null;
}

function ensureMessageElement(form, successEl) {
  let msgEl = document.getElementById('form-message');
  if (msgEl) return msgEl;

  msgEl = document.createElement('div');
  msgEl.id = 'form-message';
  msgEl.className = 'form-message';
  msgEl.setAttribute('role', 'alert');
  msgEl.setAttribute('aria-live', 'polite');

  const submit = form.querySelector('[type="submit"]');
  form.insertBefore(msgEl, successEl || submit);
  return msgEl;
}

function ensureProgramError(form) {
  let el = document.getElementById('program-message');
  if (el) return el;

  const group = form.querySelector('#program-options');
  if (!group) return null;

  el = document.createElement('div');
  el.id = 'program-message';
  el.className = 'form-message error';
  el.setAttribute('role', 'alert');
  el.setAttribute('aria-live', 'polite');
  el.style.display = 'none';
  group.insertAdjacentElement('afterend', el);
  return el;
}

// Crée (une fois) le bloc de confirmation animé dans le dialogue.
function ensureConfirm(dialog) {
  let el = dialog.querySelector('.contact-confirm');
  if (el) return el;

  el = document.createElement('div');
  el.className = 'contact-confirm';
  el.hidden = true;
  el.innerHTML =
    '<div class="contact-confirm-icon">' +
      '<svg class="confirm-check" viewBox="0 0 52 52" aria-hidden="true">' +
        '<circle class="confirm-check-circle" cx="26" cy="26" r="24" pathLength="100"></circle>' +
        '<path class="confirm-check-mark" d="M15 27l7 7 15-16" pathLength="100"></path>' +
      '</svg>' +
    '</div>' +
    '<div class="contact-confirm-text" aria-live="polite"></div>';
  dialog.appendChild(el);
  return el;
}

// Succès : masque le formulaire + l'intro, affiche la confirmation, gère le focus.
function showConfirmation(dialog, form) {
  const intro = dialog.querySelector('.contact-intro');
  const confirm = ensureConfirm(dialog);
  const textWrap = confirm.querySelector('.contact-confirm-text');

  form.style.display = 'none';
  if (intro) intro.style.display = 'none';

  // hidden:false relance les animations CSS (l'élément (ré)entre dans le rendu).
  textWrap.innerHTML = '';
  confirm.hidden = false;

  // Texte injecté APRÈS insertion pour que la région aria-live l'annonce.
  window.requestAnimationFrame(() => {
    textWrap.innerHTML =
      '<h2>C’est envoyé !</h2>' +
      '<p>Samuel te répondra personnellement, très vite.</p>';
  });

  // Le focus part vers un élément toujours accessible (le bouton de fermeture).
  const closeBtn = document.getElementById('contact-close');
  window.requestAnimationFrame(() => closeBtn && closeBtn.focus());
}

// Restaure l'état formulaire (utilisé quand le modal est ré-ouvert).
function resetConfirmation(dialog, form) {
  const confirm = dialog.querySelector('.contact-confirm');
  const intro = dialog.querySelector('.contact-intro');
  if (confirm && !confirm.hidden) confirm.hidden = true;
  if (form) form.style.display = '';
  if (intro) intro.style.display = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm') || document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('#contact-submit') || form.querySelector('.form-submit') || form.querySelector('[type="submit"]');
  const successEl = document.getElementById('formSuccess');
  const msgEl = ensureMessageElement(form, successEl);
  const dialog = form.closest('.contact-dialog');

  // Ré-ouverture du modal : on repart de l'état formulaire. L'ouverture/fermeture
  // reste 100% gérée par home.js ; on se contente d'observer sa classe .is-open.
  const overlay = document.getElementById('contact-overlay');
  if (dialog && overlay && 'MutationObserver' in window) {
    const mo = new MutationObserver(() => {
      if (overlay.classList.contains('is-open')) resetConfirmation(dialog, form);
    });
    mo.observe(overlay, { attributes: true, attributeFilter: ['class'] });
  }

  const getFieldValue = (name, legacySelector) =>
    form.querySelector(`[name="${name}"]`)?.value ?? form.querySelector(legacySelector)?.value ?? '';

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const name = getFieldValue('name', '#field-name');
    const email = getFieldValue('email', '#field-email');
    const phone = getFieldValue('phone', '#field-phone');
    const programEl = form.querySelector('[name="program"]') || form.querySelector('#field-program');
    const program = programEl?.options?.[programEl.selectedIndex]?.text ?? '';
    const message = getFieldValue('message', '#field-message');

    const err = validateForm(name, email, message);
    if (err) {
      if (successEl) successEl.style.display = 'none';
      msgEl.textContent = err;
      msgEl.className = 'form-message error';
      return;
    }

    // Validation client : un programme (radio) doit être sélectionné avant l'envoi.
    const programErrEl = ensureProgramError(form);
    const programChecked = form.querySelector('input[type="radio"][name="program"]:checked');
    if (form.querySelector('#program-options') && !programChecked) {
      if (successEl) successEl.style.display = 'none';
      if (programErrEl) {
        programErrEl.textContent = 'Sélectionne un programme';
        programErrEl.style.display = '';
      } else {
        msgEl.textContent = 'Sélectionne un programme';
        msgEl.className = 'form-message error';
      }
      return;
    }
    if (programErrEl) {
      programErrEl.textContent = '';
      programErrEl.style.display = 'none';
    }

    const originalText = submitBtn?.textContent || '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }
    if (successEl) successEl.style.display = 'none';
    msgEl.textContent = '';
    msgEl.className = 'form-message';

    try {
      const res = await fetch('/.netlify/functions/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, program, message })
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        // Affiche le message d'erreur réel renvoyé par la Function (ex. 400) plutôt qu'un texte générique.
        msgEl.textContent = data?.error || 'Un problème est survenu. Réessaie ou écris-nous directement.';
        msgEl.className = 'form-message error';
        return;
      }

      form.reset();
      if (dialog) {
        if (successEl) successEl.style.display = 'none';
        showConfirmation(dialog, form);
      } else if (successEl) {
        // Repli si la structure du dialogue diffère : comportement d'origine.
        successEl.style.display = 'block';
      }
    } catch {
      msgEl.textContent = 'Un problème est survenu. Réessaie ou écris-nous directement.';
      msgEl.className = 'form-message error';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
});
