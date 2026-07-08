function validateForm(name, email, message) {
  if (!name.trim()) return 'Le nom est requis.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Adresse email invalide.';
  if (!message.trim()) return 'Le message est requis.';
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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm') || document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('#contact-submit') || form.querySelector('.form-submit') || form.querySelector('[type="submit"]');
  const successEl = document.getElementById('formSuccess');
  const msgEl = ensureMessageElement(form, successEl);

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

      if (!res.ok) throw new Error('API error');

      form.reset();
      if (successEl) successEl.style.display = 'block';
    } catch {
      msgEl.textContent = 'Une erreur est survenue. Veuillez réessayer ou envoyer un email directement.';
      msgEl.className = 'form-message error';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
});
