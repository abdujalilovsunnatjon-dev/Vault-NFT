// Backend/routes/gifts.js (Send Endpoint Only)
// ... imports ...

router.post('/send', verifyToken, async (req, res) => {
    const userId = req.telegramUser.id
    const { itemId, receiverTelegramId, message } = req.body
    
    if (!itemId || !receiverTelegramId) return res.status(400).json({ error: 'Missing fields' })

    const db = getDB()

    db.get('SELECT id FROM users WHERE telegram_id = ?', [userId], (err, sender) => {
        if (!sender) return res.status(404).json({ error: 'Sender not found' });
        
        db.get('SELECT id FROM users WHERE telegram_id = ?', [receiverTelegramId], (err, receiver) => {
            if (!receiver) return res.status(404).json({ error: 'Receiver not found' });

            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                // 1. Transfer Item ownership safely
                // Ensure sender actually owns it
                db.run(
                    'UPDATE items SET owner_id = ? WHERE id = ? AND owner_id = ?',
                    [receiver.id, itemId, sender.id],
                    function (err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'DB Error' });
                        }
                        if (this.changes === 0) {
                            db.run('ROLLBACK');
                            return res.status(403).json({ error: 'You do not own this item' });
                        }

                        // 2. Create Gift Record
                        const giftId = `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                        db.run(
                            'INSERT INTO gifts (id, sender_id, receiver_id, item_id, message) VALUES (?, ?, ?, ?, ?)',
                            [giftId, sender.id, receiver.id, itemId, message || ''],
                            (err) => {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return res.status(500).json({ error: 'Failed to create gift' });
                                }

                                // 3. Update Stats (Simplified for brevity)
                                db.run('COMMIT');
                                res.json({ success: true, giftId });
                            }
                        );
                    }
                );
            });
        });
    });
});
// ... remaining routes ...
module.exports = router;
