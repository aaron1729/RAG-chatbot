import SidebarHeader from "./SidebarHeader";
import ChatHistory from "./ChatHistory";
import PropTypes from 'prop-types';

// the props `chatHistory` is a list of `chatThread` objects (each with keys `id` and `title`).
function Sidebar({ chatHistory, renameThread }) {
    return (
        <div
            className="flex flex-col h-full w-1/4 bg-white border-r overflow-y-auto"
        >
            <SidebarHeader />
            <ChatHistory
                chatHistory={chatHistory}
                renameThread={renameThread}
            />
        </div>
    )
}

Sidebar.propTypes = {
    chatHistory: PropTypes.array,
    renameThread: PropTypes.func,
}

export default Sidebar