import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from './Modal.jsx';

function ChatThreadMenu({ setIsOpen, position, buttonRef, setShowOptionsButton, threadId, renameThread }) {

    console.log(`ChatThreadMenu component fired, with threadId ${threadId}`)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    
    // useRef and useEffect must be _always_ called -- not just conditionally. so this stuff must come before the `return null` conditional.
    const menuRef = useRef(null);
    useEffect(() => {
        // handle clicks outside menu and button to close the menu, but keep open if modal is showing
        const handleClickOutside = (event) => {
            if (menuRef.current && 
                !menuRef.current.contains(event.target) && 
                !buttonRef.current.contains(event.target) && 
                !isModalOpen) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [setIsOpen, buttonRef, isModalOpen])
    
    useEffect(() => {
    }, [isModalOpen]);
    
    useEffect(() => {
        // for debugging
        console.log("isModalOpen:", isModalOpen);
        // 
        if (!isModalOpen) {
            setShowOptionsButton(false);
        }
    }, [isModalOpen]);

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
                // this only gets rendered if `isDropdownOpen` in the above component is `true`. but this should then get _hidden_ if the modal is open.
                className={`absolute bg-white border border-gray-300 shadow-lg p-2 rounded top-0 ${isModalOpen ? 'hidden' : ''}`}
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
                            console.log("'rename thread' option selected");
                            setModalType("rename-thread");
                            setIsModalOpen(true);
                            setIsOpen(false);
                        }}
                        >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Pencil size={15} /> &nbsp; rename thread
                        </div>
                    </li>
                    <li
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                            console.log("'delete thread' option selected");
                            setModalType("delete-thread");
                            setIsModalOpen(true);
                            setIsOpen(false);
                        }}
                        >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={15} /> &nbsp; delete thread
                        </div>
                    </li>
                </ul>
            </div>
            {isModalOpen &&
                <Modal
                    setIsOpen={setIsModalOpen}
                    type={modalType}
                    params={{
                        threadId,
                        renameThread,
                        setIsDropdownOpen: setIsOpen,
                        setIsHovered: () => setShowOptionsButton(false)
                    }}
                />
            }
        </>,
        document.body
    )
}

ChatThreadMenu.propTypes = {
    setIsOpen: PropTypes.func,
    onClose: PropTypes.func,
    position: PropTypes.object,
    buttonRef: PropTypes.object,
    setShowOptionsButton: PropTypes.func,
    threadId: PropTypes.number,
    renameThread: PropTypes.func,
}

export default ChatThreadMenu