import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import { Menu, MenuItems, MenuItem } from '@headlessui/react';



// add more props later, as appropriate. maybe a function `onClose`? or not needed?
// options: rename, delete, RAG (or re-RAG)
function ChatThreadMenu({ isOpen, setIsOpen, position, buttonRef }) {

    // console.log("inside of ChatThreadMenu, and isOpen is:", isOpen)
    
    // useRef and useEffect must be _always_ called -- not just conditionally. so this stuff must come before the `return null` conditional.
    const menuRef = useRef(null);
    useEffect(() => {
        // technically, this is just handling clicks that are:
            // outside of the current menu;
            // also not on the button that opened this menu.
        // (clicks on that are handled by the outer `onClick` function.)
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousdown", handleClickOutside);
        }
    }, [setIsOpen])
    
    if (!isOpen) return null;
    
    return ReactDOM.createPortal(
        <div
            ref={menuRef}
            className="absolute bg-white border border-gray-300 shadow-lg p-2 rounded top-0"
            style={{
                top: position.top,
                left: position.left,
                width: 'auto',
                zIndex: 1 // so that this "stacks" on top of other things
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <ul className="text-sm">
                <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {console.log("onClick fired for option 1")}}
                >
                    option 1
                </li>
                <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {console.log("onClick fired for option 2")}}
                >
                    option 2
                </li>
            </ul>
        </div>,
        document.body
    )
}

ChatThreadMenu.propTypes = {
    isOpen: PropTypes.bool,
    setIsOpen: PropTypes.func,
    onClose: PropTypes.func,
    position: PropTypes.object,
    buttonRef: PropTypes.object,
}

export default ChatThreadMenu