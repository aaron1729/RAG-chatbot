// import React from 'react';
import PropTypes from 'prop-types';

function TextInput({ input, setInput, handleSubmit, isLoading }) {
    return (
        <form onSubmit={handleSubmit} className="border-t p-4">
            <textarea
                id="text-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if ((e.key) === "Enter") {
                        if (e.shiftKey) {
                            e.preventDefault(); // prevent form submission
                            setInput(input + "\n")
                        } else {
                            handleSubmit(e)
                        }
                    }
                }}
                placeholder="Compose a message for Ragnar..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
            />
        </form>
    )
}

TextInput.propTypes = {
    input: PropTypes.string,
    setInput: PropTypes.func,
    handleSubmit: PropTypes.func,
    isLoading: PropTypes.bool,
}

export default TextInput