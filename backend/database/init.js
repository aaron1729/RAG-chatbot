// for now this is hard-coded. this occurs here and in `App.jsx`.
// whenever actually handling it, be sure to handle the logic for adding a new user, and of course ensure that getUserInfo here never returns an empty value.
const TEMP_USER_ID = 4

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
        email TEXT NOT NULL UNIQUE,
        has_rag_index BOOLEAN DEFAULT FALSE
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS threads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        rag_status TEXT NOT NULL CHECK(rag_status IN ('NEVER_INDEXED', 'UP_TO_DATE', 'NEEDS_UPDATE')) DEFAULT 'NEVER_INDEXED'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thread_id INTEGER REFERENCES threads(id),
        content TEXT NOT NULL,
        role TEXT CHECK(role IN ('user', 'assistant')) NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
});

// insert a test user into the users table
db.run(`INSERT INTO users (id, username, email, has_rag_index) VALUES (${TEMP_USER_ID}, "john", "johndoe@gmail.com", FALSE)`, (e) => {
    if (e) {
        console.error("error inserting test user: " + e.message);
    } else {
        console.log("test user inserted: john");
    }
});

// close the database
db.close(e => {
    if (e) {
        console.error("error closing database: " + e.message);
    }
    console.log("database connection closed.")
})