import os

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from dotenv import load_dotenv
# this implicitly loads the openai API key from the `backend/.env` file.
load_dotenv()
# the second argument is the fallback value
PORT = int(os.environ.get("PYTHON_SERVER_PORT", 8000))
SYSTEM_PROMPT = os.environ.get("SYSTEM_PROMPT")



# for the fastapi/uvicorn server
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn




# from database.operations import get_all_messages, get_messages # ACTUALLY NO, these might _only_ get imported by `indices/operations.py`.
from indices.operations import index_chats




# llama index
from llama_index.llms.openai import OpenAI
from llama_index.core.base.llms.types import ChatMessage


llm = OpenAI(temperature=1, model="gpt-3.5-turbo", max_tokens=256)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"http://localhost:{os.environ.get("PORT")}"], # only allow requests from the node server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# this is just for convenience: to test if the server is running, point the browser to `http://localhost:8000` (or `http://0.0.0.0:8000`).
@app.get("/")
async def read_root():
    return {"status": "llama server is running!"}

@app.post("/chat")
async def chat_llama_server(messages: list = Body(...)):
    print("received a post request to the `/chat` endpoint")
    
    system_message = ChatMessage(role="system", content=SYSTEM_PROMPT)

    # for debugging, default to empty string in case `message["content"]` doesn't exist (though in practice it always should).
    formatted_messages = [system_message] + [ChatMessage(role=message["role"], content=message.get("content", "")) for message in messages]

    try:
        response = llm.chat(formatted_messages).message.blocks[0].text
        print("response:", response)
        return {"response": response}
    except Exception as e:
        print("in the `except` block")
        raise HTTPException(status_code=500, detail=str(e))


# this endpoint shouldn't just be called `/index`, since that could clash with other default behavior (like getting `index.html`).
@app.post("/index_chats")
async def index_chats_llama_server(user_id: int = Body(...)):
    print("received a post request to the `/index_chats` endpoint")
    try:
        index_chats(user_id)
        print(f"indexed chats for user {user_id}")
        return True
    except Exception as e:
        print("in the `except` block")
        raise HTTPException(status_code=500, detail=str(e))






##################################################

# COMMENT THIS OUT FOR TESTING
uvicorn.run(app, host="0.0.0.0", port=PORT)

##################################################

# USE THIS FOR TESTING

# async def test_func(my_string):
#     print("test func fired, with argument:", my_string)
#     return


# if __name__ == "__main__":
#     import asyncio
#     asyncio.run(test_func("sup sup sup!"))