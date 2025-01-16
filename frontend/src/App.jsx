import { useState, useEffect } from 'react';
import './App.css';
// import MessageBubble from './components/MessageBubble.jsx'
import Sidebar from './components/Sidebar.jsx';
import MessageWindow from './components/MessageWindow.jsx';
import TextInput from './components/TextInput.jsx';
import { sendMessage, sendNewThreadName, getChatHistory } from './services/requests.js';

function App() {
  const [messages, setMessages] = useState([
    {role: "assistant", content: "Hello there! How can I help you today?"}
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // this begins as `null`. it always gets sent to the server with the message, and if it's null then the server responds with a new value for it.
  const [currentThreadId, setCurrentThreadId] = useState(null);
  // this is currently hard-coded as 5. it needs to exist, just so that we can get the chat history.
  const userId = 5
  
  
  // this begins as `null`. as soon as the app is loaded, we send a request to the server to get the history.
  const [chatHistory, setChatHistory] = useState([])

  // this will run as soon as the component mounts.
  useEffect(() => {
    async function getChatHistoryHere() {
      try {
        const chatHistory = await getChatHistory(userId)
        setChatHistory(chatHistory)
      } catch (e) {
        console.error("error getting chat history:", e)
      }
    }
    getChatHistoryHere()
  }, [])  

  const handleSubmit = async (e) => {
    e.preventDefault() // to stop the browser from reloading the whole page
    if (!input.trim()) return
    const newMessages = [...messages, {role: "user", content: input}]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true);
    try {
      const data = await sendMessage(currentThreadId, newMessages)
      if (!currentThreadId) {
        console.log(`changing currentThreadId from ${currentThreadId} to ${data.threadId}`)
        setCurrentThreadId(data.threadId)
      }
      const responseText = data.content
      setMessages([...newMessages, {role: "assistant", content: responseText}])
    } catch (error) {
      console.log("error:", error)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        document.getElementById('text-input').focus(); // focus after state update
      }, 0);
    }
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar chatHistory={chatHistory} />
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