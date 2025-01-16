import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MoreVertical } from 'lucide-react';
import ChatThreadMenu from './ChatThreadMenu';
import { getChatThread } from '../services/requests';

// the props `chatThread` is an object with keys `id` and `title`.
function ChatThread({ chatThread, index, chatThreadMenuPosition, setChatThreadMenuPosition, isAnyDropdownOpen, setIsAnyDropdownOpen, renameThread, currentThreadId, setCurrentThreadId, setMessages }) {
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showOptionsButton, setShowOptionsButton] = useState(false);
    const buttonRef = useRef(null);

    useEffect(() => {
        // this indeed computes the `&&` of all instances of `isDropdownOpen` because only at most one of them will ever be set to `true`.
        setIsAnyDropdownOpen(isDropdownOpen)
    }, [isDropdownOpen, setIsAnyDropdownOpen])

    // decide when to show the "options" button.
    useEffect(() => {
        setShowOptionsButton(((isHovered && !isAnyDropdownOpen) || isDropdownOpen))
    }, [isHovered, isDropdownOpen, isAnyDropdownOpen])

    function onOptionsButtonClick () {
        console.log("onOptionsButtonClick fired in ChatThread.jsx at index", index)
        const rect = buttonRef.current.getBoundingClientRect(); // this seems to record where the click occurred
        setChatThreadMenuPosition({
            // not sure if these window scroll values are supposed to be included or not...
            top: rect.bottom, // + window.scrollY,
            left: rect.left // + window.scrollX
        });
        console.log("and now, chatThreadMenuPosition is:", chatThreadMenuPosition)
        
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

    // Add this to see when the component re-renders
    console.log('Rendering ChatThread:', chatThread.id, 'Current:', currentThreadId);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onThreadClick}
            className={`
                ${currentThreadId === chatThread.id ? 'bg-blue-400 text-white hover:bg-blue-500' : 'bg-white hover:bg-gray-100'}
                py-0.5 px-2 mx-2 rounded-lg
                transition-colors duration-50
            `}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ marginLeft: '10px' }} onClick={() => {}}>{chatThread.title}</span>
                <MoreVertical
                    style={{
                        marginRight: '5px',
                        opacity: showOptionsButton ? 1 : 0, // control visibility using opacity
                        transition: 'opacity 0.1s' // smooth transition for visibility
                    }}
                    ref={buttonRef}
                    onClick={onOptionsButtonClick}
                />
                <ChatThreadMenu
                    isOpen={isDropdownOpen}
                    setIsOpen={setIsDropdownOpen}
                    position={chatThreadMenuPosition}
                    buttonRef={buttonRef}
                    setShowOptionsButton={setShowOptionsButton}
                    threadId={chatThread.id}
                    renameThread={renameThread}
                />
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