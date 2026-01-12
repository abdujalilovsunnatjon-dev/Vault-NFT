const express = require('express')
const router = express.Router()
const { getDB } = require('../db/init')

// Development endpoint - returns mock user data
const jwt = require('jsonwebtoken')
const { validateTelegramInitData, extractUserFromInitData } = require('../middleware/auth')
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'

// Login endpoint - verifies Init Data and issues JWT
router.post('/telegram', async (req, res) => {
    try {
        const initData = req.body.initData || req.headers['x-telegram-init-data']

        if (!initData) {
            return res.status(400).json({ error: 'Missing initData' })
        }

        if (!validateTelegramInitData(initData)) {
            return res.status(401).json({ error: 'Invalid initData signature' })
        }

        const user = extractUserFromInitData(initData)
        if (!user) {
            return res.status(400).json({ error: 'Invalid user data in initData' })
        }

        const db = getDB()

        // Check if user exists in database
        db.get(
            'SELECT * FROM users WHERE telegram_id = ?',
            [user.id],
            (err, existingUser) => {
                if (err) {
                    console.error('Database error:', err)
                    return res.status(500).json({ error: 'Database error' })
                }

                const handleTokenIssue = (internalId) => {
                    // Issue JWT
                    const token = jwt.sign(
                        { id: internalId, telegramId: user.id },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    )

                    // Set Cookie
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                    })
                }

                if (existingUser) {
                    // Update last seen
                    db.run(
                        'UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE telegram_id = ?',
                        [user.id]
                    )

                    handleTokenIssue(existingUser.id)

                    return res.json({
                        success: true,
                        user: {
                            id: existingUser.id,
                            telegramId: existingUser.telegram_id,
                            firstName: existingUser.first_name,
                            lastName: existingUser.last_name,
                            username: existingUser.username,
                            points: existingUser.points,
                            tonBalance: existingUser.ton_balance
                        },
                        isNew: false
                    })
                } else {
                    // Create new user
                    db.run(
                        `INSERT INTO users (
              telegram_id, first_name, last_name, username,
              language_code, is_premium, points, ton_balance
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            user.id,
                            user.firstName,
                            user.lastName || '',
                            user.username || '',
                            user.languageCode || 'en',
                            user.isPremium ? 1 : 0,
                            100, // Starting points
                            5.0 // Starting TON balance
                        ],
                        function (err) {
                            if (err) {
                                console.error('Error creating user:', err)
                                return res.status(500).json({ error: 'Failed to create user' })
                            }

                            const newUserId = this.lastID

                            // Create season stats for new user
                            db.run(
                                `INSERT INTO season_stats (
                  user_id, season_number, points, volume_ton,
                  items_bought, items_sold, referrals, tasks_completed
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                                [
                                    newUserId,
                                    2, // Current season
                                    100,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ]
                            )

                            handleTokenIssue(newUserId)

                            res.json({
                                success: true,
                                user: {
                                    id: newUserId,
                                    telegramId: user.id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    username: user.username,
                                    points: 100,
                                    tonBalance: 5.0
                                },
                                isNew: true
                            })
                        }
                    )
                }
            }
        )
    } catch (error) {
        console.error('Auth error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Logout endpoint
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' })
})

module.exports = router