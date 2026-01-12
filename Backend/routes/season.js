// Backend/routes/season.js
const express = require('express')
const router = express.Router()
const fs = require('fs')

const { verifyToken } = require('../middleware/auth')
const { getDB } = require('../db/init')

// Helper to append debug logs safely
function debugLog(obj) {
    try {
        fs.appendFileSync('.cursor/debug.log', JSON.stringify(obj) + '\n')
    } catch (e) {
        // ignore logging errors so they don't crash the app
        console.error('Debug log write failed:', e && e.message)
    }
}

// GET /stats - get season stats for current user
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const userId = req.telegramUser && req.telegramUser.id
        debugLog({
            sessionId: 'debug-session',
            location: 'season.js:stats:entry',
            message: 'Season stats: userId from req.telegramUser.id',
            data: { userId, season: req.query.season },
            timestamp: Date.now(),
        })

        const season = parseInt(req.query.season, 10) || 2
        const db = getDB()

        // Get user's internal id
        db.get(
            'SELECT id FROM users WHERE telegram_id = ?',
            [userId],
            (userErr, dbUser) => {
                if (userErr || !dbUser) {
                    debugLog({
                        sessionId: 'debug-session',
                        location: 'season.js:stats:user-lookup',
                        message: 'User lookup failed for season stats',
                        data: { telegramId: userId, err: userErr && userErr.message },
                        timestamp: Date.now(),
                    })
                    return res.status(404).json({ error: 'User not found' })
                }

                const internalUserId = dbUser.id
                debugLog({
                    sessionId: 'debug-session',
                    location: 'season.js:stats:user-converted',
                    message: 'User internal id converted for season stats',
                    data: { telegramId: userId, internalId: internalUserId },
                    timestamp: Date.now(),
                })

                // Get user's season stats
                const userStatsQuery = `
          SELECT 
            s.*,
            u.username,
            u.points as total_points,
            u.ton_balance as ton_balance,
            (
              SELECT COUNT(*) 
              FROM season_stats ss2 
              WHERE ss2.points > s.points AND ss2.season_number = s.season_number
            ) + 1 as rank
          FROM season_stats s
          JOIN users u ON s.user_id = u.id
          WHERE s.user_id = ? AND s.season_number = ?
        `
                db.get(userStatsQuery, [internalUserId, season], (err, stats) => {
                    debugLog({
                        sessionId: 'debug-session',
                        location: 'season.js:stats:query-result',
                        message: 'Season stats query result',
                        data: { userId: internalUserId, found: !!stats, err: err && err.message },
                        timestamp: Date.now(),
                    })

                    if (err) {
                        console.error('Database error:', err)
                        return res.status(500).json({ error: 'Database error' })
                    }

                    // Get global season stats
                    const globalQuery = `
            SELECT 
              s.season_number,
              COUNT(DISTINCT s.user_id) as total_participants,
              SUM(s.points) as total_points,
              SUM(s.volume_ton) as total_volume,
              AVG(s.rank) as average_rank
            FROM season_stats s
            WHERE s.season_number = ?
            GROUP BY s.season_number
          `

                    db.all(globalQuery, [season], (globalErr, globalStats) => {
                        if (globalErr) {
                            console.error('Global stats error:', globalErr)
                            return res.status(500).json({ error: 'Database error' })
                        }

                        const userStats = stats
                            ? {
                                season: stats.season_number,
                                points: stats.points,
                                volumeTON: stats.volume_ton,
                                itemsBought: stats.items_bought,
                                itemsSold: stats.items_sold,
                                referrals: stats.referrals,
                                tasksCompleted: stats.tasks_completed,
                                rank: stats.rank,
                                totalPoints: stats.points,
                                tonBalance: stats.ton_balance,
                                username: stats.username,
                            }
                            : null

                        const global = (globalStats && globalStats[0]) || {
                            season,
                            totalParticipants: 0,
                            totalPoints: 0,
                            totalVolume: 0,
                            averageRank: 0,
                        }

                        return res.json({
                            success: true,
                            userStats,
                            globalStats: global,
                        })
                    })
                })
            }
        )
    } catch (error) {
        console.error('Season stats error:', error)
        debugLog({
            sessionId: 'debug-session',
            location: 'season.js:stats:catch',
            message: 'Season stats error caught',
            data: { error: error && error.message },
            timestamp: Date.now(),
        })
        res.status(500).json({ error: 'Internal server error' })
    }
})

