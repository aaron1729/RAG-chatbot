import SidebarHeader from "./SidebarHeader";
import ChatHistory from "./ChatHistory";
import PropTypes from 'prop-types';

function Sidebar({ chatHistory }) {
    return (
        <div
            className="flex flex-col h-full w-1/4 bg-white border-r"
        >
            <SidebarHeader />
            <ChatHistory chatHistory={chatHistory} />
        </div>
    )
}

Sidebar.propTypes = {
    chatHistory: PropTypes.array.isRequired
}

export default Sidebar