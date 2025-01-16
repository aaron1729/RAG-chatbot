import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { sendNewThreadName } from '../services/requests';

function Modal({ isOpen, setIsOpen, type, params }) {

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                if (params.setIsDropdownOpen) {
                    params.setIsDropdownOpen(false);
                }
                if (params.setIsHovered) {
                    params.setIsHovered(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [setIsOpen, params]);

    if (!isOpen) return null;

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
        modalProperties.handleSubmit = async () => {
            const newThreadName = document.getElementById('modal-input').value;
            await sendNewThreadName(params.threadId, newThreadName);
            params.renameThread(params.threadId, newThreadName);
            setIsOpen(false);
            if (params.setIsDropdownOpen) {
                params.setIsDropdownOpen(false);
            }
            if (params.setIsHovered) {
                params.setIsHovered(false);
            }
        }
    }

    if (type === "delete-thread") {
        modalProperties.title = "really delete thread?"
        modalProperties.hasTextInput = false;
        modalProperties.submitButtonName = "delete";
        modalProperties.handleSubmit = () => {console.log("handleSubmit for delete-thread modal")}
    }

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'} z-50`}>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2
                    className="text-lg font-semibold"
                >
                    {modalProperties.title}
                </h2>
                {modalProperties.hasTextInput && <input
                    id="modal-input"
                    type="text"
                    placeholder={modalProperties.placeholderText}
                    className="mt-4 border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                    autoFocus
                />}
            <div className="mt-4 flex justify-end space-x-4">
                <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded text-gray-600"
                >
                    cancel
                </button>
                <button
                    onClick={modalProperties.handleSubmit}
                    className="px-4 py-2 bg-blue-500 rounded text-white"
                >
                    {modalProperties.submitButtonName}
                </button>
            </div>
            </div>
        </div>
    );
}

Modal.propTypes = {
    isOpen: PropTypes.bool,
    setIsOpen: PropTypes.func,
    type: PropTypes.string,
    params: PropTypes.object,
};

export default Modal;