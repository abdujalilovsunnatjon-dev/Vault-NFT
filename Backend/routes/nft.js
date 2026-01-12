const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const { getDB } = require('../db/init')

// Buy an item
router.post('/buy', verifyToken, async (req, res) => {
    try {
        const userId = req.telegramUser.id
        const { itemId } = req.body

        if (!itemId) {
            return res.status(400).json({ error: 'Missing itemId' })
        }

        const db = getDB()

        // 1. Get user (buyer) internal ID and check balance
        db.get('SELECT * FROM users WHERE telegram_id = ?', [userId], (err, buyer) => {
            if (err) {
                console.error('Database error:', err)
                return res.status(500).json({ error: 'Database error' })
            }

            if (!buyer) {
                return res.status(404).json({ error: 'User not found' })
            }

            // 2. Get item and check availability/price
            db.get('SELECT * FROM items WHERE id = ?', [itemId], (itemErr, item) => {
                if (itemErr) {
                    console.error('Database error:', itemErr)
                    return res.status(500).json({ error: 'Database error' })
                }

                if (!item) {
                    return res.status(404).json({ error: 'Item not found' })
                }

                if (item.owner_id) {
                    return res.status(400).json({ error: 'Item is already owned' })
                }

                // Check balance
                if (buyer.ton_balance < item.price_ton) {
                    return res.status(400).json({ error: 'Insufficient funds' })
                }

                // 3. Purchase Transaction
                // Note: SQLite doesn't have internal transaction block support easily in node-sqlite3 without serialize, 
                // but we will do best effort with sequential callbacks for prototype.
                // In production, use `db.run('BEGIN TRANSACTION')` ... `COMMIT`

                db.serialize(() => {
                    db.run('BEGIN TRANSACTION')

                    // Deduct balance from buyer
                    db.run('UPDATE users SET ton_balance = ton_balance - ? WHERE id = ?', [item.price_ton, buyer.id], function (updateErr) {
                        if (updateErr) {
                            db.run('ROLLBACK')
                            console.error('Balance update error:', updateErr)
                            return res.status(500).json({ error: 'Transaction failed' })
                        }

                        // Transfer ownership
                        db.run('UPDATE items SET owner_id = ?, listed_at = NULL WHERE id = ?', [buyer.id, itemId], function (itemUpdateErr) {
                            if (itemUpdateErr) {
                                db.run('ROLLBACK')
                                console.error('Item update error:', itemUpdateErr)
                                return res.status(500).json({ error: 'Transaction failed' })
                            }

                            // Update statistics (optional but good for season)
                            db.run(`UPDATE season_stats 
                                    SET volume_ton = volume_ton + ?, items_bought = items_bought + 1 
                                    WHERE user_id = ? AND season_number = 2`,
                                [item.price_ton, buyer.id], (statsErr) => {
                                    // Ignore stats error for rollback hard constraint? 
                                    // Let's keep it safe.
                                    if (statsErr) console.warn('Stats update failed', statsErr)
                                })

                            db.run('COMMIT')

                            res.json({
                                success: true,
                                message: 'Item purchased successfully',
                                item: {
                                    id: item.id,
                                    name: item.name,
                                    price: item.price_ton
                                },
                                newBalance: buyer.ton_balance - item.price_ton
                            })
                        })
                    })
                })
            })
        })

    } catch (error) {
        console.error('Buy item error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router
