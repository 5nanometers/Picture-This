const sqlite3 = require('sqlite3').verbose();

// Create or open the camera database
// const db = new sqlite3.Database('./Cameras.db', (err) => {
//     if (err) {
//         return console.error("Error opening database:", err.message);
//     }
//     console.log("Connected to the Cameras database.");
// });
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'Cameras.db'));

// Wrap queries in Promises 
const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                console.error("Error creating the database:", err.message);
                reject(err);
            }

            else resolve(rows);
        })
    })
};

// Start database
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Cameras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT,
        description TEXT
        )
        `, (err) => {
        if (err) {
            return console.error("Error creating table:", err.message);
        }
        console.log("Cameras table created (if it didn't already exist).");
    });

    const insertProducts = db.prepare(`
        INSERT OR REPLACE INTO Cameras (id, name, price, image, description)
        VALUES (?, ?, ?, ?, ?)
        `);

    insertProducts.run(1, "Contax T2", 800, "/images/contax-t2.jpg", "Compact 35mm film camera with Zeiss lens");
    insertProducts.run(2, "Ricoh GR", 650, "/images/ricoh-gr.jpg", "Pocketable digital camera with wide-angle lens");
    insertProducts.run(3, "Leica M6", 2000, "/images/leica-m6.jpg", "Premium 35mm rangefinder film camera");

    insertProducts.finalize();

});

// 
const getProducts = async () => {
    try {
        return await runQuery("SELECT * FROM Cameras");
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

module.exports = { db, getProducts, runQuery };

