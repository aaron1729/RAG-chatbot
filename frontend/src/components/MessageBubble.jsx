// this is an optional runtime type-checking tool for react. my linter is complaining without it, though.
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";

function MessageBubble({ role, content }) {
    const sanitizedContent = DOMPurify.sanitize(content);
    console.log(`the sanitizedContent is:\n${sanitizedContent}`)
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
            <div className={`max-w-[80%] p-4 rounded-lg ${
                role === "user"
                    ? "bg-blue-500 text-gray-200 text-left"
                    : "bg-gray-100 text-gray-900 text-left"
            }`}>
                <ReactMarkdown>{displayContent}</ReactMarkdown>
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