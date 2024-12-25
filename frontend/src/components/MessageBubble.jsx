// this is an optional runtime type-checking tool for react. my linter is complaining without it, though.
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";

function MessageBubble({ role, content }) {
    const sanitizedContent = DOMPurify.sanitize(content);
    return (
        <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-4 rounded-lg ${
                role === "user"
                    ? "bg-blue-500 text-gray-200 text-left"
                    : "bg-gray-100 text-gray-900 text-left"
            }`}>
                <ReactMarkdown>{sanitizedContent}</ReactMarkdown>
            </div>
        </div>
    )
}

MessageBubble.propTypes = {
    // index: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
}

export default MessageBubble