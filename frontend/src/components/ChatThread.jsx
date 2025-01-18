import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MoreVertical, PackagePlus, PackageCheck, PackageOpen } from 'lucide-react';
import ChatThreadMenu from './ChatThreadMenu';
import { getChatThread } from '../services/requests';

// the prop `chatThread` is an object with keys `id` and `title` and `ragStatus`.
function ChatThread({ chatThread, index, chatThreadMenuPosition, setChatThreadMenuPosition, isAnyDropdownOpen, setIsAnyDropdownOpen, renameOrRemoveThread, currentThreadId, setCurrentThreadId, setMessages }) {
    
    // the state `isDropdownOpen` tracks whether the `ChatThreadMenu` component is rendering. but note that it's hidden when additionally the modal is open.
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showOptionsButton, setShowOptionsButton] = useState(false);
    const buttonRef = useRef(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // this indeed computes the `&&` of all instances of `isDropdownOpen`, because only at most one of them will ever be set to `true`.
        // console.log(`isDropdownOpen at index ${index} is now ${isDropdownOpen}`);
        setIsAnyDropdownOpen(isDropdownOpen);
    }, [isDropdownOpen, setIsAnyDropdownOpen])

    useEffect(() => {
        setShowOptionsButton(isHovered || isDropdownOpen)
    }, [isHovered, isDropdownOpen])

    function onOptionsButtonClick () {
        const rect = buttonRef.current.getBoundingClientRect();
        setChatThreadMenuPosition({
            top: rect.bottom,
            left: rect.left
        });
        setIsDropdownOpen(!isDropdownOpen)
    }

    async function onThreadClick (event) {
        console.log("thread clicked, though maybe on options button");
        if (!buttonRef.current.contains(event.target)) {
            console.log("thread clicked, not on options button");
            setCurrentThreadId(chatThread.id)
            const newMessages = await getChatThread(chatThread.id)
            setMessages(newMessages)
        }
    }

    function RAGIcon() {
        // pass uniform props to all icons.
        const props = { size: 18 };

        if (chatThread.ragStatus === "NEVER_INDEXED") {
            return (
                <PackagePlus
                    {...props}
                    className={currentThreadId === chatThread.id ? "text-blue-200" : "text-blue-600"}
                    title="never indexed"
                />
            )
        }
        if (chatThread.ragStatus === "UP_TO_DATE") {
            return (
                <PackageCheck
                    {...props}
                    className={currentThreadId === chatThread.id ? "text-green-400" : "text-green-700"}
                    title="up to date"
                />
            );
        }
        if (chatThread.ragStatus === "NEEDS_UPDATE") {
            return (
                <PackageOpen
                    {...props}
                    className={currentThreadId === chatThread.id ? "text-amber-400" : "text-amber-600"}
                    title="needs update"
                />
            );
        }
    }

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setShowTooltip(false);
            }}
            onClick={onThreadClick}
            className={`
                ${currentThreadId === chatThread.id ? 'bg-blue-400 text-white hover:bg-blue-500' : 'bg-white hover:bg-gray-100'}
                py-0.5 px-0.5 mx-2 rounded-lg
                transition-colors duration-50
                relative
            `}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="relative"
                >
                    <RAGIcon />
                    <div className={`absolute left-full ml-2 p-1 border border-gray-300 bg-white shadow-md z-10 rounded transition-opacity duration-200 ${showTooltip ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        TEST
                    </div>
                </span>
                <span
                    className={`ml-2.5 whitespace-nowrap overflow-hidden truncate flex-1 text-left ${chatThread.id !== currentThreadId ? 'cursor-pointer' : ''}`}
                    onClick={() => {}}
                >
                    {chatThread.title}
                </span>
                {/* this is always rendered, but becomes transparent (opacity 0) when `showOptionsButton` is `false`. */}
                <MoreVertical
                    size={18}
                    style={{
                        marginRight: '5px',
                        opacity: showOptionsButton ? 1 : 0,
                        transition: 'opacity 0.1s',
                        padding: '2px',
                        borderRadius: '50%',
                        backgroundColor: currentThreadId === chatThread.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                    }}
                    ref={buttonRef}
                    onClick={onOptionsButtonClick}
                />
                {isDropdownOpen && (
                    <ChatThreadMenu
                        setIsOpen={setIsDropdownOpen}
                        position={chatThreadMenuPosition}
                        buttonRef={buttonRef}
                        setShowOptionsButton={setShowOptionsButton}
                        threadId={chatThread.id}
                        threadTitle={chatThread.title}
                        renameOrRemoveThread={renameOrRemoveThread}
                    />
                )}
            </div>
        </div>
    )
}

ChatThread.propTypes = {
    chatThread: PropTypes.object,
    chatThreadMenuPosition: PropTypes.object,
    setChatThreadMenuPosition: PropTypes.func,
    index: PropTypes.number,
    isAnyDropdownOpen: PropTypes.bool,
    setIsAnyDropdownOpen: PropTypes.func,
    renameOrRemoveThread: PropTypes.func,
    currentThreadId: PropTypes.number,
    setCurrentThreadId: PropTypes.func,
    setMessages: PropTypes.func,
}

export default ChatThread