import { PlusCircleIcon } from 'lucide-react';

function SidebarHeader({ startNewChat, currentThreadId }) {
    return (
        <div className="flex items-center">
            <div className="flex items-center justify-center w-full">
                <div className="pt-2">
                    <button
                    className={`rounded p-0.5 flex items-center ${currentThreadId ? 'hover:bg-green-500 cursor-pointer' : 'text-gray-300'}`}
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
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SidebarHeader