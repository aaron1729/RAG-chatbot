# add project root directory to python path when running directly. this is just for debugging.
import sys
from pathlib import Path
if __name__ == "__main__":
    sys.path.append(str(Path(__file__).parent.parent.parent))

##########

from llama_index.core import Document, VectorStoreIndex, StorageContext, load_index_from_storage

from datetime import datetime

from backend.database.operations import get_threads, get_messages, get_thread_info, get_all_messages, get_all_threads

def get_persist_dir(user_id):
    return str(Path(__file__).parent / str(user_id))

def index_chats(user_id):
    messages = get_all_messages(user_id)
    threads = get_all_threads(user_id)
    if not threads:
        return
    # this is a dict: keys are thread ids, values are dicts with keys "title" and "messages".
    threads_dict = {thread["id"]: {"title": thread["title"], "thread_timestamp": thread["timestamp"], "messages": []} for thread in threads}
    # this is faster than filtering above, iterating through the whole `messages` list just once.
    for message in messages:
        threads_dict[message["thread_id"]]["messages"].append(message)
    document_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    def thread_dict_to_document(thread_id, thread_dict):
        def message_to_string(message):
            return f"{message["role"]} ({message["timestamp"]}:\n{message["content"]})"
        text = f"title:\n{thread_dict["title"]}\n\n" + "\n\n".join([message_to_string(message) for message in thread_dict["messages"]])
        return Document(
            text=text,
            id_=str(thread_id),
            extra_info={
                # this is valuable, since LLMs can't count!
                "message_count": len(thread_dict["messages"]),
                "title": thread_dict["title"],
                "user_id": user_id,
                "thread_timestamp": thread_dict["thread_timestamp"],
                "document_timestamp": document_timestamp,
                "last_message_timestamp": thread_dict["messages"][-1]["timestamp"]
            },
        )
    documents = [thread_dict_to_document(thread_id, thread_dict) for thread_id, thread_dict in threads_dict.items()]
    index = VectorStoreIndex.from_documents(documents)
    print(f"made an index where {user_id = }")
    index.storage_context.persist(persist_dir=get_persist_dir(user_id))
    return index

def load_index(user_id):
    return load_index_from_storage(StorageContext.from_defaults(persist_dir=get_persist_dir(user_id)))

######################################################

# stuff below here may not be needed...



def thread_to_document(thread_id):
    messages = get_messages(thread_id)
    thread_info = get_thread_info(thread_id)    
    def message_to_string(message):
        return f"{message["role"]} ({message["timestamp"]}:\n{message["content"]})"
    text = f"title:\n{thread_info["title"]}\n\n" + "\n\n".join([message_to_string(message) for message in messages])
    document_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    last_message_timestamp = messages[-1]["timestamp"]
    return Document(
        text=text,
        # keep `id_` persistent for each thread. that way, we can use the `index.refresh` method from llama index.
        id_=str(thread_id),
        extra_info={
            # "thread_id": thread_id, # this is no longer needed, since it's recorded above (as `id_`, and for some reason therefor also as `doc_id`).
            # the `message_count` is valuable, since LLMs don't know how to count!
            "message_count": len(messages),
            "title": thread_info["title"],
            "user_id": thread_info["user_id"],
            "thread_timestamp": thread_info["timestamp"],
            "document_timestamp": document_timestamp,
            "last_message_timestamp": last_message_timestamp,
        }
    )




### TO TEST:
# my_doc = thread_to_document(92)
# print(my_doc.doc_id, "\n", my_doc.id_)
# exit(0)



def create_thread_index(user_id):
    threads = get_threads(user_id)
    if not threads:
        return
    documents = [thread_to_document(thread["id"]) for thread in threads]
    index = VectorStoreIndex.from_documents(documents)
    index.storage_context.persist(persist_dir=f"./{user_id}")
    return index


### TO TEST:
# around 1.4s for user_id 5, which has a ~40 short chats
# around 1.1s for user_id 4, which has ~10 short chats.
# around 0.25s for user_id 11, which has no chats.
# import time
# start_time = time.time()
# create_thread_index(11)
# print("time taken:", time.time() - start_time)




### BEWARE: this should probably delete documents, and probably doesn't currently. maybe just ALWAYS make a new index, it's not worth it to mess with this...
def refresh_thread_index(user_id):
    print("refreshing...")
    threads = get_threads(user_id)
    if not threads:
        return
    documents = [thread_to_document(thread["id"]) for thread in threads]
    storage_context = StorageContext.from_defaults(persist_dir=f"./{user_id}")
    index = load_index_from_storage(storage_context)
    # this is a list of booleans indicating which input documents were refreshed.
    refreshed_list = index.refresh(documents)
    true_indices = [index for index, boolean in enumerate(refreshed_list) if boolean]
    print("indices of refreshed documents:", true_indices)
    true_count = refreshed_list.count(True)
    print(f"refreshed {len(true_indices)} of {len(refreshed_list)} documents")
    print(f"the new index has {len(index.docstore.docs)} documents")
    if true_count:
        index.storage_context.persist(persist_dir=f"./{user_id}")
    return index





# ### TO TEST:
# import time
# start_time = time.time()
# refresh_thread_index(4)
# print("time taken:", time.time() - start_time)
