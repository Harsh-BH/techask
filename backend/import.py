import json
from pymongo import MongoClient

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['warehouse_db']  # Creating or selecting database

# Load and insert godowns.json
with open('backend\godowns.json') as f:
    godowns_data = json.load(f)
db.godowns.insert_many(godowns_data)

# Load and insert items.json
with open('backend\items.json') as f:
    items_data = json.load(f)
db.items.insert_many(items_data)

print("Data imported successfully!")
