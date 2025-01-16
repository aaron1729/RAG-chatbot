import PropTypes from 'prop-types';
// import { Menu, MenuItems, MenuItem } from '@headlessui/react';
import ReactDOM from 'react-dom';



// add more props later, as appropriate. maybe a function `onClose`? or not needed?
// options: rename, delete, RAG (or re-RAG)
function ChatThreadMenu({ isOpen, position }) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="absolute bg-white border border-gray-300 shadow-lg p-2 rounded top-0 right-0"
            style={{
                top: position.top,
                left: position.left,
                zIndex: 1 // so that this "stacks" on top of other things
            }}
        >
            <ul className="text-sm">
                <li className="p-2 hover:bg-gray-100 cursor-pointer">
                    option 1
                </li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer">
                    option 2
                </li>
            </ul>
        </div>,
        document.body
    )
    
}

ChatThreadMenu.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    position: PropTypes.object
}

export default ChatThreadMenu