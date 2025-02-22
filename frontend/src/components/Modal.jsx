import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { sendNewThreadName, deleteChatThread } from '../services/requests';

function Modal({ setIsOpen, type, params }) {
    
    // console.log("modal component fired")

    const [modalInput, setModalInput] = useState("")

    const handleInputChange = (event) => {
        if (event.target.id === "modal-input") {
            setModalInput(event.target.value);
            // console.log("modal input changed");
        }
    }
    
    // this runs once the component has mounted (due to the empty dependency array).
    useEffect(() => {

        // set the modalInput here, as appropriate.
        if (type === "rename-thread") {
            document.getElementById('modal-input').value = params.threadTitle;
            // set the state here too; the listener is only for keystrokes.
            setModalInput(params.threadTitle);
        }
        
        if (modalProperties.hasTextInput) {
            document.getElementById('modal-input').select();
        }
        
        // add event listener for input changes
        window.addEventListener('input', handleInputChange);
        // cleanup function to remove event listener
        return () => {
            window.removeEventListener('input', handleInputChange);
        };
    }, []);

    const handleModalSubmissionAttempt = (e) => {
        e.stopPropagation();
        if ((!modalProperties.hasTextInput) || (modalProperties.hasTextInput && modalInput.trim())) {
            modalProperties.handleSubmit(e);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            console.log("'Esc' key pressed when modal open");
            params.setShowOptionsButton(false);
            params.setIsDropdownOpen(false);
            setIsOpen(false);
        }
        // else if (event.key === "Enter") {
            // event.preventDefault(); // to prevent any bubbling-up behavior.
            // handleModalSubmissionAttempt(event);
        // }
    };
    window.addEventListener('keydown', handleKeyDown);

    // set this, based on the type of the modal. here, just keep track of all the possible properties.
    const modalProperties = {
        title: null,
        hasTextInput: null,
        placeholderText: null,
        submitButtonName: null,
        handleSubmit: null,
    }

    if (type === "rename-thread") {
        modalProperties.title = "rename thread";
        modalProperties.hasTextInput = true;
        modalProperties.placeholderText = "new thread name";
        modalProperties.submitButtonName = "apply";
        modalProperties.handleSubmit = async (e) => {
            console.log("handleSubmit for 'rename-thread' modal");
            try {    
                e.stopPropagation();
                const newThreadName = document.getElementById('modal-input').value;
                await sendNewThreadName(params.threadId, newThreadName);
                params.renameOrRemoveThread(params.threadId, newThreadName);
                setIsOpen(false);
                params.setShowOptionsButton(false);
                params.setIsDropdownOpen(false);
            } catch (error) {
                console.error("error in the renaming process:", error)
            }
        }
    }

    if (type === "delete-thread") {
        modalProperties.title = "really delete thread?";
        modalProperties.hasTextInput = false;
        modalProperties.submitButtonName = "delete";
        modalProperties.handleSubmit = async (e) => {
            console.log("handleSubmit for 'delete-thread modal");
            e.stopPropagation();
            try {
                // Close everything first to prevent any click events
                setIsOpen(false);
                params.setShowOptionsButton(false);
                params.setIsDropdownOpen(false);
                
                // Then do the deletion
                await deleteChatThread(params.threadId);
                params.renameOrRemoveThread(params.threadId);
            } catch (error) {
                console.error("Error in delete process:", error);
            }
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2
                    className="text-lg font-semibold"
                >
                    {modalProperties.title}
                </h2>
                {/* only include an input box if this boolean is `true` */}
                {modalProperties.hasTextInput && <input
                    id="modal-input"
                    type="text"
                    placeholder={modalProperties.placeholderText}
                    className="mt-4 border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                    autoFocus
                />}
            <div className="mt-4 flex justify-end space-x-4">
                {/* CANCEL button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        params.setIsDropdownOpen(false);
                        setIsOpen(false);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded text-gray-600"
                >
                    cancel
                </button>
                {/* SUBMIT button */}
                <button
                    onClick={handleModalSubmissionAttempt}
                    className={`px-4 py-2 ${modalProperties.hasTextInput && !modalInput.trim() ? 'bg-blue-200' : 'bg-blue-500'} rounded text-white`}
                >
                    {modalProperties.submitButtonName}
                </button>
            </div>
            </div>
        </div>
    );
}

Modal.propTypes = {
    setIsOpen: PropTypes.func,
    type: PropTypes.string,
    params: PropTypes.object,
};

export default Modal;