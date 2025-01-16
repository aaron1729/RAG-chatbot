export async function sendMessage(messages) {
    try {
        console.log("inside of the async function sendMessages (on the frontend)")
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({messages})
        });
        if (!response.ok) {
            throw new Error("failed in sendMessage")
        }
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("error calling chat api:", error);
        throw error;
    }
}

export async function updateThread(title, threadId = undefined) {
    try {
        console.log("inside of the async function updateThread (on the frontend)")
        const response = await fetch("/api/threads", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, threadId})
        });
        if (!response.ok) {
            throw new Error("response not ok in updateThread")
        }
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("error updating thread:", error);
        throw error
    }
}