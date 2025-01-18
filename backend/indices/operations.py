# add project root directory to python path when running directly. this is just for debugging.
import sys
from pathlib import Path
if __name__ == "__main__":
    sys.path.append(str(Path(__file__).parent.parent.parent))



from llama_index.core import VectorStoreIndex
from llama_index.core import Document
from backend.database.operations import get_threads, get_messages, get_thread_info

def thread_to_document(thread_id):
    messages = get_messages(thread_id)
    thread_info = get_thread_info(thread_id)
    
    def message_to_string(message):
        return f"{message["role"]} ({message["timestamp"]}:\n{message["content"]})"
    
    text = "\n\n".join([message_to_string(message) for message in messages])
    
    return Document(
        text=text,
        extra_info={
            "thread_id": thread_id,
            "message_count": len(messages),
            "title": thread_info["title"],
            "user_id": thread_info["user_id"],
            "timestamp": thread_info["timestamp"],
        }
    )

my_doc = thread_to_document(85)

print(my_doc.text)




# AI-GENERATED: function to create an index from multiple threads
def create_thread_index(user_id):
    """Create a VectorStoreIndex from all threads for a user"""
    threads = get_threads(user_id)
    documents = [thread_to_document(thread["id"]) for thread in threads]
    return VectorStoreIndex.from_documents(documents)

if __name__ == "__main__":
    # AI-GENERATED: test code that only runs when script is run directly
    test_doc = thread_to_document(100)
    print(test_doc.extra_info)