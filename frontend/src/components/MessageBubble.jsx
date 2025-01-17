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
            <div className={`relative max-w-[80%] p-4 rounded-2xl ${
                role === "user"
                    ? "bg-blue-500 text-gray-200 rounded-br-none after:absolute after:bottom-0 after:right-[-8px] after:border-[4px] after:border-solid after:border-transparent after:border-l-blue-500 after:border-b-blue-500"
                    : "bg-gray-100 text-gray-900 rounded-bl-none after:absolute after:bottom-0 after:left-[-8px] after:border-[4px] after:border-solid after:border-transparent after:border-r-gray-100 after:border-b-gray-100"
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