// this is an optional runtime type-checking tool for react. my linter is complaining without it, though.
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";

function MessageBubble({ role, content }) {
    const sanitizedContent = DOMPurify.sanitize(content);
    const lines = sanitizedContent.split("\n")
    const extendedLines = lines.map(line => {
        if (!line.trim()) {
            line += "&nbsp;";
        }
        return line + "  "
    })
    const displayContent = extendedLines.join("\n")
    return (
        <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-2 rounded-lg ${
                role === "user"
                    ? "bg-blue-500 text-gray-200 rounded"
                    : "bg-gray-100 text-gray-900 rounded"
            }`}>
                <ReactMarkdown>{displayContent}</ReactMarkdown>
            </div>
        </div>
    )
}

MessageBubble.propTypes = {
    // index: PropTypes.number,
    role: PropTypes.string,
    content: PropTypes.string,
}

export default MessageBubble