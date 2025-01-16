import SidebarHeader from "./SidebarHeader";
import ChatHistory from "./ChatHistory";

// add props later
function Sidebar() {
    return (
        <div
            className="flex flex-col h-full w-1/4 bg-white border-r"
        >
            <SidebarHeader />
            <ChatHistory />
        </div>
    )
}

export default Sidebar