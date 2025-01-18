const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// this filepath is based on node's working directory (meaning `backend/`) -- it's not relative to the current file.
const db = new sqlite3.Database(path.join(__dirname, "chats.db"), (e) => {
    if (e) {
        console.error("error opening database: " + e.message);
    } else {
        console.log("connected to chats.db");
    }
})

/////// THESE ASYUNC FUNCTIONS RETURN PROMISES, which (hopefully!) resolve the indicated values/types.


// resolves to a boolean
function updateUserInfo(userId, params) {
    // AI-GENERATED: updating user info in the users table
    return new Promise((resolve, reject) => {
        db.run(`UPDATE users SET ${Object.keys(params).map(key => `${key} = ?`).join(", ")} WHERE id = ?`, [...Object.values(params), userId], (e) => {
            if (e) {
                console.error("error updating user info: " + e.message);
                return reject(e);
            }
            console.log(`updated user info for user with id ${userId}`);
            resolve(true);
        });
    });
}

// resolves to an object
function getUserInfo(userId) {
    console.log("inside of getUserInfo function on the server side")
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE id = ?`, [userId], (e, row) => {
            if (e) {
                return reject(e);
            }
            console.log(`fetched user info for user with id ${userId}`);
            console.log(`row is ${row}`)
            resolve(row);
        });
    });
}

// resolves to the thread id
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

// resolves to a boolean
function renameThread(threadId, title) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE threads SET title = ?, rag_status = ? WHERE id = ?`, [title, "NEEDS_UPDATE", threadId], function(e) {
            if (e) {
                return reject(e);
            }
            console.log(`thread with id ${threadId} has been renamed to "${title}" and rag_status set to "NEEDS_UPDATE"`);
            resolve(true);
        });
    });
};

// resolves to a boolean
function updateThreadRagStatus(threadId, ragStatus) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE threads SET rag_status = ? WHERE id = ?`, [ragStatus, threadId], function(e) {
            if (e) {
                return reject(e);
            }
            console.log(`thread with id ${threadId} has been updated to rag status "${ragStatus}"`);
            resolve(true);
        });
    });
}

// resolves to a boolean
function deleteThread(threadId) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM threads WHERE id = ?`, [threadId], function(e) {
            if (e) {
                return reject(e);
            }
            console.log(`thread with id ${threadId} has been deleted`);
            resolve(true);
        });
    });
};

// resolves to the array of thread titles and ids for the given user id
function getThreads(userId) {
    return new Promise((resolve, reject) => {
    db.all(`SELECT id, title, rag_status FROM threads WHERE user_id = ?`, [userId], (e, rows) => {
        if (e) {
            return reject(e);
        }
        console.log(`fetched threads for user with id ${userId}`);
        resolve(rows);
    });
    });
};

// resolves to the message id
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

// resolves to the array of message objects for the given thread id
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
    updateUserInfo,
    getUserInfo,
    insertThread,
    renameThread,
    updateThreadRagStatus,
    deleteThread,
    getThreads,
    insertMessage,
    getMessages,
    closeDatabase,
};