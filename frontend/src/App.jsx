import { useState, useRef, useEffect } from 'react'
import './App.css'
import MessageBubble from './MessageBubble.jsx'
import {sendMessage} from './services/anthropic.js'

function App() {
  const [messages, setMessages] = useState([
    {role: "assistant", content: "Hello there! How can I help you today?"}
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // this function is an event handler; it'll be the `onSubmit` property for the form.
  // so as an argument it will take in the event, namely form submission.
  // it's nice to have the text input as a form submission, for a few reasons: the enter key automatically submits, and mobile keyboards' "go" buttons do too.
  const handleSubmit = async (e) => {
    e.preventDefault() // to stop the browser from reloading the whole page
    if (!input) return
    const newMessages = [...messages, {role: "user", content: input}]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true);
    try {
      const responseText = await sendMessage(messages)
      // setMessages([...messages, {role: "assistant", content: responseText}])
      setMessages([...newMessages, {role: "assistant", content: responseText}])
    } catch (error) {
      console.log("error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // add a ref for the message container.
  const messageWindowRef = useRef(null)

  // whenever the messages change, scroll to the bottom of the message window.
  useEffect(() => {
    if (messageWindowRef.current) {
      // scrollTop is the number of pixels by which we've scrolled vertically
      // scrollHeight is the total height of the scrollable content, including the non-visible parts
      // so, setting these equal scrolls to the bottom.
      messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight
    }
  }, [messages])

  return (
    // main div, the parent element. remember, the function needs to return a _single_ parent element.
      //   the className property is basically like a "class", but that's a reserved word. for vanilla react, this gets used like classes, for CSS styling. but using tailwind, you replace that with a long string that dictates how tailwind operates. e.g. for the outer div, we have:
        // flex-1 = flex: 1 // grow and shrink as needed
        // overflow-auto = add scrollbars iff the content overflows
        // p-6 = padding: 1.5rem // 24 pixels of padding on all sides
        // space-y-4 // vertical spacing between child elements -- each after the first gets a top margin of 1rem (16 pixels)
    <div
      className="flex flex-col h-screen bg-gray-200"
    >
      {/* message window */}
      <div
        ref={messageWindowRef}
        className="flex-1 overflow-y-auto p-6"
      >
        <div
          className="space-y-3"
        >
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              index={index}
              role={message.role}
              content={message.content}
            />
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Compose a message for Claude..."
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />

      </form>
    </div>
  )
}

export default App

/*
COMMENTS & REMINDERS





the messages.map(...) call returns an array of `MessageBubble` instances. react requires for there to be a `key` property (when rendering an array of elements/components), which is _not_ passed as props like other properties. that's why there's also an `index` property.

for the chat box:
  w-full = width is 100% of the parent container
  p-2 = adds padding on all sides // 2 means 0.5rex (so 8px by default)
  border = adds a solid border with default border color
  rounded-lg = makes a border radius with rounded corners; "lg" means medium-large radius
  focus -- applied when element receives focus (e.g. clicking into it)
  focus:outline-none // removes the default browser outline
  focus:ring-2 // adds a focus ring of width 2px
  focus:ring-blue-500 // colors the focus ring a medium blue


*/