const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = path.join(__dirname, 'database.sqlite')

let db = null

function initDB() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err)
                reject(err)
                return
            }

            console.log('Connected to SQLite database')

            // Create tables
            db.serialize(() => {
                // Users table
                db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            telegram_id INTEGER UNIQUE NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT,
            username TEXT,
            language_code TEXT DEFAULT 'en',
            is_premium BOOLEAN DEFAULT 0,
            points INTEGER DEFAULT 0,
            ton_balance REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)

                // Items table
                db.run(`
          CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            image_url TEXT NOT NULL,
            collection_id TEXT,
            price_ton REAL NOT NULL,
            rarity TEXT CHECK(rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common',
            views INTEGER DEFAULT 0,
            likes INTEGER DEFAULT 0,
            owner_id INTEGER,
            listed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users (id)
          )
        `)

                // Collections table
                db.run(`
          CREATE TABLE IF NOT EXISTS collections (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            image_url TEXT NOT NULL,
            floor_price REAL DEFAULT 0,
            total_volume REAL DEFAULT 0,
            item_count INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)

                // Gifts table
                db.run(`
          CREATE TABLE IF NOT EXISTS gifts (
            id TEXT PRIMARY KEY,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            item_id TEXT NOT NULL,
            message TEXT,
            opened BOOLEAN DEFAULT 0,
            sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            opened_at DATETIME,
            FOREIGN KEY (sender_id) REFERENCES users (id),
            FOREIGN KEY (receiver_id) REFERENCES users (id),
            FOREIGN KEY (item_id) REFERENCES items (id)
          )
        `)

                // Season stats table
                db.run(`
          CREATE TABLE IF NOT EXISTS season_stats (
            user_id INTEGER NOT NULL,
            season_number INTEGER NOT NULL,
            points INTEGER DEFAULT 0,
            volume_ton REAL DEFAULT 0,
            items_bought INTEGER DEFAULT 0,
            items_sold INTEGER DEFAULT 0,
            referrals INTEGER DEFAULT 0,
            tasks_completed INTEGER DEFAULT 0,
            rank INTEGER,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, season_number),
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `)

                // Tasks table
                db.run(`
          CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            points_reward INTEGER NOT NULL,
            type TEXT CHECK(type IN ('daily', 'weekly', 'season', 'achievement')) DEFAULT 'daily',
            requirement TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)

                // User tasks table
                db.run(`
          CREATE TABLE IF NOT EXISTS user_tasks (
            user_id INTEGER NOT NULL,
            task_id TEXT NOT NULL,
            completed BOOLEAN DEFAULT 0,
            completed_at DATETIME,
            claimed BOOLEAN DEFAULT 0,
            claimed_at DATETIME,
            PRIMARY KEY (user_id, task_id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (task_id) REFERENCES tasks (id)
          )
        `)

                console.log('Database tables created successfully')
                resolve()
            })
        })
    })
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call initDB() first.')
    }
    return db
}

module.exports = {
    initDB,
    getDB
}