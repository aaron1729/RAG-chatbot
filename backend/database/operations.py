import sqlite3

# get the filepath of the current file
from pathlib import Path
current_dir = Path(__file__).parent
db_connection = sqlite3.connect(current_dir / "chats.db")
db_cursor = db_connection.cursor()

### maybe make these async when calling from `llama_server.py`.

def get_threads(user_id):
    db_cursor.execute("SELECT id, title, timestamp FROM threads WHERE user_id = ?", (user_id,))
    # this returns a list of tuples
    threads = db_cursor.fetchall()
    return [{"id": thread[0], "title": thread[1], "timestamp": thread[2]} for thread in threads]

def get_messages(thread_id):
    db_cursor.execute("SELECT role, content, timestamp FROM messages WHERE thread_id = ?", (thread_id,))
    messages = db_cursor.fetchall()
    print(f"{len(messages) = }")
    if len(messages):
        print(f"{messages[-1] = }")
    return [{"role": message[0], "content": message[1], "timestamp": message[2]} for message in messages]

def get_thread_info(thread_id):
    db_cursor.execute("SELECT title, user_id, timestamp FROM threads WHERE id = ?", (thread_id,))
    thread_info = db_cursor.fetchone()
    if thread_info:
        return {"title": thread_info[0], "user_id": thread_info[1], "timestamp": thread_info[2]}
    else:
        return None

# print(get_threads(4))

print(get_messages(100))