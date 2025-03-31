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

    # Modified to include date
    slots = [{
        "date": slot["date"],
        "time": slot["time"],
        "booked": False,
        "user_id": None
    } for slot in data["slots"]]

    # First remove any existing slots for the given dates to avoid duplicates
    dates = list(set(slot["date"] for slot in slots))
    mongo.barbers.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$pull": {"available_slots": {"date": {"$in": dates}}}}
    )

    # Then add the new slots
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

@barber_bp.route("/slots/<date>", methods=["PUT"])
@jwt_required()
def update_slots_for_date(date):
    current_user = get_jwt_identity()
    current_user_id = current_user.get("id") if isinstance(current_user, dict) else str(current_user)

    data = request.json
    if "slots" not in data or not isinstance(data["slots"], list):
        return jsonify({"error": "Time slots must be provided as a list"}), 400

    slots = [{
        "date": date,
        "time": slot["time"],
        "booked": False,
        "user_id": None
    } for slot in data["slots"]]

    try:
        # Remove existing slots for the date
        mongo.barbers.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$pull": {"available_slots": {"date": date}}}
        )

        # Add new slots
        if slots:
            mongo.barbers.update_one(
                {"_id": ObjectId(current_user_id)},
                {"$push": {"available_slots": {"$each": slots}}}
            )

        return jsonify({"message": "Slots updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@barber_bp.route("/slots/<date>", methods=["DELETE"])
@jwt_required()
def delete_slots_for_date(date):
    current_user = get_jwt_identity()
    current_user_id = current_user.get("id") if isinstance(current_user, dict) else str(current_user)

    try:
        result = mongo.barbers.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$pull": {"available_slots": {"date": date}}}
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Slots deleted successfully"}), 200
        return jsonify({"message": "No slots found for the specified date"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

@barber_bp.route("/info", methods=["GET"])
@jwt_required()
def get_barber_info():
    current_user = get_jwt_identity()
    
    if isinstance(current_user, dict):
        current_user_id = current_user.get("id")
    else:
        current_user_id = str(current_user)

    try:
        barber = mongo.barbers.find_one({"_id": ObjectId(current_user_id)})
        if not barber:
            return jsonify({"error": "Barber not found"}), 404

        # Convert the barber document to a dictionary and handle ObjectId conversion
        barber_info = {
            "id": str(barber["_id"]),
            "name": barber.get("name", ""),
            "email": barber.get("email", ""),
            "phone": barber.get("phone", ""),
            "experience": barber.get("experience", ""),
            "specialties": barber.get("specialties", []),
            "bio": barber.get("bio", ""),
            "profile_image": barber.get("profile_image", ""),
            "rating": barber.get("rating", 0),
            "total_reviews": barber.get("total_reviews", 0),
            "available_slots": convert_objectid_to_str(barber.get("available_slots", [])),
            "services": barber.get("services", []),
            "working_hours": barber.get("working_hours", {}),
            "client_count": barber.get("client_count", 0),
            "joined_date": barber.get("created_at", "").isoformat() if barber.get("created_at") else None
        }

        return jsonify(barber_info), 200

    except Exception as e:
        return jsonify({
            "error": "An error occurred while fetching barber information",
            "details": str(e)
        }), 500
