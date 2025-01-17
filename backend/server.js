const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const cors = require("cors");

require("dotenv").config();
const apiKey = process.env.VITE_ANTHROPIC_API_KEY

const app = express();
app.use(express.json())

const { insertThread, renameThread, getThreads, insertMessage, getMessages, closeDatabase } = require("./database.js");

// middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173" // the vite dev server port
}))

const anthropic = new Anthropic({
    apiKey: apiKey
})

// handle new chats.
app.post("/api/chat", async (req, res) => {
    try {
        console.log("inside of the `/api/chat` endpoint handler")
        // if this is a new thread, get a new threadId and save the initial assistant message to the database.
        const { messages } = req.body
        let { threadId } = req.body
        if (!threadId) {
            // the `'sv'` is for sweden's standards for formatting the date & time -- a convenient trick for getting "YYYY-MM-DD HH:MM:SS".
            const timestamp = new Date().toLocaleString('sv')
            console.log("timestamp is:", timestamp)
            // the first argument is the userId. this is currently hard-coded.
            threadId = await insertThread(5, `new thread at ${timestamp}`)
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

// handle requests to get a user's chat history.
app.post("/api/getChatHistory", async (req, res) => {
    console.log("inside of the `/api/getChatHistory` endpoint handler")
    const { userId } = req.body
    try {
        const threads = await getThreads(userId)
        // console.log("the threads are...")
        // threads.forEach(thread => {console.log(`thread id: ${thread.id}, title: ${thread.title}`)});
        res.json(threads)
    } catch (e) {
        console.error(`error getting chat history: ${e}`);
        res.status(500).json({error:e.message})
    }
})

// handle requests to get a thread's messages.
app.post("/api/getChatThread", async (req, res) => {
    console.log("inside of the `/api/getChatThread/` endpoint handler")
    const { threadId } = req.body
    try {
        const messages = await getMessages(threadId)
        console.log("the messages are...")
        messages.forEach(message => {console.log(message.role + ": " + message.content)});
        res.json(messages)
    } catch (e) {
        console.error(`error getting chat thread: ${e}`);
        res.status(500).json({error:e.message})
    }
})


// handle requests to rename a thread.
app.post("/api/renameThread", async (req, res) => {
    console.log("inside of the `/renameThread` endpoint handler")
    const { title, threadId } = req.body
    try {
        const updated = await renameThread(threadId, title);
        if (updated) {
            return res.status(200).json( {message: "thread title updated succesfully"})
        } else {
            return res.status(404).json({error: "thread title not successfully updated"})
        }
    } catch (e) {
        console.error("error creating or updating thread: " + e.message)
        res.status(500).json({error: e.message})
    }
})

////////////////////////////////////////

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

process.on("SIGINT", () => {
    closeDatabase();
    process.exit(0);
});