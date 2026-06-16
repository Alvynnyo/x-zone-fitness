exports.handler = async function(event) {
  const { name, email, phone, program, message } = JSON.parse(event.body);
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = '7424994789';
  const text = `Nouveau message — X-Zone Fitness\n\nNom: ${name}\nEmail: ${email}\nTéléphone: ${phone||'—'}\nProgramme: ${program||'—'}\n\nMessage:\n${message}`;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({chat_id: chatId, text})
  });
  const data = await res.json();
  if(data.ok) return {statusCode:200, body: JSON.stringify({success:true})};
  return {statusCode:500, body: JSON.stringify({error:'Telegram error'})};
};
