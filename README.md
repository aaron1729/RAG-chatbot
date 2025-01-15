built using react + vite.

---

**to do (in order?)**
- turn ChatHistory into Sidebar or something, and add buttons at the top for "new chat" and "upload docs".
- allow uploading docs, maybe with a pop-up modal.
- if saving these on the server (instead of e.g. an S3 bucket), maybe add a listener to delete the data if it's associated to a past chat.

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
