a silly little chatbot for chatting with RAG for previous chat threads.

built using react + vite.

react+vite app on port 5173 (vite's default).

node server on port 3000.

python fastAPI server on port 8000.

---

**to do (in order)**

- [x] turn ChatHistory into Sidebar, with header and a chathistory components.
- [x] save chats (and user ids) to a database
- [x] display chat history.
- [x] in a new chat, once the current chat is created, highlight it. but also, highlight other older chats when we jump back to those.
- [x] add a "new chat" button to the header.
- [x] allow user to change the title of the thread using the `updateThread` function.

- [ ] allow RAG and re-RAG of threads

- [ ] bound the length of a new thread title. (maybe allow a longer description, separately?)
- [ ] keep track of the input in other previous threads, so that when the user returns to it it's still there.
- [ ] allow uploading docs, maybe with a pop-up modal.
- [ ] if saving these on the server (instead of e.g. an S3 bucket), maybe add a listener to delete the data if it's associated to a past chat -- or a sufficiently old chat, or if there's too much data.

---

- oauth login, with a cookie to persist
- make a database, eventually storing:
  - users and userid
  - chat histories (are these each a separate table, or what?)
  - RAG indices (or should this be stored elsewhere?)
- display past chats in the "chat history" window (or "no past chats..." if empty)
- allow reloading and continuation of past chats
- enable creation, saving, and referencing of RAG indices (for previous chats and/or other uploaded docs)
- add a button in sidebar to close it. and when it's closed, keep a button in the top-left to open it. this should override the disappearance coming from shrinking the window to be too narrow.

---

features:

- markdown support
