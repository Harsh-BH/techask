from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from typing import List, Dict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174","https://techask.vercel.app"],  # Ensure this matches your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['warehouse_db']

@app.get("/godown", response_model=List[Dict])
async def get_all_godowns():
    godowns = list(db.godowns.find({}, {"_id": 0}))  # Fetch all godowns
    if not godowns:
        raise HTTPException(status_code=404, detail="No godowns found")
    return godowns

@app.get("/godown/{godown_id}", response_model=Dict)
async def get_godown_details(godown_id: str):
    godown = db.godowns.find_one({"id": godown_id}, {"_id": 0})
    if not godown:
        raise HTTPException(status_code=404, detail="Godown not found")
    items = list(db.items.find({"godown_id": godown_id}, {"_id": 0}))
    return {
        "godown": godown,
        "items": items
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
