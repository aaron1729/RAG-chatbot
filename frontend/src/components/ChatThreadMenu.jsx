import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from './Modal.jsx';

// options: rename, delete, RAG (or re-RAG)
function ChatThreadMenu({ isOpen, setIsOpen, position, buttonRef, setShowOptionsButton, threadId, renameThread }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    
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
    
    // if the modal is opened and then closes, turn off the options button.
    useEffect(() => {
        if (!isModalOpen) {
            setShowOptionsButton(false);
            setIsOpen(false);
        }
    }, [isModalOpen]);

    if (!isOpen) return null;

    // calculate the available space below the button. this might get screwed up on a teeny tiny screen, but oh well.
    const availableSpaceBelow = window.innerHeight - position.top;
    // i can just hard-code this and tweak as needed after experimentation.
    const spaceNeededBelow = 140;
    // i can just hard-code this and tweak as needed after experimentation.
    const verticalJump = 115;
    // now, adjust the "top" value as needed.
    const adjustedTop = availableSpaceBelow < spaceNeededBelow ? position.top - verticalJump : position.top;
    
    return ReactDOM.createPortal(
        <>
            <div
                ref={menuRef}
                className="absolute bg-white border border-gray-300 shadow-lg p-2 rounded top-0"
                style={{
                    top: adjustedTop,
                    left: position.left,
                    width: 'auto',
                    zIndex: 1, // so that this "stacks" on top of other things
                }}
                onClick={(e) => e.stopPropagation()}
                >
                <ul className="text-sm">
                    <li
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                            console.log("onClick fired for 'rename thread'");
                            setModalType("rename-thread");
                            setIsModalOpen(true);
                        }}
                        >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Pencil size={15} /> &nbsp; rename thread
                        </div>
                    </li>
                    <li
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                            console.log("onClick fired for 'delete thread'");
                            setModalType("delete-thread");
                            setIsModalOpen(true);
                        }}
                        >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={15} /> &nbsp; delete thread
                        </div>
                    </li>
                </ul>
            </div>
            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                type={modalType}
                params={{
                    threadId,
                    renameThread,
                    setIsDropdownOpen: setIsOpen,
                    setIsHovered: () => setShowOptionsButton(false)
                }}
            />
        </>,
        document.body
    )
}

ChatThreadMenu.propTypes = {
    isOpen: PropTypes.bool,
    setIsOpen: PropTypes.func,
    onClose: PropTypes.func,
    position: PropTypes.object,
    buttonRef: PropTypes.object,
    setShowOptionsButton: PropTypes.func,
    threadId: PropTypes.number,
    renameThread: PropTypes.func,
}

export default ChatThreadMenu