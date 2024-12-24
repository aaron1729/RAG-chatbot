const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const cors = require("cors");

require("dotenv").config();
const apiKey = process.env.VITE_ANTHROPIC_API_KEY

const app = express();
app.use(express.json())

// middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173" // the vite dev server port
}))

const anthropic = new Anthropic({
    apiKey: apiKey
})

app.post("/api/chat", async (req, res) => {
        try {
        console.log("sending messages...", req.body.messages);
        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: req.body.messages
        });
        console.log("here's the response:")
        Object.entries(response).forEach(([key, value]) => {
            console.log(`${key}: ${value}`)
        })
        res.json({content: response.content[0].text});
        console.log(`response received! and it is: ${response.content[0].text}`)
        // console.log(`received response text: ${response.content[0].text}`);
    } catch (error) {
        console.error(`error calling anthropic api: ${error}`);
        res.status(500).json({error: error.message})
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})