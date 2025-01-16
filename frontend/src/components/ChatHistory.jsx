import { useState } from "react";
import ChatThread from "./ChatThread";
import PropTypes from 'prop-types';

// the `chatHistory` props is a list of ChatThread objects (each with keys `id` and `title).
function ChatHistory({ chatHistory, setChatHistory, renameThread, currentThreadId, setCurrentThreadId, setMessages }) {

    const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState(false)

    // the position of a ChatThreadMenu, should it exist
    const [chatThreadMenuPosition, setChatThreadMenuPosition] = useState({top: null, left: null})

    const margin = "5px"

    return (
        <div style={{ marginTop: margin }}>
            {chatHistory.map((chatThread, index) => {
                return (
                    <div key={index} style={{ marginBottom: margin }}>
                        <ChatThread
                            index={index}
                            chatThread={chatThread}
                            chatThreadMenuPosition={chatThreadMenuPosition}
                            setChatThreadMenuPosition={setChatThreadMenuPosition}
                            isAnyDropdownOpen={isAnyDropdownOpen}
                            setIsAnyDropdownOpen={setIsAnyDropdownOpen}
                            renameThread={renameThread}
                            currentThreadId={currentThreadId}
                            setCurrentThreadId={setCurrentThreadId}
                            setMessages={setMessages}
                        />
                    </div>
                )
            })}
        </div>
    )
}

ChatHistory.propTypes = {
    chatHistory: PropTypes.array,
    setChatHistory: PropTypes.func,
    renameThread: PropTypes.func,
    currentThreadId: PropTypes.number,
    setCurrentThreadId: PropTypes.func,
    setMessages: PropTypes.func,
}

export default ChatHistory