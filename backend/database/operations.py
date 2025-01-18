import sqlite3

# get the filepath of the current file
from pathlib import Path
current_dir = Path(__file__).parent
database_filepath = current_dir / "chats.db"

database_connection = sqlite3.connect(database_filepath)
database_cursor = database_connection.cursor()

# maybe make these async when calling from `llama_server.py`.

def get_thread_ids(user_id):
    database_cursor.execute("SELECT id FROM threads WHERE user_id = ?", (user_id,))
    # this returns a list of 1-tuples
    thread_ids = database_cursor.fetchall()
    return [id[0] for id in thread_ids]

def get_messages(thread_id):
    # AI-GENERATED: this function retrieves all messages for a given thread id
    database_cursor.execute("SELECT role, content, timestamp FROM messages WHERE thread_id = ?", (thread_id,))
    messages = database_cursor.fetchall()
    print(f"{len(messages) = }")
    print(f"{messages[-1] = }")
    return [{"role": message[0], "content": message[1], "timestamp": message[2]} for message in messages]  # return a list of dictionaries with role and content



# print(get_thread_ids(4))

print(get_messages(86))