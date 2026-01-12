const crypto = require('crypto')
const jwt = require('jsonwebtoken') // Ensure this is available scope-wise if needed, but I put it in the function block in previous tool? No, I put it at global scope of the file in the replacement content.

// Telegram Bot token from environment
const BOT_TOKEN = process.env.BOT_TOKEN

/**
 * Validate Telegram WebApp initData
 * @param {string} initData - Telegram WebApp initData string
 * @returns {boolean} - True if valid
 */
function validateTelegramInitData(initData) {
    if (!initData || !BOT_TOKEN) return false

    try {
        // Parse initData
        const params = new URLSearchParams(initData)
        const hash = params.get('hash')
        params.delete('hash')

        // Sort parameters alphabetically
        const dataCheckString = Array.from(params.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n')

        // Calculate secret key
        const secretKey = crypto.createHmac('sha256', 'WebAppData')
            .update(BOT_TOKEN)
            .digest()

        // Calculate hash
        const calculatedHash = crypto.createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex')

        return calculatedHash === hash
    } catch (error) {
        console.error('Error validating initData:', error)
        return false
    }
}

/**
 * Extract user data from initData
 * @param {string} initData - Telegram WebApp initData string
 * @returns {Object|null} - User object or null
 */
function extractUserFromInitData(initData) {
    try {
        const params = new URLSearchParams(initData)
        const userStr = params.get('user')
        if (!userStr) return null

        const user = JSON.parse(userStr)
        return {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name || '',
            username: user.username || '',
            languageCode: user.language_code || 'en',
            isPremium: user.is_premium || false
        }
    } catch (error) {
        console.error('Error extracting user:', error)
        return null
    }
}

/**
 * Middleware to validate Telegram auth
 */
function telegramAuth(req, res, next) {
    const initData = req.headers['x-telegram-init-data'] || req.query.initData

    if (!initData) {
        return res.status(401).json({ error: 'Telegram initData required' })
    }

    if (!validateTelegramInitData(initData)) {
        return res.status(401).json({ error: 'Invalid Telegram auth' })
    }

    const user = extractUserFromInitData(initData)
    if (!user) {
        return res.status(401).json({ error: 'Invalid user data' })
    }

    req.telegramUser = user
    next()
}

/**
 * Middleware to verify JWT token from cookie
 */
function verifyToken(req, res, next) {
    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        // For compatibility with legacy code that expects telegramUser
        req.telegramUser = { id: decoded.id }
        next()
    } catch (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' })
    }
}

module.exports = {
    telegramAuth,
    verifyToken,
    validateTelegramInitData,
    extractUserFromInitData
}