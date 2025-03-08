from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from backend import mongo

barber_bp = Blueprint("barber", __name__)

@barber_bp.route("/<barber_id>/slots", methods=["POST"])
@jwt_required()
def add_slots(barber_id):
    current_user = get_jwt_identity()
    if isinstance(current_user, dict):
        current_user_id = current_user.get("id")
    else:
        current_user_id = str(current_user)

    if current_user_id != barber_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    if "slots" not in data or not isinstance(data["slots"], list):
        return jsonify({"error": "Slots must be provided as a list"}), 400

    slots = [{"time": slot, "booked": False, "user_id": None} for slot in data["slots"]]

    mongo.barbers.update_one(
        {"_id": ObjectId(barber_id)},
        {"$push": {"available_slots": {"$each": slots}}}
    )

    return jsonify({"message": "Slots added successfully"}), 201

@barber_bp.route("/<barber_id>/slots", methods=["GET"])
def get_available_slots(barber_id):
    barber = mongo.barbers.find_one({"_id": ObjectId(barber_id)})

    if not barber:
        return jsonify({"error": "Barber not found"}), 404

    return jsonify(barber["available_slots"])