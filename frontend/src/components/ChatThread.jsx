import PropTypes from 'prop-types';

function ChatThread( { chatThread }) {
    // const title = chatThread.title
    return (
        <div>
            {/* {"placeholder for title..."} */}
            {chatThread.title}
        </div>
    )
}

ChatThread.propTypes = {
    chatThread: PropTypes.object.isRequired
}

export default ChatThread