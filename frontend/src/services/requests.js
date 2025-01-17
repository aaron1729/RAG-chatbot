// note: these should always be imported _directly_ into the relevant component! there's no need for them to be passed as props.

export async function getChatHistory(userId) {
    try {
        console.log("inside of the async function getChatHistory (on the frontend)")
        const response = await fetch("/api/getChatHistory", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId})
        });
        if (!response.ok) {
            throw new Error("response not ok in getChatHistory")
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error("error getting chat history:", error);
        throw error;
    }
}

export async function sendMessage(threadId, messages) {
    try {
        console.log("inside of the async function sendMessages (on the frontend)")
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({threadId, messages})
        });
        if (!response.ok) {
            throw new Error("failed in sendMessage")
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("error calling chat api:", error);
        throw error;
    }
}

export async function sendNewThreadName(threadId, title) {
    try {
        console.log("inside of the async function updateThread (on the frontend)")
        const response = await fetch("/api/renameChatThread", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({threadId, title})
        });
        if (!response.ok) {
            throw new Error("response not ok in updateThread")
        }
        // wait, is this appropriate? i'm not sure if data _is_ anything...
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("error updating thread:", error);
        throw error;
    }
}

export async function getChatThread(threadId) {
    try {
        console.log("inside of the async function getChatThread (on the frontend)")
        const response = await fetch("/api/getChatThread", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({threadId})
        });
        if (!response.ok) {
            throw new Error("response not ok in getChatThread")
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error(`error getting chat thread with threadId ${threadId}:`, error);
        throw error;
    }
}

export async function deleteChatThread(threadId) {
    try {
        console.log("inside of the async function deleteChatThread (on the frontend)")
        const response = await fetch("/api/deleteChatThread", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({threadId})
        });
        if (!response.ok) {
            throw new Error("response not ok in deleteChatThread")
        }
        // wait, is this appropriate? i'm not sure if data _is_ anything...
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`error deleting chat thread with threadId ${threadId}:`, error);
        throw error;
    }
}