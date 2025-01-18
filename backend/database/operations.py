import sqlite3

# get the filepath of the current file
from pathlib import Path
current_dir = Path(__file__).parent
db_connection = sqlite3.connect(current_dir / "chats.db")
db_cursor = db_connection.cursor()

### maybe make these async when calling from `llama_server.py`.
# in general, db.cursor.execute returns a list of tuples.

def get_threads(user_id):
    db_cursor.execute("SELECT id, title, timestamp FROM threads WHERE user_id = ?", (user_id,))
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






# WRITING THESE on saturday jan 18.

def get_all_messages(user_id):
    # get all messages where the thread_id corresponds to a thread whose id has the given user_id.
    db_cursor.execute("SELECT thread_id, role, content, timestamp FROM messages WHERE thread_id IN (SELECT id FROM threads WHERE user_id = ?)", (user_id,))
    messages = db_cursor.fetchall()
    print(f"{len(messages) = }")
    if len(messages):
        print(f"{messages[-1] = }")
    return [{"thread_id": message[0], "role": message[1], "content": message[2], "timestamp": message[3]} for message in messages]

def get_all_threads(user_id):
    db_cursor.execute("SELECT id, title, timestamp, rag_status FROM threads WHERE user_id = ?", (user_id,))
    threads = db_cursor.fetchall()
    return [{"id": thread[0], "title": thread[1], "timestamp": thread[2], "rag_status": thread[3]} for thread in threads]

def update_rag_status_all_threads(user_id, rag_status):
    db_cursor.execute(f"UPDATE threads SET rag_status = '{rag_status}' WHERE user_id = ?", (user_id,))
    db_connection.commit()  # commit the changes to the database
    print(f"updated rag status to 'UP_TO_DATE' for user with id {user_id}")
    return None




# print(get_all_threads(4))

# print(get_threads(4))

# print(get_messages(100))