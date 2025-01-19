a silly little chatbot that uses RAG to reference previous chat threads.

built using react + vite with a sqlite database, and llama index for RAG.

react+vite app on port 5173 (vite's default).

node server on port 3000.

python fastAPI server on port 8000.

this uses a `.env` file in the root, with _no_ sensitive content (so it's present in the repo). it also uses a `backend/.env` file, which should look like:

```
# SENSITIVE
VITE_ANTHROPIC_API_KEY=[enter yours here, if needed]
OPENAI_API_KEY=[enter yours here, if needed]

# NOT SENSITIVE
PORT=3000
PYTHON_SERVER_PORT=8000
SYSTEM_PROMPT="Your name is Ragnar the RAGbot. You love to use RAG (retrieval-augmented generation) to refer to past chats!"
```

of course, install the various packages and dependencies.

for the python server, create a virtual environment by going to `backend/` and doing `python -m venv python_venv`; then, activate it using `source python_venv/bin/activate`. deactivate using `deactivate`.

run `backend/database/init.js` to initialize the sqlite database. use one-time-operations.js for one-off database operations.

---

**to do (in order)**

- [x] turn ChatHistory into Sidebar, with header and a chathistory components.
- [x] save chats (and user ids) to a database
- [x] display chat history.
- [x] in a new chat, once the current chat is created, highlight it. but also, highlight other older chats when we jump back to those.
- [x] add a "new chat" button to the header.
- [x] allow user to change the title of the thread using the `updateThread` function.
- [x] reroute chat functionality through llama server.
- [x] allow rag and re-rag of threads.
  - [x] do this on the server side.
  - [x] enable the user to do this, i.e.:
    - [x] track which threads are unragged or have been updated since last getting ragged.
    - [x] update the index.
    - [x] toggle "RAG chat" on and off.
    - [x] chat with chats!
- [ ] enable streaming responses.
- [ ] host on a server!
- [ ] add functionality for multiple users

---

**stretch goals**

- [ ] bound the length of a new thread title. (maybe allow a longer description, separately?)
- [ ] keep track of the input in other previous threads, so that when the user returns to it it's still there.
- [ ] add oauth login, perhaps with a cookie to persist between sessions.
- [ ] allow uploading docs and adding them to the index.
- [ ] add a scheduler to delete data if it's associated to a past chat -- or a sufficiently old chat, or if there's too much data.
- [ ] add a button in sidebar to close it. and when it's closed, keep a button in the top-left to open it. this should override the disappearance coming from shrinking the window to be too narrow.
