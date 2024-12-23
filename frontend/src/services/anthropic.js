export async function sendMessage(messages) {
    try {
        console.log("inside of the sync function sendMessages (on the frontend)")
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({messages})
        });
        if (!response.ok) {
            throw new Error("network response was nicht so gut!")
        }
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("error calling chat api:", error);
        throw error;
    }
}