function validateForm(name, email, message) {
  if (!name.trim()) return 'Le nom est requis.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Adresse email invalide.';
  if (!message.trim()) return 'Le message est requis.';
  return null;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit');
  const msgEl = document.getElementById('form-message');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name = form.querySelector('#field-name')?.value ?? '';
    const email = form.querySelector('#field-email')?.value ?? '';
    const phone = form.querySelector('#field-phone')?.value ?? '';
    const programEl = form.querySelector('#field-program');
    const program = programEl?.options[programEl.selectedIndex]?.text ?? '';
    const message = form.querySelector('#field-message')?.value ?? '';

    const err = validateForm(name, email, message);
    if (err) {
      msgEl.textContent = err;
      msgEl.className = 'form-message error';
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours…';
    msgEl.className = 'form-message';

    try {
      const res = await fetch('/.netlify/functions/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, program, message })
      });
      if (!res.ok) throw new Error('API error');
      msgEl.textContent = 'Message envoyé ! Ronald vous répondra sous 24h.';
      msgEl.className = 'form-message success';
      form.reset();
    } catch {
      msgEl.textContent = 'Une erreur est survenue. Veuillez réessayer ou envoyer un email directement.';
      msgEl.className = 'form-message error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
