const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const cors = require("cors");

require("dotenv").config();
const apiKey = process.env.VITE_ANTHROPIC_API_KEY

const app = express();
app.use(express.json())

const { insertThread, renameThread, insertMessage, closeDatabase } = require("./database.js");




// TEST DATABASE
// do this as an async IIFE. these are all `await` so that we pause execution, and then the console log actually shows the result.
// (async () => {

//     // insert a new thread. the first argument is the user id.
    
//     const testThreadId = await insertThread(5, "test thread title")
//     console.log(`testThreadId is: ${testThreadId}`)

//     // then, add two new messages in that thread.

//     const testMessageId = await insertMessage(testThreadId, "hi there!")
//     console.log(`testMessageId is: ${testMessageId}`)

//     const testMessageId2 = await insertMessage(testThreadId, "hello again!")
//     console.log(`testMessageId2 is: ${testMessageId}`)

//     // then, rename the thread.

//     const updated = await renameThread(testThreadId, "my new title");
//     console.log(`updated is: ${updated}`)

// })();






// middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173" // the vite dev server port
}))

const anthropic = new Anthropic({
    apiKey: apiKey
})

// handle requests to make a new thread
app.post("/api/threads", async (req, res) => {
    console.log("inside of the `/threads` endpoint handler")
    const { title, threadId } = req.body
    try {
        if (threadId) {
            // if a thread id is provided, update its title.
            const updated = await renameThread(threadId, title);
            if (updated) {
                return res.status(200).json( { message: "thread title updated succesfully" })
            } else {
                return res.status(404).json( { error: "thread not found" } )
            }
        } else {
            // if no thread id is provided, make a new one. the first argument is the user id.
            const newThreadId = await insertThread(5, title);
            return res.status(201).json({ threadId: newThreadId })

        }
    } catch (e) {
        console.error("error creating or updating thread: " + e.message)
        res.status(500).json({error: e.message})
    }
})

app.post("/api/chat", async (req, res) => {
    try {
        console.log("inside of the `/api/chat` endpoint handler")
        // if this is a new thread, get a new threadId and save the initial assistant message to the database.
        const { messages } = req.body
        for (const [key, value] of Object.entries(messages[1])) {
            console.log(`key: ${key}\nvalue: ${value}`)
        }

        let { threadId } = req.body
        if (!threadId) {
            // the first argument is the userId. this is currently hard-coded.
            threadId = await insertThread(5, "[thread title]")
            console.log(`inside of \`/api/chat\` endpoint handler: just made a new thread, with threadId ${threadId}`)
            insertMessage(threadId, "assistant", messages[0].content)
        }

        // save the user message to the database.
        insertMessage(threadId, "user", messages[messages.length - 1].content)
        
        // get a response from the assistant.
        console.log("sending messages...", messages);
        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: messages
        });
        console.log("here's the response:")
        Object.entries(response).forEach(([key, value]) => {
            console.log(`${key}: ${value}`)
        })
        console.log(`\nand response.content[0].text is: ${response.content[0].text}`)

        // save the assistant message to the database.
        insertMessage(threadId, "assistant", response.content[0].text)
        
        // respond with the response, and also with the threadId
        res.json({
            threadId: threadId,
            content: response.content[0].text
        });
    } catch (e) {
        console.error(`error calling anthropic api: ${e}`);
        res.status(500).json({error: e.message})
    }
})





const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

process.on("SIGINT", () => {
    closeDatabase();
    process.exit(0);
});