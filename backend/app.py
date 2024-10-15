from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from typing import List, Dict

# Replace this with your MongoDB Atlas URI
client = MongoClient('mongodb://tanharshb20:<db_password>@techask.cqvb4.mongodb.net/?retryWrites=true&w=majority&appName=techask')

# Select your database
db = client['warehouse_db']

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://techask.vercel.app"],  # Ensure it matches frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/godown", response_model=List[Dict])
async def get_all_godowns():
    godowns = list(db.godowns.find({}, {"_id": 0}))
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
