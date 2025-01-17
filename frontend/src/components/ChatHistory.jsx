import { useState, useEffect } from "react";
import ChatThread from "./ChatThread";
import PropTypes from 'prop-types';

// the `chatHistory` props is a list of ChatThread objects (each with keys `id` and `title).
function ChatHistory({ chatHistory, setChatHistory, renameOrRemoveThread, currentThreadId, setCurrentThreadId, setMessages }) {

    // this computes the && of all individual `isDropdownOpen` booleans.
    const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState(false)

    useEffect(() => {
        // for debugging
        console.log(`isAnyDropdownOpen is now ${isAnyDropdownOpen}`);
    }, [isAnyDropdownOpen])

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
                            renameOrRemoveThread={renameOrRemoveThread}
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
    renameOrRemoveThread: PropTypes.func,
    currentThreadId: PropTypes.number,
    setCurrentThreadId: PropTypes.func,
    setMessages: PropTypes.func,
}

export default ChatHistory