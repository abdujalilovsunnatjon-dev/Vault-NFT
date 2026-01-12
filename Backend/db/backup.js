const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

function performBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `database_backup_${timestamp}.sqlite`);

    fs.copyFile(DB_PATH, backupPath, (err) => {
        if (err) {
            console.error('Backup failed:', err);
        } else {
            console.log(`Backup created successfully: ${backupPath}`);
            // Optional: Clean up old backups (keep last 5)
            cleanOldBackups();
        }
    });
}

function cleanOldBackups() {
    fs.readdir(BACKUP_DIR, (err, files) => {
        if (err) return;

        const backups = files
            .filter(f => f.startsWith('database_backup_') && f.endsWith('.sqlite'))
            .map(f => ({ name: f, time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime() }))
            .sort((a, b) => b.time - a.time);

        if (backups.length > 5) {
            backups.slice(5).forEach(backup => {
                fs.unlink(path.join(BACKUP_DIR, backup.name), (err) => {
                    if (err) console.error(`Failed to delete old backup ${backup.name}:`, err);
                });
            });
        }
    });
}

module.exports = { performBackup };
