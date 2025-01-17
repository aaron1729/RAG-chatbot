from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
# from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
# import os
# from dotenv import load_dotenv

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

# test endpoint
@app.post("/test")
async def test_endpoint(message: str = Body(..., embed=True)):
    return {"response": f"python server received the message: {message}"}

uvicorn.run(app, host="0.0.0.0", port=8000)

# @app.post("/query")
