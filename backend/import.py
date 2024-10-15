import json
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# MongoDB Atlas connection URI (Update with your credentials)
uri = "mongodb+srv://me:harsh@techask.cqvb4.mongodb.net/?retryWrites=true&w=majority&appName=techask"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tls=True)

# Test the connection by sending a ping command
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(f"Connection error: {e}")
    exit(1)  # Exit the program if connection fails

# Select your database
db = client['warehouse_db']

# Load and insert godowns data
try:
    with open('godowns.json') as f:
        godowns_data = json.load(f)
    db.godowns.insert_many(godowns_data)
    print("Godowns data imported successfully!")
except FileNotFoundError:
    print("Error: godowns.json file not found.")
except Exception as e:
    print(f"Error importing godowns data: {e}")

# Load and insert items data
try:
    with open('items.json') as f:
        items_data = json.load(f)
    db.items.insert_many(items_data)
    print("Items data imported successfully!")
except FileNotFoundError:
    print("Error: items.json file not found.")
except Exception as e:
    print(f"Error importing items data: {e}")
