import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { MoreVertical } from 'lucide-react';
import ChatThreadMenu from './ChatThreadMenu';

// the props `chatThread` is an object with keys `id` and `title`.
function ChatThread({ chatThread, chatThreadMenuPosition, setChatThreadMenuPosition }) {
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const buttonRef = useRef(null);

    function onClick () {
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
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ marginLeft: '10px' }} onClick={() => {}}>{chatThread.title}</span>
                <MoreVertical style={{ marginRight: '5px' }} ref={buttonRef} onClick={onClick} />
                <ChatThreadMenu isOpen={isDropdownOpen} position={chatThreadMenuPosition} />
            </div>
        </div>
    )
}

ChatThread.propTypes = {
    chatThread: PropTypes.object,
    chatThreadMenuPosition: PropTypes.object,
    setChatThreadMenuPosition: PropTypes.func,
}

export default ChatThread