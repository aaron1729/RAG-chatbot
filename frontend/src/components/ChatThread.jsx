import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MoreVertical } from 'lucide-react';
import ChatThreadMenu from './ChatThreadMenu';

// the props `chatThread` is an object with keys `id` and `title`.
function ChatThread({ chatThread, index, chatThreadMenuPosition, setChatThreadMenuPosition, isAnyDropdownOpen, setIsAnyDropdownOpen, renameThread }) {
    
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

    function onClick () {
        console.log("onClick fired in ChatThread.jsx at index", index)
        const rect = buttonRef.current.getBoundingClientRect(); // this seems to record where the click occurred
        setChatThreadMenuPosition({
            // not sure if these window scroll values are supposed to be included or not...
            top: rect.bottom, // + window.scrollY,
            left: rect.left // + window.scrollX
        });
        console.log("and now, chatThreadMenuPosition is:", chatThreadMenuPosition)
        
        setIsDropdownOpen(!isDropdownOpen)
    }

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
                    onClick={onClick}
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
}

export default ChatThread