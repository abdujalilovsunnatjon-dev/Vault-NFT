const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const { getDB } = require('../db/init')

// Get user's gifts
router.get('/list', verifyToken, async (req, res) => {
    try {
        const userId = req.telegramUser.id

        const { type = 'received' } = req.query // 'sent' or 'received'
        const db = getDB()

        db.get('SELECT id FROM users WHERE telegram_id = ?', [userId], (err, dbUser) => {
            if (err) {

                console.error('Database error:', err)
                return res.status(500).json({ error: 'Database error' })
            }


            let query, params
            const internalUserId = dbUser?.id

            if (!internalUserId) {

                return res.status(404).json({ error: 'User not found' })
            }



            if (type === 'sent') {
                query = `
        SELECT 
          g.*,
          i.name as item_name,
          i.image_url as item_image,
          i.price_ton as item_value,
          u.username as receiver_username
        FROM gifts g
        JOIN items i ON g.item_id = i.id
        JOIN users u ON g.receiver_id = u.id
        WHERE g.sender_id = ?
        ORDER BY g.sent_at DESC
      `
                params = [internalUserId]
            } else {
                query = `
        SELECT 
          g.*,
          i.name as item_name,
          i.image_url as item_image,
          i.price_ton as item_value,
          u.username as sender_username
        FROM gifts g
        JOIN items i ON g.item_id = i.id
        JOIN users u ON g.sender_id = u.id
        WHERE g.receiver_id = ?
        ORDER BY g.sent_at DESC
      `
                params = [internalUserId]
            }



            db.all(query, params, (err, gifts) => {

                if (err) {
                    console.error('Database error:', err)
                    return res.status(500).json({ error: 'Database error' })
                }

                res.json({
                    success: true,
                    gifts: gifts.map(gift => ({
                        id: gift.id,
                        item: {
                            name: gift.item_name,
                            image: gift.item_image,
                            value: gift.item_value
                        },
                        sender: type === 'sent' ? 'You' : gift.sender_username,
                        receiver: type === 'sent' ? gift.receiver_username : 'You',
                        message: gift.message,
                        opened: gift.opened === 1,
                        sentAt: gift.sent_at,
                        openedAt: gift.opened_at
                    }))
                })
            })
        })
    } catch (error) {
        console.error('Gifts list error:', error)

        res.status(500).json({ error: 'Internal server error' })
    }
})

// Send a gift
router.post('/send', verifyToken, async (req, res) => {
    try {
        const userId = req.telegramUser.id

        const { itemId, receiverTelegramId, message } = req.body

        if (!itemId || !receiverTelegramId) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const db = getDB()

        // Get sender's internal user id
        db.get('SELECT id FROM users WHERE telegram_id = ?', [userId], (senderErr, sender) => {
            if (senderErr || !sender) {

                return res.status(404).json({ error: 'Sender not found' })
            }

            const senderInternalId = sender.id

            // Check if user owns the item
            db.get(
                'SELECT * FROM items WHERE id = ? AND owner_id = ?',
                [itemId, senderInternalId],
                (err, item) => {

                    if (err) {
                        console.error('Database error:', err)
                        return res.status(500).json({ error: 'Database error' })
                    }

                    if (!item) {
                        return res.status(404).json({ error: 'Item not found or not owned' })
                    }

                    // Get receiver user ID
                    db.get(
                        'SELECT id FROM users WHERE telegram_id = ?',
                        [receiverTelegramId],
                        (receiverErr, receiver) => {
                            if (receiverErr) {
                                console.error('Database error:', receiverErr)
                                return res.status(500).json({ error: 'Database error' })
                            }

                            if (!receiver) {
                                return res.status(404).json({ error: 'Receiver not found' })
                            }

                            // Transfer item ownership
                            db.run(
                                'UPDATE items SET owner_id = ? WHERE id = ?',
                                [receiver.id, itemId],
                                (updateErr) => {
                                    if (updateErr) {
                                        console.error('Update error:', updateErr)
                                        return res.status(500).json({ error: 'Database error' })
                                    }

                                    // Create gift record
                                    const giftId = `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

                                    db.run(
                                        `INSERT INTO gifts (
                    id, sender_id, receiver_id, item_id, message
                  ) VALUES (?, ?, ?, ?, ?)`,
                                        [giftId, senderInternalId, receiver.id, itemId, message || ''],
                                        (insertErr) => {
                                            if (insertErr) {

                                                console.error('Insert error:', insertErr)
                                                return res.status(500).json({ error: 'Database error' })
                                            }


                                            // Update sender's season stats
                                            db.run(
                                                `UPDATE season_stats 
                       SET items_sold = items_sold + 1 
                       WHERE user_id = ? AND season_number = 2`,
                                                [senderInternalId],
                                                (seasonErr) => {

                                                }
                                            )


                                            // Update receiver's season stats
                                            db.run(
                                                `UPDATE season_stats 
                       SET items_bought = items_bought + 1 
                       WHERE user_id = ? AND season_number = 2`,
                                                [receiver.id],
                                                (seasonErr2) => {

                                                }
                                            )

                                            res.json({
                                                success: true,
                                                giftId,
                                                message: 'Gift sent successfully'
                                            })
                                        }
                                    )
                                }
                            )
                        }
                    )
                })
        })
    } catch (error) {
        console.error('Send gift error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Open a gift
router.post('/:id/open', verifyToken, async (req, res) => {
    try {
        const userId = req.telegramUser.id

        const { id } = req.params
        const db = getDB()

        // Get user's internal id
        db.get('SELECT id FROM users WHERE telegram_id = ?', [userId], (userErr, dbUser) => {
            if (userErr || !dbUser) {

                return res.status(404).json({ error: 'User not found' })
            }
            const internalUserId = dbUser.id


            db.get(
                'SELECT * FROM gifts WHERE id = ? AND receiver_id = ?',
                [id, internalUserId],
                (err, gift) => {

                    if (err) {
                        console.error('Database error:', err)
                        return res.status(500).json({ error: 'Database error' })
                    }

                    if (!gift) {
                        return res.status(404).json({ error: 'Gift not found' })
                    }

                    if (gift.opened === 1) {
                        return res.status(400).json({ error: 'Gift already opened' })
                    }

                    // Mark gift as opened
                    db.run(
                        'UPDATE gifts SET opened = 1, opened_at = CURRENT_TIMESTAMP WHERE id = ?',
                        [id],
                        (updateErr) => {
                            if (updateErr) {
                                console.error('Update error:', updateErr)
                                return res.status(500).json({ error: 'Database error' })
                            }


                            // Add points for opening gift
                            db.run(
                                'UPDATE users SET points = points + 50 WHERE id = ?',
                                [internalUserId],
                                (pointsErr) => {

                                }
                            )

                            // Update season stats
                            db.run(
                                `UPDATE season_stats 
               SET points = points + 50, tasks_completed = tasks_completed + 1 
               WHERE user_id = ? AND season_number = 2`,
                                [internalUserId],
                                (seasonErr) => {

                                }
                            )

                            res.json({
                                success: true,
                                pointsAwarded: 50,
                                message: 'Gift opened! You earned 50 points.'
                            })
                        }
                    )
                }
            )
        })
    } catch (error) {
        console.error('Open gift error:', error)

        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router