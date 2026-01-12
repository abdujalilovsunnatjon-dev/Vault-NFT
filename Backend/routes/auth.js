// Backend/routes/auth.js
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const router = express.Router();

function parseInitData(initData) {
  // initData может прийти как строка query или как объект
  if (!initData) return {};
  if (typeof initData === 'string') {
    const params = new URLSearchParams(initData);
    const out = {};
    for (const [k, v] of params.entries()) out[k] = v;
    return out;
  }
  return initData;
}

function checkTelegramAuth(data, botToken) {
  if (!data || !data.hash) return false;
  const hash = data.hash;
  const dataCopy = Object.assign({}, data);
  delete dataCopy.hash;

  const keys = Object.keys(dataCopy).sort();
  const data_check_string = keys.map(k => `${k}=${dataCopy[k]}`).join('\n');

  const secret = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secret).update(data_check_string).digest('hex');
  return hmac === hash;
}

router.post('/telegram', async (req, res) => {
  try {
    const raw = req.body.initData || req.body; // frontend может отправлять { initData: "..." }
    const data = parseInitData(raw);

    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) return res.status(500).json({ error: 'Server missing BOT_TOKEN' });

    const ok = checkTelegramAuth(data, BOT_TOKEN);
    if (!ok) return res.status(401).json({ error: 'Invalid initData (hash mismatch).' });

    // Extract user fields (telegram gives user or direct params)
    const user = {
      id: data.id || data.user_id || (data.user && data.user.id),
      first_name: data.first_name || (data.user && data.user.first_name),
      last_name: data.last_name || (data.user && data.user.last_name),
      username: data.username || (data.user && data.user.username),
      photo_url: data.photo_url || (data.user && data.user.photo_url)
    };

    // Optional: upsert user in DB (if you have DB module). Example:
    // const db = require('../db');
    // await db.upsertUser(user);

    const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ ok: true, token, user });
  } catch (err) {
    console.error('Auth error', err);
    res.status(500).json({ error: 'Internal auth error' });
  }
});

module.exports = router;
