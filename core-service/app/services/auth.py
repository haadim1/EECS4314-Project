from flask import Blueprint, request, jsonify  # type: ignore
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re
from app import mongo, bcrypt

auth_bp = Blueprint("auth", __name__)

def validate_password(password):
    
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"
    
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    
    return True, "Password is valid"

@auth_bp.route("/register/user", methods=["POST"])
def register_user():
    data = request.json

    is_valid, message = validate_password(data["password"])
    if not is_valid:
        return jsonify({"error": message}), 400

    if mongo.users.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    user_id = mongo.users.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hashed_pw,
        "role": "customer"
    }).inserted_id

    return jsonify({"message": "User registered", "user_id": str(user_id)}), 201

@auth_bp.route("/register/barber", methods=["POST"])
def register_barber():
    data = request.json

    is_valid, message = validate_password(data["password"])
    if not is_valid:
        return jsonify({"error": message}), 400

    if mongo.barbers.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    barber_id = mongo.barbers.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hashed_pw,
        "role": "barber",
        "available_slots": [],
        "notifications": []
    }).inserted_id

    return jsonify({"message": "Barber registered", "barber_id": str(barber_id)}), 201

@auth_bp.route("/login/user", methods=["POST"])
def login_user():
    data = request.json
    user = mongo.users.find_one({"email": data["email"]})

    if user and bcrypt.check_password_hash(user["password"], data["password"]):
        user_id = str(user["_id"])
        access_token = create_access_token(identity=user_id)

        return jsonify({
            "access_token": access_token,
            "user_id": user_id,
            "role": "customer"
        })

    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/login/barber", methods=["POST"])
def login_barber():
    data = request.json
    barber = mongo.barbers.find_one({"email": data["email"]})

    if barber and bcrypt.check_password_hash(barber["password"], data["password"]):
        barber_id = str(barber["_id"])
        access_token = create_access_token(identity=barber_id)

        return jsonify({
            "access_token": access_token,
            "barber_id": barber_id,
            "role": "barber"
        })

    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/test", methods=["GET"])
@jwt_required()
def test_auth():
    current_user = get_jwt_identity()
    return jsonify({"message": "Token is valid", "user": current_user})
