// Backend/server.js — diagnostic version
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config()

const fs = require('fs')

// helper to safe require route modules
function safeRequireRoute(routePath) {
    try {
        const mod = require(routePath)
        console.log(`[OK] Loaded ${routePath}`)
        // If module exports router directly, return it
        return mod
    } catch (err) {
        console.error(`[ERR] Failed to require ${routePath}: ${err && err.message}`)
        // write to log file too (best-effort)
        try {
            fs.appendFileSync('.cursor/require-errors.log', `${new Date().toISOString()} ${routePath} -> ${err.stack || err}\n`)
        } catch (e) { /* ignore */ }

        // Return a fallback router that responds with 501 so server can start
        const fallback = express.Router()
        fallback.use((req, res) => {
            res.status(501).json({ error: `Route ${routePath} is disabled due to require error: ${err && err.message}` })
        })
        return fallback
    }
}

// Initialize app
const app = express()

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}))

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})
app.use('/api/', limiter)

// Middleware
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173", // vite default
    "https://vault-nft-project.vercel.app",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            // Check against list
            if (allowedOrigins.includes(origin)) {
                return callback(null, true)
            } else {
                return callback(new Error('Not allowed by CORS'))
            }
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Database initialization
try {
    const { initDB } = require('./db/init')
    initDB()
    console.log('[OK] DB initialized')
} catch (e) {
    console.error('[ERR] Failed to init DB:', e && e.message)
}

// Import routes safely
const authRoutes = safeRequireRoute('./routes/auth')
const userRoutes = safeRequireRoute('./routes/user')
const itemsRoutes = safeRequireRoute('./routes/items')
const giftsRoutes = safeRequireRoute('./routes/gifts')
const seasonRoutes = safeRequireRoute('./routes/season')
const tasksRoutes = safeRequireRoute('./routes/tasks')
const nftRoutes = safeRequireRoute('./routes/nft')

// Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/items', itemsRoutes)
app.use('/api/gifts', giftsRoutes)
app.use('/api/season', seasonRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/nft', nftRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err && err.stack)
    res.status(err && err.status || 500).json({
        error: {
            message: err && err.message || 'Internal Server Error',
            code: err && err.code || 'INTERNAL_ERROR'
        }
    })
})

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' })
})

const { performBackup } = require('./db/backup')

// Schedule Backup (every 6 hours)
setInterval(() => {
    performBackup()
}, 6 * 60 * 60 * 1000)

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`)

    // Initial backup on start (dev only? no, let's just do it)
    // performBackup() 
})

