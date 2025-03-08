from flask import Blueprint, request, jsonify  # type: ignore
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from backend import mongo, bcrypt

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register/user", methods=["POST"])
def register_user():
    data = request.json

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

    if mongo.barbers.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    barber_id = mongo.barbers.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hashed_pw,
        "role": "barber",
        "available_slots": []
    }).inserted_id

    return jsonify({"message": "Barber registered", "barber_id": str(barber_id)}), 201

@auth_bp.route("/login/user", methods=["POST"])
def login_user():
    data = request.json
    user = mongo.users.find_one({"email": data["email"]})

    if user and bcrypt.check_password_hash(user["password"], data["password"]):
        access_token = create_access_token(identity={"id": str(user["_id"]), "role": "customer"})
        return jsonify({"access_token": access_token, "role": "customer"})
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/login/barber", methods=["POST"])
def login_barber():
    data = request.json
    barber = mongo.barbers.find_one({"email": data["email"]})

    if barber and bcrypt.check_password_hash(barber["password"], data["password"]):
        access_token = create_access_token(identity={"id": str(barber["_id"]), "role": "barber"})
        return jsonify({"access_token": access_token, "role": "barber"})
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/test", methods=["GET"])
@jwt_required()
def test_auth():
    current_user = get_jwt_identity()
    return jsonify({"message": "Token is valid", "user": current_user})
