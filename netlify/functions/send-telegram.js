function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeField(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validatePayload(payload) {
  const name = normalizeField(payload.name);
  const email = normalizeField(payload.email);
  const phone = normalizeField(payload.phone);
  const program = normalizeField(payload.program);
  const message = normalizeField(payload.message);

  if (!name) return { error: 'Le champ nom est requis.' };
  if (name.length > 120) return { error: 'Le champ nom est trop long.' };

  if (!email) return { error: 'Le champ email est requis.' };
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Le format de l’email est invalide.' };
  }

  if (phone.length > 40) return { error: 'Le champ téléphone est trop long.' };

  if (!program) return { error: 'Le champ programme est requis.' };
  if (program.length > 120) return { error: 'Le champ programme est trop long.' };

  if (!message) return { error: 'Le champ message est requis.' };
  if (message.length > 3000) return { error: 'Le champ message est trop long.' };

  return {
    value: { name, email, phone, program, message }
  };
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Requête JSON invalide.' });
  }

  const validation = validatePayload(payload);
  if (validation.error) {
    return jsonResponse(400, { error: validation.error });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return jsonResponse(500, { error: 'Configuration serveur Telegram manquante.' });
  }

  const { name, email, phone, program, message } = validation.value;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || '—');
  const safeProgram = escapeHtml(program);
  const safeMessage = escapeHtml(message);

  const text = `🏋️ Nouveau message — X-Zone Fitness

👤 Nom: ${safeName}
📧 Email: ${safeEmail}
📞 Téléphone: ${safePhone}
🎯 Programme: ${safeProgram}

💬 Message:
${safeMessage}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });

    const data = await res.json();
    if (data.ok) return jsonResponse(200, { success: true });

    return jsonResponse(500, { error: 'Erreur lors de l’envoi Telegram.' });
  } catch {
    return jsonResponse(500, { error: 'Erreur serveur lors de l’envoi du message.' });
  }
};
