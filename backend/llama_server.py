import os
from dotenv import load_dotenv
load_dotenv()
# the second argument is the fallback value
PORT = int(os.environ.get("PYTHON_SERVER_PORT", 8000))

# for the fastapi/uvicorn server
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# llama index
from llama_index.llms.openai import OpenAI
from llama_index.core.base.llms.types import ChatMessage
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

llm = OpenAI(temperature=1, model="gpt-3.5-turbo", max_tokens=256)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # only allow requests from the node server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"status": "llama server is running!"}

@app.post("/chat")
async def chat(messages: list = Body(...)):
    print("received a post request to the `/chat` endpoint")
    
    system_message = ChatMessage(
        role="system",
        content="Your name is Ragnar the RAGbot, . You love to use RAG to help users read their documents!"
    )

    # for debugging, default to empty string in case `message["content"]` doesn't exist (though in practice it always should).
    formatted_messages = [system_message] + [ChatMessage(role=message["role"], content=message.get("content", "")) for message in messages]

    try:
        # print("at the beginning of the `try` block")
        response = llm.chat(formatted_messages).message.blocks[0].text
        # print("after making `response` in the `try` block")
        # print("response is:", response)
        # print("type(response) is:", type(response))
        # print("finally:", response.message.blocks[0])
        print("response:", response)
        return {"response": response}
    except Exception as e:
        print("in the `except` block")
        raise HTTPException(status_code=500, detail=str(e))

uvicorn.run(app, host="0.0.0.0", port=PORT)
