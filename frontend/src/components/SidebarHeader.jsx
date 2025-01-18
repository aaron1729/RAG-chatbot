import { PlusCircleIcon, PackageSearch, Boxes } from 'lucide-react';

function SidebarHeader({ startNewChat, currentThreadId, hasRagIndex }) {
    return (
        <div className="flex flex-wrap justify-center items-center gap-2 pt-1">
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
            className={`rounded px-2 py-0.5 flex items-center border-2 ${hasRagIndex ? 'hover:bg-fuchsia-400 border-fuchsia-400' : 'text-gray-300 border-white'} whitespace-nowrap`}
            onClick={() => {
                if (currentThreadId) {
                    // dummy function with a console log for now.
                    console.log("rag chat button clicked");
                }
            }}
            >
                <PackageSearch
                    className={`h-4 w-4 ${currentThreadId ? '' : 'text-gray-300'}`}
                />
                <span>&nbsp;RAG chat!</span>
            </div>
        </div>
    )
}

export default SidebarHeader