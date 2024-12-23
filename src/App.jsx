import { useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    {role: "assistant", content: "Hi there! How can I help you today?"}
  ])
  const [input, setInput] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages([...messages, {role: "human", content: input}])
    setInput("")
  }

  return (
    // the following is a react "fragment", which allows to group multiple elements together without adding an extra div. this is because react components must return a single parent element.
    <>
      {/* this is the chat messages container */}
      {/* here and elsewhere, the className is actually tailwind code. this is reasonable because usually class names in HTML (or JSX) are for CSS styling, but tailwind obviates the need for that. */}
      <div>hello!</div>
      <div>there!</div>
    </>
  )
}

export default App
