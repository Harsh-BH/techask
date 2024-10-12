# main.py
from fastapi import FastAPI
from pymongo import MongoClient
from pydantic import BaseModel
from bson import ObjectId
import os
from fastapi.middleware.cors import CORSMiddleware


# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["mydatabase"]
collection = db["mycollection"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update with your Vite frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic models for request and response validation
class Item(BaseModel):
    name: str
    description: str
    price: float

# Endpoint to create a new item in the database
@app.post("/items/")
async def create_item(item: Item):
    item_dict = item.dict()
    result = collection.insert_one(item_dict)
    item_dict["_id"] = str(result.inserted_id)
    return item_dict

# Endpoint to retrieve all items from the database
@app.get("/items/")
async def get_items():
    items = list(collection.find({}))
    for item in items:
        item["_id"] = str(item["_id"])  # Convert ObjectId to string for JSON
    return items

# main.py (add this new endpoint)

@app.get("/test-data/")
async def get_test_data():
    test_data = {"message": "Database is connected and working!"}
    return test_data

