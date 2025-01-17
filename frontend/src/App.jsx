import { useState, useEffect } from 'react';
import './App.css';
// import MessageBubble from './components/MessageBubble.jsx'
import Sidebar from './components/Sidebar.jsx';
import MessageWindow from './components/MessageWindow.jsx';
import TextInput from './components/TextInput.jsx';
import { sendMessage, getChatHistory, getChatThread } from './services/requests.js';

function App() {

  // messages for the current thread
  const [messages, setMessages] = useState([
    {role: "assistant", content: "Hello there! How can I help you today?"}
  ]);

  // text input
  const [input, setInput] = useState("");
  
  // whether we're currently getting a chat response
  const [isLoading, setIsLoading] = useState(false);
  
  // current thread id
  // this begins as `null`. it always gets sent to the server with the messages, and if it's null then the server responds with a new value for it, which we then set.
  // additionally, this can be changed from a non-null value to another one when the user clicks on a thread in the sidebar, and then we change everything!
  const [currentThreadId, setCurrentThreadId] = useState(null);
  
  // user id
  // this is currently hard-coded as 5. it needs to exist, since user ids are set up in the database.
  const userId = 5
  
  // a list of objects representing past chat threads (with keys `id` and `title`), from most to least recent
  // this begins as `null`. via `useEffect`, as soon as the app is loaded we send a request to the server to get the chat history and then reset it.
  const [chatHistory, setChatHistory] = useState([])

  // this will run as soon as the component mounts.
  useEffect(() => {
    // for silly reasons, one must _define_ an async function _inside_ of the `useEffect` callback, as is done here.
    async function getChatHistoryHere() {
      try {
        const chatHistory = await getChatHistory(userId)
        setChatHistory(chatHistory.reverse())
      } catch (e) {
        console.error("error getting chat history:", e)
      }
    }
    getChatHistoryHere()
  }, [])

  function renameThread(threadId, title) {
    const newChatHistory = chatHistory.map(chatThread => {
      if (chatThread.id === threadId) {
        return {id: chatThread.id, title: title}
      } else {
        return chatThread
      }})
    setChatHistory(newChatHistory)
  }

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
        const newChatHistory = [{id: data.threadId, title: "[new thread]"}, ...chatHistory]
        setChatHistory(newChatHistory)
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
      <Sidebar
        chatHistory={chatHistory}
        renameThread={renameThread}
        currentThreadId={currentThreadId}
        setCurrentThreadId={setCurrentThreadId}
        setMessages={setMessages}
      />
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