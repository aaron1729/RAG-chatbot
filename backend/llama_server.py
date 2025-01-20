import os
import time

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from dotenv import load_dotenv
# this implicitly loads the openai API key from the `backend/.env` file.
load_dotenv()
# the second argument is the fallback value
NODE_SERVER_PORT = int(os.environ.get("NODE_SERVER_PORT", 3000))
PYTHON_SERVER_PORT = int(os.environ.get("PYTHON_SERVER_PORT", 8000))
SYSTEM_PROMPT = os.environ.get("SYSTEM_PROMPT")

# for the fastapi/uvicorn server
from fastapi import FastAPI, Body, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"http://localhost:{os.environ.get("NODE_SERVER_PORT")}"], # only allow requests from the node server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# for scheduling periodic deletion of data for inactive users
from apscheduler.schedulers.background import BackgroundScheduler
scheduler = BackgroundScheduler()

# operations
from database.operations import update_rag_status_all_threads
from indices.operations import index_chats, load_index

# llama index
from llama_index.llms.openai import OpenAI
from llama_index.core.base.llms.types import ChatMessage
llm = OpenAI(temperature=1, model="gpt-3.5-turbo", max_tokens=256)

##############################

# SERVER STATE

# all times are measured in seconds, so write `N * 60` for `N` minutes.

# keys are user ids, values are dicts with keys "last_active" and "index_as_chat_engine". these get cleaned up periodically.
user_data = {}
INACTIVITY_TIMEOUT = 5 * 60

def remove_inactive_users():
    print("running `remove_inactive_users`")
    if not user_data:
        print("`user_data` is empty, so quitting early")
        return
    current_time = time.time()
    inactive_users = [user_id for user_id, data in user_data.items() if current_time - data["last_active"] > INACTIVITY_TIMEOUT]  # ai-generated: get user ids for inactive users based on last active time
    print(f"removing the inactive users from state: {inactive_users = }")
    for user_id in inactive_users:
        del user_data[user_id]
        print(f"removing inactive user {user_id}")

# run the function every 1 minutes.
scheduler.add_job(remove_inactive_users, trigger="interval", minutes=1)
scheduler.start()

##############################

# ENDPOINT HANDLERS

# this is just for convenience: to test if the server is running, point the browser to `http://localhost:8000` (or `http://0.0.0.0:8000`).
@app.get("/")
async def read_root():
    return {"status": "llama server is running!"}

@app.post("/chat")
async def chat_llama_server(body: dict = Body(...)):
    print("received a post request to the `/chat` endpoint")
    
    messages = body["messages"]
    user_id = body["userId"]
    rag_chat = body["ragChat"]

    print(f"{user_id = } and {rag_chat = }")

    if user_id in user_data:
        user_data[user_id]["last_active"] = time.time()
    
    system_message = ChatMessage(role="system", content=SYSTEM_PROMPT)

    # for debugging, default to empty string in case `message["content"]` doesn't exist (though in practice it always should).
    formatted_messages = [system_message] + [ChatMessage(role=message["role"], content=message.get("content", "")) for message in messages]

    if rag_chat:
        try:
            print("in the `try` block for rag_chat = True")
            if user_id in user_data:
                print("the user's chat engine is already in memory")
                chat_engine = user_data[user_id]["index_as_chat_engine"]
            else:
                print(f"loading the index from storage for {user_id=}...")
                index = load_index(user_id)
                print("turning the index into a chat engine...")
                # possible kwargs:
                    # llm=llm
                    # chat_mode="best" or "condense_plus_context" or...
                    # context_prompt [maybe replacing system message above??!?]
                chat_engine = index.as_chat_engine()
                print("made the chat engine")
                user_data[user_id] = {
                    "last_active": time.time(),
                    "index_as_chat_engine": chat_engine
                }
            print("now getting a response...")
            response = chat_engine.chat(
                message=formatted_messages[-1].content,
                chat_history=formatted_messages[:-1]
            )
            # this is an object, with attributes: response, sources, source_nodes, metadata
            response_text = response.response
            print(f"{response_text = }")
            # too much can change (like bouncing between different threads), so just reset each time.
            chat_engine.reset()
            return {"response": response_text}
        except Exception as e:
            print("in the `except` block for rag chat")
            return
    else:
        try:
            response = llm.chat(formatted_messages).message.blocks[0].text
            print("response:", response)
            return {"response": response}
        except Exception as e:
            print("in the `except` block for non-rag chat")
            raise HTTPException(status_code=500, detail=str(e))
            
            


# this endpoint shouldn't just be called `/index`, since that could clash with other default behavior (like getting `index.html`).
@app.post("/index_chats")
async def index_chats_llama_server(user_id: int = Body(...)):
    print("received a post request to the `/index_chats` endpoint")
    try:
        index = index_chats(user_id)
        print(f"indexed chats for user {user_id}")
        if user_id in user_data:
            user_data[user_id]["index_as_chat_engine"] = index.as_chat_engine()
        try:
            update_rag_status_all_threads(user_id, "UP_TO_DATE")
            return True
        except:
            print("in the `exception` block: failed to set rag statuses of threads")
            raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print("in the `except` block: failed to index chats")
        raise HTTPException(status_code=500, detail=str(e))







##################################################

# COMMENT THIS OUT FOR TESTING
uvicorn.run(app, host="0.0.0.0", port=PYTHON_SERVER_PORT)

##################################################

# USE THIS FOR TESTING

# async def test_func(my_string):
#     print("test func fired, with argument:", my_string)
#     return


# if __name__ == "__main__":
#     import asyncio
#     asyncio.run(test_func("sup sup sup!"))