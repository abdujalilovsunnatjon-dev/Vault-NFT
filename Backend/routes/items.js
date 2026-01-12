const express = require('express')
const router = express.Router()
const { getDB } = require('../db/init')

// GET /api/items/list
router.get('/list', (req, res) => {
    const db = getDB()

    db.all(
        `SELECT id, name, price_ton, image_url, rarity
     FROM items
     ORDER BY id DESC`,
        [],
        (err, rows) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ error: 'Database error' })
            }

            res.json({
                success: true,
                items: rows
            })
        }
    )
})

module.exports = router
