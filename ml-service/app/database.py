import os
import urllib.parse
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

username = urllib.parse.quote_plus(os.getenv("MONGO_USERNAME"))
password = urllib.parse.quote_plus(os.getenv("MONGO_PASSWORD"))
cluster = os.getenv("MONGO_CLUSTER")

mongo_uri = f"mongodb+srv://{username}:{password}@{cluster}/SalonAI?retryWrites=true&w=majority"

try:
    mongo_client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
    db = mongo_client["SalonAI"]
    print("MongoDB Connected Successfully!")
except Exception as e:
    print("MongoDB Connection Failed:", str(e))

# Define Collections
users_collection = db["users"]
barbers_collection = db["barbers"]
recommendations_collection = db["recommendations"]
