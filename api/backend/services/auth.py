from flask import Blueprint, request, jsonify # type: ignore
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from backend import mongo, bcrypt

auth_bp = Blueprint("auth", __name__)

# User Registration
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if mongo.users.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 400
    
    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode('utf-8')
    user_id = mongo.users.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hashed_pw,
        "role": data.get("role", "customer")
    }).inserted_id
    return jsonify({"message": "User registered", "user_id": str(user_id)})

# User Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = mongo.users.find_one({"email": data["email"]})
    if user and bcrypt.check_password_hash(user["password"], data["password"]):
        access_token = create_access_token(identity=str(user["_id"]))
        return jsonify({"access_token": access_token})
    return jsonify({"error": "Invalid credentials"}), 401
