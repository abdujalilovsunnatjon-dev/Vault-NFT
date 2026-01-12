// Backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { validateTelegramInitData, extractUserFromInitData } = require('../middleware/auth');

const router = express.Router();

router.post('/telegram', async (req, res) => {
  try {
    // Expect raw initData string for validation
    const { initData } = req.body; 

    if (!initData) {
      return res.status(400).json({ error: 'Missing initData' });
    }

    // 1. Validate hash using the correct WebApp algorithm (HMAC-SHA256)
    // This function is imported from middleware/auth.js which implements it correctly
    const isValid = validateTelegramInitData(initData);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid initData (hash mismatch).' });
    }

    // 2. Extract user data safely
    const user = extractUserFromInitData(initData);
    if (!user) {
        return res.status(400).json({ error: 'Could not extract user data' });
    }

    // 3. Optional: Sync user with DB here
    // const db = require('../db/init').getDB();
    // db.run('INSERT OR IGNORE INTO users ...');

    // 4. Issue JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        firstName: user.firstName
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Set cookie if needed, or just return token
    res.cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });

    res.json({ ok: true, token, user });
  } catch (err) {
    console.error('Auth error', err);
    res.status(500).json({ error: 'Internal auth error' });
  }
});

module.exports = router;
