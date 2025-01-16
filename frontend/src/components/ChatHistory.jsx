import { useState } from "react";
import ChatThread from "./ChatThread";
import PropTypes from 'prop-types';

// the `chatHistory` props is a list of ChatThread objects (each with keys `id` and `title).
function ChatHistory({ chatHistory }) {

    // the position of a ChatThreadMenu, should it exist
    const [chatThreadMenuPosition, setChatThreadMenuPosition] = useState({top: null, left: null})

    const margin = "5px"

    return (
        <div style={{ marginTop: margin }}>
            {chatHistory.map((chatThread, index) => {
                return (
                    <div key={index} style={{ marginBottom: margin }}>
                        <ChatThread
                            index={index}
                            chatThread={chatThread}
                            chatThreadMenuPosition={chatThreadMenuPosition}
                            setChatThreadMenuPosition={setChatThreadMenuPosition}
                        />
                    </div>
                )
            })}
        </div>
    )
}

ChatHistory.propTypes = {
    chatHistory: PropTypes.array.isRequired
}

export default ChatHistory