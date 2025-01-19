// this file is just to run single queries on the database, separately from `init.js`. it'll get modified as needed.

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('chats.db', (e) => {
    if (e) {
        console.error("error opening database: " + e.message)
    } else {
        console.log('connected to chats.db')
    }
})




// AI-GENERATED: querying all threads associated with user id 4 and logging their titles
// db.all("SELECT id, title FROM threads WHERE user_id = ?", [4], (err, rows) => {
//     if (err) {
//         console.error("error retrieving threads:", err.message);
//         return;
//     }
//     rows.forEach(row => {
//         console.log(`thread with id ${row.id} has title: ${row.title}`);
//     });
// });

// AI-GENERATED: updating has_rag_index to false for user with id 4
db.run("UPDATE users SET has_rag_index = ? WHERE id = ?", [false, 4], function(err) {
    if (err) {
        console.error("error updating has_rag_index:", err.message);
    } else {
        console.log(`has_rag_index set to false for user with id 4`);
    }
});











// close the database
db.close(e => {
    if (e) {
        console.error("error closing database: " + e.message);
    }
    console.log("database connection closed.")
})