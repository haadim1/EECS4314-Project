from flask import Blueprint, jsonify
from bson.objectid import ObjectId
from backend import mongo, bcrypt

barber_bp = Blueprint("barbers", __name__)

# Get Available Slots for a Barber
@barber_bp.route("/<barber_id>/slots", methods=["GET"])
def get_available_slots(barber_id):
    barber = mongo.barbers.find_one({"_id": ObjectId(barber_id)})
    if not barber:
        return jsonify({"error": "Barber not found"}), 404
    available_slots = [slot for slot in barber["available_slots"] if not slot["booked"]]
    return jsonify(available_slots)
