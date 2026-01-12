const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const { getDB } = require('../db/init')

// Get active tasks
router.get('/', verifyToken, (req, res) => {
    try {
        const db = getDB()

        db.all(
            `SELECT 
        id,
        title,
        description,
        reward_points,
        reward_ton,
        type,
        is_active
      FROM tasks
      WHERE is_active = 1
      ORDER BY id ASC`,
            [],
            (err, tasks) => {
                if (err) {
                    console.error('Tasks fetch error:', err)
                    return res.status(500).json({ error: 'Database error' })
                }

                res.json({
                    success: true,
                    tasks: tasks || []
                })
            }
        )
    } catch (error) {
        console.error('Tasks route error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Complete task
router.post('/complete/:taskId', verifyToken, (req, res) => {
    try {
        const userId = req.telegramUser.id
        const taskId = parseInt(req.params.taskId, 10)
        const db = getDB()

        if (!taskId) {
            return res.status(400).json({ error: 'Invalid task id' })
        }

        db.get(
            'SELECT id FROM users WHERE telegram_id = ?',
            [userId],
            (userErr, user) => {
                if (userErr || !user) {
                    return res.status(404).json({ error: 'User not found' })
                }

                const internalUserId = user.id

                db.get(
                    'SELECT * FROM tasks WHERE id = ? AND is_active = 1',
                    [taskId],
                    (taskErr, task) => {
                        if (taskErr || !task) {
                            return res.status(404).json({ error: 'Task not found' })
                        }

                        db.get(
                            'SELECT id FROM user_tasks WHERE user_id = ? AND task_id = ?',
                            [internalUserId, taskId],
                            (existsErr, existing) => {
                                if (existing) {
                                    return res.status(400).json({ error: 'Task already completed' })
                                }

                                db.run(
                                    `INSERT INTO user_tasks (user_id, task_id, completed)
                   VALUES (?, ?, 1)`,
                                    [internalUserId, taskId],
                                    (insertErr) => {
                                        if (insertErr) {
                                            console.error('Task completion error:', insertErr)
                                            return res.status(500).json({ error: 'Database error' })
                                        }

                                        res.json({
                                            success: true,
                                            reward: {
                                                points: task.reward_points,
                                                ton: task.reward_ton
                                            }
                                        })
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    } catch (error) {
        console.error('Complete task error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router
