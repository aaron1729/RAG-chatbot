import { useState, useEffect } from "react";
import SidebarHeader from "./SidebarHeader";
import ChatHistory from "./ChatHistory";
import PropTypes from 'prop-types';

// the props `chatHistory` is a list of `chatThread` objects (each with keys `id` and `title` and and `ragStatus`).
function Sidebar({ chatHistory, renameOrRemoveThread, currentThreadId, setCurrentThreadId, setMessages, startNewChat, hasRagIndex, handleIndexChatsSubmit }) {
    
    // start this as `true`, so that the button starts out disabled.
    const [allRagStatusesUpToDate, setAllRagStatusesUpToDate] = useState(true);

    useEffect(() => {
        setAllRagStatusesUpToDate(
            chatHistory.every(chatThread => (chatThread.ragStatus === "UP_TO_DATE"))
        )
    }, [chatHistory])

    useEffect(() => {
        // for debugging
        console.log(`allRagStatusesUpToDate is: ${allRagStatusesUpToDate}`)
    }, [allRagStatusesUpToDate])
    
    return (
        
        <div
            className="flex flex-col h-full w-1/4 bg-white border-r overflow-y-auto"
        >
            <SidebarHeader
                startNewChat={startNewChat}
                currentThreadId={currentThreadId}
                hasRagIndex={hasRagIndex}
                handleIndexChatsSubmit={handleIndexChatsSubmit}
                allRagStatusesUpToDate={allRagStatusesUpToDate}
            />
            <ChatHistory
                chatHistory={chatHistory}
                renameOrRemoveThread={renameOrRemoveThread}
                currentThreadId={currentThreadId}
                setCurrentThreadId={setCurrentThreadId}
                setMessages={setMessages}
            />
        </div>
    )
}

Sidebar.propTypes = {
    chatHistory: PropTypes.array,
    renameOrRemoveThread: PropTypes.func,
    currentThreadId: PropTypes.number,
    setCurrentThreadId: PropTypes.func,
    setMessages: PropTypes.func,
    startNewChat: PropTypes.func,
    hasRagIndex: PropTypes.bool,
    handleIndexChatsSubmit: PropTypes.func,
}

export default Sidebar