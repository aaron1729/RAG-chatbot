const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('chats.db', (e) => {
    if (e) {
        console.error("error opening database: " + e.message);
    } else {
        console.log("connected to chats.db");
    }
})

// since this is an async operation, return a promise, which hopefully resolves to the thread id.
function insertThread(userId, title) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO threads (title, user_id) VALUES (?, ?)`, [title, userId], function(e) {
            if (e) {
                return reject(e);
            }
            console.log(`a thread has been created with id ${this.lastID}`);
            resolve(this.lastID);
        });
    });
};

// since this is an async operation, return a promise, which hopefully resolves.
function renameThread(threadId, title) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE threads SET title = ? WHERE id = ?`, [title, threadId], function(e) {
            if (e) {
                return reject(e);
            }
            console.log(`thread with id ${threadId} has been renamed to "${title}"`);
            resolve(true);
        });
    });
};

// since this is an async operation, return a promise, which hopefully resolves to the array of thread titles and ids for the given user id.
function getThreads(userId) {
    return new Promise((resolve, reject) => {
    db.all(`SELECT id, title FROM threads WHERE user_id = ?`, [userId], (e, rows) => {
        if (e) {
            return reject(e);
        }
        console.log(`fetched threads for user with id ${userId}`);
        resolve(rows);
    });
    });
};

// since this is an async operation, return a promise, which hopefully resolves to the message id.
function insertMessage(threadId, role, message) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO messages (thread_id, role, content) VALUES (?, ?, ?)`, [threadId, role, message], function(e) {
            if (e) {
                return reject(e);
            }
            console.log(`inserted a message into the messages table with id ${this.lastID}: role is "${role}" and content is\n${message}`);
            resolve(this.lastID);
        });
    });
};

function getMessages(threadId) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT role, content FROM messages WHERE thread_id = ?`, [threadId], (e, rows) => {
            if (e) {
                return reject(e);
            }
            console.log(`fetched messages for thread with id ${threadId}`);
            resolve(rows);
        });
    });
};

function closeDatabase() {
    db.close((e) => {
        if (e) {
            console.error("failed to close database: " + e.message);
        }
        console.log("database connection closed.");
    })
}

module.exports = {
    insertThread,
    renameThread,
    getThreads,
    insertMessage,
    getMessages,
    closeDatabase,
};