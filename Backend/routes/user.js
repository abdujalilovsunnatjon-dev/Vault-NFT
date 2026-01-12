const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
    res.json({
        id: 1,
        username: "demo_user",
        level: 0,
        balance: 0
    });
});

module.exports = router;
