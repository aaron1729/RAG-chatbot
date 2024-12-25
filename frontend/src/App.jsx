import { useState } from 'react';
import './App.css';
// import MessageBubble from './components/MessageBubble.jsx'
import ChatHistory from './components/ChatHistory.jsx';
import MessageWindow from './components/MessageWindow.jsx';
import TextInput from './components/TextInput.jsx';
import { sendMessage } from './services/anthropic.js';

function App() {
  const [messages, setMessages] = useState([
    {role: "assistant", content: "Hello there! How can I help you today?"}
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault() // to stop the browser from reloading the whole page
    if (!input) return
    const newMessages = [...messages, {role: "user", content: input}]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true);
    try {
      const responseText = await sendMessage(newMessages)
      setMessages([...newMessages, {role: "assistant", content: responseText}])
    } catch (error) {
      console.log("error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <ChatHistory />
      <div className="flex flex-col flex-1">
        <MessageWindow messages={messages} />
        <TextInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
      
    </div>
  )
}

export default App






/*
COMMENTS & REMINDERS


the `handleSubmit` function is an event handler; it'll be the `onSubmit` property for the form.
so as an argument it will take in the event, namely form submission.
it's nice to have the text input as a form submission, for a few reasons: the enter key automatically submits, and mobile keyboards' "go" buttons do too.

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