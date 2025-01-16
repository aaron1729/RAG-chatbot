import SidebarHeader from "./SidebarHeader";
import ChatHistory from "./ChatHistory";
import PropTypes from 'prop-types';

// the props `chatHistory` is a list of `chatThread` objects (each with keys `id` and `title`).
function Sidebar({ chatHistory, renameThread, currentThreadId, setCurrentThreadId, setMessages }) {
    return (
        <div
            className="flex flex-col h-full w-1/4 bg-white border-r overflow-y-auto"
        >
            <SidebarHeader />
            <ChatHistory
                chatHistory={chatHistory}
                renameThread={renameThread}
                currentThreadId={currentThreadId}
                setCurrentThreadId={setCurrentThreadId}
                setMessages={setMessages}
            />
        </div>
    )
}

Sidebar.propTypes = {
    chatHistory: PropTypes.array,
    renameThread: PropTypes.func,
    currentThreadId: PropTypes.number,
    setCurrentThreadId: PropTypes.func,
    setMessages: PropTypes.func,
}

export default Sidebar