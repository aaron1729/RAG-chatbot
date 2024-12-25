import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';
import PropTypes from 'prop-types';

function MessageWindow({ messages }) {
    
    // add a ref; then, whenever the messages change, scroll to the bottom of the messages window.
    const messageWindowRef = useRef(null)
    useEffect(() => {
        // scrollTop is the number of pixels by which we've scrolled vertically
        // scrollHeight is the total height of the scrollable content, including the non-visible parts
        // so, setting these equal scrolls to the bottom.
        messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight
    }, [messages])

    return (
        <div
            ref={messageWindowRef}
            className="flex-1 overflow-y-auto p-6"
        >
            <div className="space-y-3">
                {messages.map((message, index) => (
                    // the key should eventualy be a more unique id, e.g. messages could be id'd by timestamp and user-id
                    <MessageBubble
                        key={index}
                        role={message.role}
                        content={message.content}
                    />
                ))}
            </div>
        </div>
    )
}

MessageWindow.propTypes = {
    messages: PropTypes.object.isRequired
}

export default MessageWindow