import SidebarHeader from "./SidebarHeader";
import ChatHistory from "./ChatHistory";
import PropTypes from 'prop-types';

// the props `chatHistory` is a list of `chatThread` objects (each with keys `id` and `title`).
function Sidebar({ chatHistory, renameOrRemoveThread, currentThreadId, setCurrentThreadId, setMessages, startNewChat }) {
    return (
        <div
            className="flex flex-col h-full w-1/4 bg-white border-r overflow-y-auto"
        >
            <SidebarHeader
                startNewChat={startNewChat}
                currentThreadId={currentThreadId}
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
}

export default Sidebar