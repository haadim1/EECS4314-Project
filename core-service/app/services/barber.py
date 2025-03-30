from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from app import mongo

barber_bp = Blueprint("barber", __name__)

@barber_bp.route("/slots", methods=["POST"])
@jwt_required()
def add_slots():
    current_user = get_jwt_identity()
    if isinstance(current_user, dict):
        current_user_id = current_user.get("id")
    else:
        current_user_id = str(current_user)

    data = request.json
    if "slots" not in data or not isinstance(data["slots"], list):
        return jsonify({"error": "Slots must be provided as a list"}), 400

    slots = [{"time": slot, "booked": False, "user_id": None} for slot in data["slots"]]

    mongo.barbers.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$push": {"available_slots": {"$each": slots}}}
    )

    return jsonify({"message": "Slots added successfully"}), 201

def convert_objectid_to_str(data):
    """ Recursively convert ObjectId fields to strings in a given data structure. """
    if isinstance(data, dict):
        return {k: convert_objectid_to_str(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid_to_str(v) for v in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

@barber_bp.route("/slots", methods=["GET"])
@jwt_required()
def get_available_slots():
    current_user = get_jwt_identity()

    if isinstance(current_user, dict):
        current_user_id = current_user.get("id")
    else:
        current_user_id = str(current_user)

    print("Current User ID:", current_user_id)

    try:
        barber = mongo.barbers.find_one({"_id": ObjectId(current_user_id)})
    except Exception as e:
        return jsonify({"error": "Invalid user ID format"}), 400

    if not barber:
        return jsonify({"error": "Barber not found"}), 404

    available_slots = convert_objectid_to_str(barber.get("available_slots", []))

    return jsonify({"available_slots": available_slots}), 200

@barber_bp.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    current_user = get_jwt_identity()

    if isinstance(current_user, dict):
        current_user_id = current_user.get("id")
    else:
        current_user_id = str(current_user)

    try:
        barber = mongo.barbers.find_one({"_id": ObjectId(current_user_id)})
    except Exception as e:
        return jsonify({"error": "Invalid user ID format"}), 400

    if not barber:
        return jsonify({"error": "Barber not found"}), 404

    notifications = convert_objectid_to_str(barber.get("notifications", []))

    mongo.barbers.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {"notifications": []}}
    )

    return jsonify({"notifications": notifications}), 200

@barber_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_barbers():
    try:
        barbers_cursor = mongo.barbers.find()
        barbers = []

        for barber in barbers_cursor:
            barber_data = {
                "id": str(barber["_id"]),
                "name": barber.get("name", ""),
                "email": barber.get("email", "")
            }
            barbers.append(barber_data)

        return jsonify({"barbers": barbers}), 200

    except Exception as e:
        return jsonify({"error": "An error occurred while fetching barbers", "details": str(e)}), 500
