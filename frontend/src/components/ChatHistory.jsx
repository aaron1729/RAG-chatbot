import ChatThread from "./ChatThread";
import PropTypes from 'prop-types';

function ChatHistory({ chatHistory }) {
    console.log(`inside of ChatHistory; chatHistory.length is ${chatHistory.length}, and (assuming it's nonempty) it is as follows:`)
    chatHistory.forEach(X => {
        for (const [key, value] of Object.entries(X)) {
            console.log(`key: ${key}; value: ${value}`)
        }
    })
    if (chatHistory.length) {
        console.log("chatHistory[0] id:", chatHistory[0].id)
        console.log("chatHistory[0] title:", chatHistory[0].title)
    }
    return (
        <div>
            {chatHistory.map((chatThread, index) => {
                return (
                    <ChatThread
                        key={index}
                        chatThread={chatThread}
                    />
                )
            })}
        </div>
    )
}

ChatHistory.propTypes = {
    chatHistory: PropTypes.array.isRequired
}

export default ChatHistory