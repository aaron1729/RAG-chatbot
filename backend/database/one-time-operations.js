// this file is just to run single queries on the database, separately from `init.js`. it'll get modified as needed.

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('chats.db', (e) => {
    if (e) {
        console.error("error opening database: " + e.message)
    } else {
        console.log('connected to chats.db')
    }
})



// AI-GENERATED: inserting a new user into the users table
db.run(`INSERT INTO users (id, username, email) VALUES (?, ?, ?)`, [4, "john", "john@gmail.com"], function(e) {
    if (e) {
        console.error("error inserting user: " + e.message);
    } else {
        console.log(`inserted user with id ${this.lastID}: username is "${"john"}" and email is "${"john@gmail.com"}"`);
    }
});

// AI-GENERATED: inserting a new user into the users table
db.run(`INSERT INTO users (id, username, email) VALUES (?, ?, ?)`, [5, "cindy", "cindy@gmail.com"], function(e) {
    if (e) {
        console.error("error inserting user: " + e.message);
    } else {
        console.log(`inserted user with id ${this.lastID}: username is "${"cindy"}" and email is "${"cindy@gmail.com"}"`);
    }
});


// AI-GENERATED: updating john's has_rag_index to TRUE
db.run(`UPDATE users SET has_rag_index = ? WHERE id = ?`, [true, 4], function(e) {
    if (e) {
        console.error("error updating user has_rag_index: " + e.message);
    } else {
        console.log(`updated user with id 4: has_rag_index is now ${true}`);
    }
});




db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) {
        console.error("error fetching users: " + err.message);
    } else {
        console.log("fetched users: ", rows); // log the fetched users
        console.log("length is:", rows.length)
    }
});




// console.log(allUsers.length)









// close the database
db.close(e => {
    if (e) {
        console.error("error closing database: " + e.message);
    }
    console.log("database connection closed.")
})