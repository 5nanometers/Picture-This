const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./Users.db', (err) => {
    if (err) {
        return console.error("Error opening database:", err.message);
    }
    console.log("Connected to the Cameras database.");
});

const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                console.error("Error:", err.message);
                reject(err);
            }
            else resolve(rows);
        })
    })
};

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        shopping_cart TEXT DEFAULT '[]')
        `, (err) => {
        if (err) {
            return console.error("Error creating table:", err.message);
        }
        console.log("Users table created (if it didn't already exist).");
    });

    const insert = db.prepare(`
        INSERT OR IGNORE INTO Users (username, password, shopping_cart)
        VALUES (?, ?, ?)
    `);
    insert.run("Guest", "123", "[]");
    insert.finalize();
});

module.exports = { db, runQuery };

