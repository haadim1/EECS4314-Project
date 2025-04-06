import os
import urllib.parse
import certifi
from flask import Flask # type: ignore
from flask_bcrypt import Bcrypt # type: ignore
from flask_jwt_extended import JWTManager # type: ignore
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Allow requests from frontend
CORS(app, 
     supports_credentials=True, 
     resources={r"/*": {
        "origins": ["http://localhost:3000", "https://eecs4314-frontend-510709848798.us-central1.run.app"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"]
     }})


# JWT Secret Key
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "fallback_secret_key")
app.config['JWT_TOKEN_LOCATION'] = ['cookies', 'headers']
app.config['JWT_COOKIE_SECURE'] = False         # True in production (HTTPS)
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  
app.config['JWT_ACCESS_COOKIE_NAME'] = 'token' # Name of the cookie to store the JWT token 

# Encode MongoDB credentials
username = urllib.parse.quote_plus(os.getenv("MONGO_USERNAME"))
password = urllib.parse.quote_plus(os.getenv("MONGO_PASSWORD"))
cluster = os.getenv("MONGO_CLUSTER")

# MongoDB Connection
mongo_uri = f"mongodb+srv://{username}:{password}@{cluster}/SalonAI?retryWrites=true&w=majority"
mongo_client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
mongo = mongo_client["SalonAI"]

# Initialize Extensions
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Register Blueprints
from app.services.auth import auth_bp
from app.services.barber import barber_bp
from app.services.users import users_bp

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(barber_bp, url_prefix="/barbers")
app.register_blueprint(users_bp, url_prefix="/users")
