// Backend/routes/nft.js
const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const { getDB } = require('../db/init')

router.post('/buy', verifyToken, async (req, res) => {
    try {
        const userId = req.telegramUser.id
        const { itemId } = req.body

        if (!itemId) return res.status(400).json({ error: 'Missing itemId' })

        const db = getDB()

        // Get internal user ID first
        db.get('SELECT id FROM users WHERE telegram_id = ?', [userId], (err, user) => {
            if (err || !user) return res.status(404).json({ error: 'User not found' });
            
            const buyerId = user.id;

            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                // 1. Get Item Price & Check if it exists/is not owned
                db.get('SELECT price_ton, owner_id FROM items WHERE id = ?', [itemId], (err, item) => {
                    if (err || !item) {
                        db.run('ROLLBACK');
                        return res.status(404).json({ error: 'Item not found' });
                    }
                    if (item.owner_id !== null) {
                        db.run('ROLLBACK');
                        return res.status(400).json({ error: 'Item already owned' });
                    }

                    const price = item.price_ton;

                    // 2. Deduct Balance ATOMICALLY
                    // Only update if balance is sufficient (ton_balance >= price)
                    db.run(
                        'UPDATE users SET ton_balance = ton_balance - ? WHERE id = ? AND ton_balance >= ?',
                        [price, buyerId, price],
                        function (err) {
                            if (err) {
                                db.run('ROLLBACK');
                                return res.status(500).json({ error: 'Database error' });
                            }
                            
                            // If no rows changed, balance was insufficient
                            if (this.changes === 0) {
                                db.run('ROLLBACK');
                                return res.status(400).json({ error: 'Insufficient funds' });
                            }

                            // 3. Transfer Ownership ATOMICALLY
                            // Ensure strictly that owner_id IS NULL to prevent double buys
                            db.run(
                                'UPDATE items SET owner_id = ?, listed_at = NULL WHERE id = ? AND owner_id IS NULL',
                                [buyerId, itemId],
                                function (err) {
                                    if (err) {
                                        db.run('ROLLBACK');
                                        return res.status(500).json({ error: 'Database error' });
                                    }

                                    // If no rows changed here, someone else bought it just now
                                    if (this.changes === 0) {
                                        db.run('ROLLBACK'); // Rollback the money deduction!
                                        return res.status(409).json({ error: 'Item just sold to someone else' });
                                    }

                                    // 4. Update stats (optional, safe to fail or be approximate)
                                    db.run(
                                        `UPDATE season_stats 
                                         SET volume_ton = volume_ton + ?, items_bought = items_bought + 1 
                                         WHERE user_id = ? AND season_number = 2`,
                                        [price, buyerId]
                                    );

                                    db.run('COMMIT');
                                    res.json({ success: true, message: 'Purchased successfully' });
                                }
                            );
                        }
                    );
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal error' });
    }
});

module.exports = router;
