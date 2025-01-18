// pull from `backend/.env`, not the `.env` file in the root.
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, ".env")
});
const PYTHON_SERVER_PORT = process.env.PYTHON_SERVER_PORT || 8000;
const PORT = process.env.PORT || 3000
// const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT;

// for now this is hard-coded, here and in App.jsx.
const TEMP_USER_ID = 4

// database functions
const { updateUserInfo, getUserInfo, indexChats, insertThread, renameThread, deleteThread, getThreads, insertMessage, getMessages, closeDatabase } = require("./database/operations.js");

// for server
const express = require("express");
const cors = require("cors");

// TO BE REMOVED
// const anthropicApiKey = process.env.VITE_ANTHROPIC_API_KEY
// const Anthropic = require("@anthropic-ai/sdk");
// const anthropic = new Anthropic({
//     apiKey: anthropicApiKey
// })

const app = express();
app.use(express.json())

// middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173" // the vite dev server port
}))

// handle new chat messages.
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
            threadId = await insertThread(TEMP_USER_ID, `new thread at ${timestamp}`)
            console.log(`inside of \`/api/chat\` endpoint handler: just made a new thread, with threadId ${threadId}`)
            insertMessage(threadId, "assistant", messages[0].content)
        }
        
        // save the user message to the database.
        insertMessage(threadId, "user", messages[messages.length - 1].content)
        
        // get a response from the assistant. two ways (one commented-out):

        // chat via the llama server...
        const response = await fetch(`http://localhost:${PYTHON_SERVER_PORT}/chat`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(messages)
        })
        // `response` has only non-enumerable properties, so this doesn't show anything.
        // console.log(`response: ${JSON.stringify(response)}`)
        const data = await response.json();
        console.log(`data: ${JSON.stringify(data)}`);
        const responseText = data.response;
        
        
        // use the anthropic API directly...
        // console.log("sending messages...", messages);
        // const responseOLD = await anthropic.messages.create({
        //     model: "claude-3-sonnet-20240229",
        //     max_tokens: 1024,
        //     messages: messages
        // });
        // console.log("here's the response:")
        // Object.entries(responseOLD).forEach(([key, value]) => {
        //     console.log(`${key}: ${value}`)
        // })
        // console.log(`\nand responseOLD.content[0].text is: ${responseOLD.content[0].text}`)
        // const responseText = responseOLD.content[0].text


        // save the assistant message to the database.
        insertMessage(threadId, "assistant", responseText)
        
        // respond with the response, and also with the threadId
        res.json({
            threadId: threadId,
            content: responseText
        });
    } catch (e) {
        console.error(`error calling chat api: ${e}`);
        res.status(500).json({error: e.message})
    }
})

// handle requests to get a user's info.
app.post("/api/getUserInfo", async (req, res) => {
    console.log("inside of the `/api/getUserInfo` endpoint handler")
    const { userId } = req.body
    try {
        const userInfo = await getUserInfo(userId)
        console.log(`the user info is: ${userInfo}`)
        // switch from snake case to camel case.
        userInfo.hasRagIndex = userInfo.has_rag_index
        delete userInfo.has_rag_index
        res.json(userInfo)
    } catch (e) {
        console.error(`error getting user info: ${e}`);
        res.status(500).json({error: e.message});
    }
})

// handle requests to index a user's chats.
app.post("/api/indexChats", async (req, res) => {
    console.log("inside of the `/api/indexChats` endpoint handler")
    const { userId } = req.body
    try {
        const response = await fetch(`http://localhost:${PYTHON_SERVER_PORT}/index_chats`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            // this needs to be JSON-stringified to be in the correct format. (of course, it's just the int turned into a string.)
            body: JSON.stringify(userId)
        })
        const success = await response.json();
        // this should just be a boolean.
        console.log(`success: ${JSON.stringify(success)}`)
        if (success) {
            updateUserInfo(userId, {"has_rag_index": true})
        }
        res.status(200).json(success);
    } catch (e) {
        console.error(`error indexing chats: ${e}`);
        res.status(500).json({error: e.message});
    }
})

// handle requests to get a user's chat history.
app.post("/api/getChatHistory", async (req, res) => {
    console.log("inside of the `/api/getChatHistory` endpoint handler")
    const { userId } = req.body
    try {
        const threads = await getThreads(userId)
        console.log("the threads are...")
        threads.forEach(thread => {
            // switch from snake case to camel case.
            thread.ragStatus = thread.rag_status;
            delete thread.rag_status;
            console.log(`thread id: ${thread.id}, title: ${thread.title}, ragStatus: ${thread.ragStatus}`);
        });
        res.json(threads)
    } catch (e) {
        console.error(`error getting chat history: ${e}`);
        res.status(500).json({error: e.message});
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
        res.status(500).json({error: e.message});
    }
})

// handle requests to rename a thread.
app.post("/api/renameChatThread", async (req, res) => {
    console.log("inside of the `/api/renameThread` endpoint handler")
    const { title, threadId } = req.body
    try {
        const updated = await renameThread(threadId, title);
        if (updated) {
            return res.status(200).json( {message: "thread title updated succesfully"})
        } else {
            return res.status(404).json({error: "thread title not successfully updated"})
        }
    } catch (e) {
        console.error("error creating or updating thread: " + e.message);
        res.status(500).json({error: e.message});
    }
})

// handle requests to delete a thread.
app.post("/api/deleteChatThread", async (req, res) => {
    console.log("inside of the `/api/deleteChatThread` endpoint handler")
    const { threadId } = req.body
    try {
        const deleted = await deleteThread(threadId);
        if (deleted) {
            return res.status(200).json({message: "thread successfully deleted"})
        } else {
            return res.status(404).json({error: "thread not found or not successfully deleted"})
        }
    } catch (e) {
        console.error("error deleting thread: " + e.message);
        res.status(500).json({error: e.message});
    }
})

////////////////////////////////////////

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

process.on("SIGINT", () => {
    closeDatabase();
    process.exit(0);
});