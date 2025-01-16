import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Pencil, Trash2 } from 'lucide-react';
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
    }, [setIsOpen, buttonRef])
    
    if (!isOpen) return null;

    // calculate the available space below the button. this might get screwed up on a teeny tiny screen, but oh well.
    const availableSpaceBelow = window.innerHeight - position.top;
    // i can just hard-code this and tweak as needed after experimentation.
    const spaceNeededBelow = 140;
    // i can just hard-code this and tweak as needed after experimentation.
    const verticalJump = 115;


    const adjustedTop = availableSpaceBelow < spaceNeededBelow ? position.top - verticalJump : position.top;
    
    
    return ReactDOM.createPortal(
        <div
            ref={menuRef}
            className="absolute bg-white border border-gray-300 shadow-lg p-2 rounded top-0"
            style={{
                top: adjustedTop,
                left: position.left,
                width: 'auto',
                zIndex: 1 // so that this "stacks" on top of other things
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <ul className="text-sm">
                <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {console.log("onClick fired for 'rename thread'")}}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Pencil size={15} /> &nbsp; rename thread
                    </div>
                </li>
                <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {console.log("onClick fired for 'delete thread'")}}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={15} /> &nbsp; delete thread
                    </div>
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