// GET /leaderboard
router.get('/leaderboard', verifyToken, async (req, res) => {
    try {
        const season = parseInt(req.query.season, 10) || 2
        const limit = parseInt(req.query.limit, 10) || 50
        const db = getDB()

        const q = `
      SELECT 
        ROW_NUMBER() OVER (ORDER BY s.points DESC) as position,
        u.username,
        u.first_name,
        u.last_name,
        s.points,
        s.volume_ton,
        s.items_bought,
        s.items_sold,
        s.referrals,
        s.tasks_completed,
        CASE WHEN u.is_premium = 1 THEN 'premium' ELSE 'regular' END as badge
      FROM season_stats s
      JOIN users u ON s.user_id = u.id
      WHERE s.season_number = ?
      ORDER BY s.points DESC
      LIMIT ?
    `

        db.all(q, [season, limit], (err, leaderboard) => {
            if (err) {
                console.error('Database error:', err)
                return res.status(500).json({ error: 'Database error' })
            }

            return res.json({
                success: true,
                season,
                leaderboard: (leaderboard || []).map((user) => ({
                    position: user.position,
                    username: user.username,
                    name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                    points: user.points,
                    volumeTON: user.volume_ton,
                    stats: {
                        itemsBought: user.items_bought,
                        itemsSold: user.items_sold,
                        referrals: user.referrals,
                        tasksCompleted: user.tasks_completed,
                    },
                    badge: user.badge,
                })),
            })
        })
    } catch (error) {
        console.error('Leaderboard error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// GET /progress
router.get('/progress', verifyToken, async (req, res) => {
    try {
        const userId = req.telegramUser && req.telegramUser.id
        debugLog({
            sessionId: 'debug-session',
            location: 'season.js:progress:entry',
            message: 'Season progress: userId from req.telegramUser.id',
            data: { userId, season: req.query.season },
            timestamp: Date.now(),
        })

        const season = parseInt(req.query.season, 10) || 2
        const db = getDB()

        // Get user's internal id
        db.get('SELECT id FROM users WHERE telegram_id = ?', [userId], (userErr, dbUser) => {
            if (userErr || !dbUser) {
                debugLog({
                    sessionId: 'debug-session',
                    location: 'season.js:progress:user-lookup',
                    message: 'User lookup failed for progress',
                    data: { telegramId: userId, err: userErr && userErr.message },
                    timestamp: Date.now(),
                })
                return res.status(404).json({ error: 'User not found' })
            }

            const internalUserId = dbUser.id
            debugLog({
                sessionId: 'debug-session',
                location: 'season.js:progress:user-converted',
                message: 'User internal id converted for progress',
                data: { telegramId: userId, internalId: internalUserId },
                timestamp: Date.now(),
            })

            const progressQuery = `
        SELECT 
          s.points,
          s.tasks_completed,
          COUNT(DISTINCT t.id) as total_tasks,
          (
            SELECT COUNT(DISTINCT ut.task_id)
            FROM user_tasks ut
            WHERE ut.user_id = ? AND ut.completed = 1
          ) as completed_tasks
        FROM season_stats s
        CROSS JOIN tasks t
        WHERE s.user_id = ? AND s.season_number = ? AND t.is_active = 1
        GROUP BY s.user_id, s.season_number
      `

            db.get(progressQuery, [internalUserId, internalUserId, season], (err, progress) => {
                debugLog({
                    sessionId: 'debug-session',
                    location: 'season.js:progress:query-result',
                    message: 'Progress query result',
                    data: { userId: internalUserId, found: !!progress, err: err && err.message },
                    timestamp: Date.now(),
                })

                if (err) {
                    console.error('Database error:', err)
                    return res.status(500).json({ error: 'Database error' })
                }

                const totalTasks = progress && progress.total_tasks ? progress.total_tasks : 0
                const completedTasks = progress && progress.completed_tasks ? progress.completed_tasks : 0
                const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
                const pointsProgress = Math.min(((progress && progress.points) || 0) / 10000 * 100, 100)
                const overallProgress = (taskProgress + pointsProgress) / 2
                const points = (progress && progress.points) || 0
                const level = Math.floor(points / 500) + 1

                return res.json({
                    success: true,
                    progress: {
                        points,
                        level,
                        pointsToNextLevel: (level * 500) - points,
                        taskProgress,
                        pointsProgress,
                        overallProgress,
                        completedTasks,
                        totalTasks,
                        season,
                    },
                })
            })
        })
    } catch (error) {
        console.error('Progress error:', error)
        debugLog({
            sessionId: 'debug-session',
            location: 'season.js:progress:catch',
            message: 'Progress error caught',
            data: { error: error && error.message },
            timestamp: Date.now(),
        })
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router
