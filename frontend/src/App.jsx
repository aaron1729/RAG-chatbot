import { useState, useEffect } from 'react';
import './App.css';
// import MessageBubble from './components/MessageBubble.jsx'
import Sidebar from './components/Sidebar.jsx';
import MessageWindow from './components/MessageWindow.jsx';
import TextInput from './components/TextInput.jsx';
import { sendMessage, getChatHistory } from './services/requests.js';

function App() {

  const initialMessage = {role: "assistant", content: "Hello there! How can I help you today?"}
  
  // messages for the current thread
  const [messages, setMessagesOriginal] = useState([initialMessage]);
  
  // Wrap setMessages to track all calls
  const setMessages = (newMessages) => {
    console.log("=== setMessages called ===");
    console.log("Stack trace:", new Error().stack);
    console.log("New messages:", newMessages);
    setMessagesOriginal(newMessages);
  }

  useEffect(() => {
    console.log(`messages.length is ${messages.length}`)
  }, [messages])

  // text input
  const [input, setInput] = useState("");

  useEffect(() => {
    // for debugging -- but to keep it clean, only do this when it's reset to the empty string.
    if (!input) {
      console.log(`\`input\` is now: ${input}`)
    }
  }, [input])

  
  // whether we're currently getting a chat response
  const [isLoading, setIsLoading] = useState(false);
  
  // once we're no longer loading a response, focus back on the `'text-input'` element.
  useEffect(() => {
    // for debugging
    console.log(`\`isLoading\` is now: ${isLoading}`)
    if (!isLoading) {
      document.getElementById('text-input').focus();
    }
  }, [isLoading])
  
  // current thread id
  // this begins as `null`. it always gets sent to the server with the messages, and if it's null then the server responds with a new value for it, which we then set.
  // additionally, this can be changed from a non-null value to another one when the user clicks on a thread in the sidebar, and then we change everything!
  const [currentThreadId, setCurrentThreadId] = useState(null);

  useEffect(() => {
    // for debugging
    console.log(`in its own useEffect, \`currentThreadId\` is now ${currentThreadId}`)
    // if the thread id changes, we should be sure to clear out the chat input. (it's fine to do this even when it changes from `null`, because that occurs just as the first message is coming back.)
    setInput("");
  }, [currentThreadId]);
  
  function startNewChat() {
    console.log("inside of `startNewChat`");
    setCurrentThreadId(null);
    setMessages([initialMessage]);
    setInput("");
  }

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

  function renameOrRemoveThread(threadId, title) {
    if (title) {
      console.log("renaming thread")
      const newChatHistory = chatHistory.map(chatThread => {
        if (chatThread.id === threadId) {
          return {id: chatThread.id, title: title}
        } else {
          return chatThread
        }})
      setChatHistory(newChatHistory);
    } else {
      console.log("removing thread")
      const newChatHistory = chatHistory.filter(chatThread => (chatThread.id !== threadId))
      setChatHistory(newChatHistory);
      
      if (threadId === currentThreadId) {
        startNewChat();
      }
    }
  }

  async function handleTextSubmit (e) {
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
        const newChatHistory = [{id: data.threadId, title: "new thread (rename me!)"}, ...chatHistory]
        setChatHistory(newChatHistory)
      }
      const responseText = data.content
      setMessages([...newMessages, {role: "assistant", content: responseText}])
    } catch (error) {
      console.log("error:", error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar
        chatHistory={chatHistory}
        renameOrRemoveThread={renameOrRemoveThread}
        currentThreadId={currentThreadId}
        setCurrentThreadId={setCurrentThreadId}
        setMessages={setMessages}
      />
      <div className="flex flex-col flex-1">
        <MessageWindow messages={messages} />
        <TextInput
          input={input}
          setInput={setInput}
          handleSubmit={handleTextSubmit}
          isLoading={isLoading}
        />
      </div>
      
    </div>
  )
}

export default App