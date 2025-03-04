from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from backend import mongo

booking_bp = Blueprint("booking", __name__)

# Book an Appointment
@booking_bp.route("/book", methods=["POST"])
@jwt_required()
def book_slot():
    data = request.json
    user_id = get_jwt_identity()
    barber = mongo.barbers.find_one({"_id": ObjectId(data["barber_id"]), "available_slots.date": data["date"], "available_slots.time": data["time"]})
    if not barber:
        return jsonify({"error": "Slot not available"}), 400
    
    mongo.appointments.insert_one({
        "user_id": ObjectId(user_id),
        "barber_id": ObjectId(data["barber_id"]),
        "date": data["date"],
        "time": data["time"],
        "status": "confirmed"
    })
    mongo.barbers.update_one({"_id": ObjectId(data["barber_id"])}, {"$set": {"available_slots.$[elem].booked": True}}, array_filters=[{"elem.date": data["date"], "elem.time": data["time"]}])
    return jsonify({"message": "Appointment booked"})
