const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('chats.db', (e) => {
    if (e) {
        console.error("error opening database: " + e.message)
    } else {
        console.log('connected to chats.db')
    }
})

// drop any old tables
db.run(`DROP TABLE IF EXISTS users`);
db.run(`DROP TABLE IF EXISTS threads`);
db.run(`DROP TABLE IF EXISTS messages`);

// make new tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS threads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thread_id INTEGER REFERENCES threads(id),
        message TEXT NOT NULL,
        role TEXT CHECK(role IN ('user', 'assistant')) NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
});

db.close(e => {
    if (e) {
        console.error("error closing database: " + e.message);
    }
    console.log("database connection closed.")
})