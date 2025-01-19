import { PlusCircleIcon, PackageSearch, Boxes } from 'lucide-react';
import SlidingToggle from "./SlidingToggle";

function SidebarHeader({ startNewChat, currentThreadId, hasRagIndex, handleIndexChatsSubmit, allRagStatusesUpToDate, ragChat, setRagChat }) {
    return (
        <div className="flex flex-col justify-center items-center gap-2 pt-1">
            <div className="flex flex-wrap gap-2 justify-center">
                <div
                // the existence of a non-null `currentThreadId` is equivalent to the possibility of starting a new chat. (`currentThreadId` is null only when the chat hasn't started.)
                className={`rounded px-2 py-0.5 flex items-center border-2 ${currentThreadId ? 'hover:bg-green-500 border-green-500' : 'text-gray-300 border-white'} whitespace-nowrap`}
                onClick={() => {
                    if (currentThreadId) {
                        startNewChat();
                    }
                }}
                >
                    <PlusCircleIcon
                        className={`h-4 w-4 ${currentThreadId ? '' : 'text-gray-300'}`}
                    />
                    <span>&nbsp;new chat!</span>
                </div>
                <div
                    className={`rounded px-2 py-0.5 flex items-center border-2 ${allRagStatusesUpToDate ? 'text-gray-300 border-white' : 'hover:bg-orange-400 border-orange-400'} whitespace-nowrap`}
                    onClick={!allRagStatusesUpToDate ? handleIndexChatsSubmit : null}
                >
                    <Boxes className="h-4 w-4" />
                    <span>&nbsp;index chats!</span>
                </div>
            </div>
            <div className="flex justify-center">
                <div
                className={`rounded px-2 py-0.5 flex items-center border-2 ${hasRagIndex ? 'hover:bg-fuchsia-400 border-fuchsia-400' : 'text-gray-300 border-white'} whitespace-nowrap`}
                onClick={() => {
                    setRagChat(!ragChat);
                }}
                >
                    <PackageSearch
                        className={`h-4 w-4 ${hasRagIndex ? '' : 'text-gray-300'}`}
                    />
                    <span>&nbsp;chat with chats!&nbsp;</span>
                    <SlidingToggle
                        isOn={ragChat}
                    />
                </div>
            </div>
        </div>
    )
}

export default SidebarHeader