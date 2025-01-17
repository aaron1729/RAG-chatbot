import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MoreVertical } from 'lucide-react';
import ChatThreadMenu from './ChatThreadMenu';
import { getChatThread } from '../services/requests';

// the prop `chatThread` is an object with keys `id` and `title`.
function ChatThread({ chatThread, index, chatThreadMenuPosition, setChatThreadMenuPosition, isAnyDropdownOpen, setIsAnyDropdownOpen, renameThread, currentThreadId, setCurrentThreadId, setMessages }) {
    
    // the state `isDropdownOpen` tracks whether the `ChatThreadMenu` component is rendering. but note that it's hidden when additionally the modal is open.
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showOptionsButton, setShowOptionsButton] = useState(false);
    const buttonRef = useRef(null);

    useEffect(() => {
        // this indeed computes the `&&` of all instances of `isDropdownOpen`, because only at most one of them will ever be set to `true`.
        console.log(`isDropdownOpen at index ${index} is now ${isDropdownOpen}`);
        setIsAnyDropdownOpen(isDropdownOpen);
    }, [isDropdownOpen, setIsAnyDropdownOpen])

    // show the "options" button when either:
        // the user is hovering over this component AND no dropdown is open; OR
        // this dropdown is open.
    useEffect(() => {
        setShowOptionsButton(((isHovered && !isAnyDropdownOpen) || isDropdownOpen))
    }, [isHovered, isDropdownOpen, isAnyDropdownOpen])

    function onOptionsButtonClick () {
        const rect = buttonRef.current.getBoundingClientRect();
        setChatThreadMenuPosition({
            top: rect.bottom,
            left: rect.left
        });
        setIsDropdownOpen(!isDropdownOpen)
    }

    async function onThreadClick (event) {
        if (!buttonRef.current.contains(event.target)) {
            console.log('Thread clicked:', chatThread.id, 'Current thread:', currentThreadId);
            setCurrentThreadId(chatThread.id)
            const newMessages = await getChatThread(chatThread.id)
            setMessages(newMessages)
            console.log('After setting - Thread:', chatThread.id, 'Current thread:', currentThreadId);
        }
    }

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onThreadClick}
            className={`
                ${currentThreadId === chatThread.id ? 'bg-blue-400 text-white hover:bg-blue-500' : 'bg-white hover:bg-gray-100'}
                py-0.5 px-0.5 mx-2 rounded-lg
                transition-colors duration-50
            `}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span 
                    className="ml-2.5 whitespace-nowrap overflow-hidden truncate flex-1 text-left"
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
                        renameThread={renameThread}
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
    renameThread: PropTypes.func,
    currentThreadId: PropTypes.number,
    setCurrentThreadId: PropTypes.func,
    setMessages: PropTypes.func,
}

export default ChatThread