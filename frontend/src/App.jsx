import { useState, useEffect } from 'react';
import './App.css';
// import MessageBubble from './components/MessageBubble.jsx'
import Sidebar from './components/Sidebar.jsx';
import MessageWindow from './components/MessageWindow.jsx';
import TextInput from './components/TextInput.jsx';
import { sendMessage, getChatHistory, getUserInfo, indexChats } from './services/requests.js';



// for now this is hard-coded. this occurs here and in `backend/database/init.js`.
// whenever actually handling it, be sure to handle the logic for adding a new user, and of course ensure that getUserInfo here never returns an empty value.
const TEMP_USER_ID = 6


function App() {

  const initialMessage = {role: "assistant", content: "Hello there! How can I help you today?"}
  
  // messages for the current thread
  const [messages, setMessages] = useState([initialMessage]);
  
  // useEffect(() => {
  //   // for debugging
  //   console.log(`messages.length is ${messages.length}`)
  // }, [messages])

  const [userId, setUserId] = useState(TEMP_USER_ID)
  
  // text input
  const [input, setInput] = useState("");

  // useEffect(() => {
  //   // for debugging -- but to keep it clean, only do this when it's reset to the empty string.
  //   if (!input) {
  //     console.log(`\`input\` is now: ${input}`)
  //   }
  // }, [input])

  // a boolean, depending on the user; this is set in a useEffect with empty dependency array after component is mounted.
  const [hasRagIndex, setHasRagIndex] = useState(null);

  // useEffect(() => {
  //   // for debugging
  //   console.log(`hasRagIndex is now: ${hasRagIndex}`)
  // }, [hasRagIndex])
  
  // a boolean that the user can toggle (once they have a rag index).
  const [ragChat, setRagChat] = useState(false);

  useEffect(() => {
    // for debugging
    console.log(`ragChat is now ${ragChat}`)
  }, [ragChat])
  
  // whether we're currently getting a chat response
  const [isLoading, setIsLoading] = useState(false);
  
  // once we're no longer loading a response, focus back on the `'text-input'` element.
  useEffect(() => {
    // // for debugging
    // console.log(`\`isLoading\` is now: ${isLoading}`)

    if (!isLoading) {
      document.getElementById('text-input').focus();
    }
  }, [isLoading])
  
  // current thread id
  // this begins as `null`. it always gets sent to the server with the messages, and if it's null then the server responds with a new value for it, which we then set.
  // additionally, this can be changed from a non-null value to another one when the user clicks on a thread in the sidebar, and then we change everything!
  const [currentThreadId, setCurrentThreadId] = useState(null);

  useEffect(() => {
    // // for debugging
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
  
  // a list of objects representing past chat threads (with keys `id` and `title` and `ragStatus`), from most to least recent.
  // this begins as `null`. via `useEffect`, as soon as the app is loaded we send a request to the server to get the chat history and then reset it.
  const [chatHistory, setChatHistory] = useState([])

  // this will run as soon as the component mounts.
  useEffect(() => {
    // for silly reasons, one must _define_ an async function _inside_ of the `useEffect` callback (so that's what's done here).
    
    async function getChatHistoryHere() {
      try {
        const chatHistory = await getChatHistory(userId)
        setChatHistory(chatHistory.reverse())
      } catch (e) {
        console.error("error getting chat history:", e)
      }
    }
    
    getChatHistoryHere();
    
    async function getUserInfoHere() {
      try {
        const userInfo = await getUserInfo(userId)
        // console.log(`inside of App, got userInfo and it is: ${JSON.stringify(userInfo)}`)

        // userInfo.hasRagIndex comes back as 0 or 1, but be explicit about the boolean here.
        if (userInfo.hasRagIndex) {
          setHasRagIndex(true)
        } else {
          setHasRagIndex(false)
        }
      } catch (e) {
        console.error("error getting user info:", e)
      }
    }
    
    getUserInfoHere();
  }, [])

  function renameOrRemoveThread(threadId, title) {
    if (title) {
      console.log("renaming thread")
      const newChatHistory = chatHistory.map(chatThread => {
        if (chatThread.id === threadId) {
          const ragStatus = (chatThread.ragStatus === "UP_TO_DATE") ? "NEEDS_UPDATE" : "NEVER_INDEXED"
          return {id: chatThread.id, title: title, ragStatus: ragStatus}
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
    e.preventDefault(); // to stop the browser from reloading the whole page
    if (!input.trim()) return
    const newMessages = [...messages, {role: "user", content: input}]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true);
    try {
      const data = await sendMessage(userId, currentThreadId, ragChat, newMessages)
      if (!currentThreadId) {
        console.log(`changing currentThreadId from ${currentThreadId} to ${data.threadId}`)
        setCurrentThreadId(data.threadId)
        const newChatHistory = [{id: data.threadId, title: "new thread (rename me!)", ragStatus: "NEVER_INDEXED"}, ...chatHistory]
        setChatHistory(newChatHistory)
      } else {
      const newChatHistory = chatHistory.map(chatThread => {
        if (chatThread.id === currentThreadId) {
          return {...chatThread, ragStatus: "NEEDS_UPDATE"};
        } else {
          return chatThread;
        }
      });
      setChatHistory(newChatHistory);
      }
      const responseText = data.content
      setMessages([...newMessages, {role: "assistant", content: responseText}])
    } catch (error) {
      console.log("error:", error)
    } finally {
      setIsLoading(false);
    }
  }

  async function handleIndexChatsSubmit (e) {
    console.log("inside of handleIndexChatsSubmit")
    e.preventDefault(); // to stop the browser from reloading the whole page
    try {
      const data = await indexChats(userId);
      console.log(`inside of handleIndexChatsSubmit, data is: ${data}`);
      const newChatHistory = chatHistory.map(chatThread => ({
          ...chatThread,
          ragStatus: "UP_TO_DATE"
      }));
      setChatHistory(newChatHistory);
      setHasRagIndex(true);
    } catch (error) {
      console.log("error:", error)
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
        startNewChat={startNewChat}
        hasRagIndex={hasRagIndex}
        handleIndexChatsSubmit={handleIndexChatsSubmit}
        ragChat={ragChat}
        setRagChat={setRagChat}
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