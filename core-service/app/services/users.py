import asyncio
import aio_pika
import os
import json
import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from app import mongo

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
RABBITMQ_QUEUE_NAME = os.getenv("RABBITMQ_QUEUE_NAME")

users_bp = Blueprint("users", __name__)

async def send_booking_event(user_id, barber_id, time):
    """Send booking event to RabbitMQ."""
    try:
        connection = await aio_pika.connect_robust(RABBITMQ_URL)
        async with connection:
            channel = await connection.channel()
            await channel.set_qos(prefetch_count=10)

            await channel.declare_queue(RABBITMQ_QUEUE_NAME, durable=True)

            message = json.dumps({
                "event_type": "BOOKING_CONFIRMED",
                "user_id": user_id,
                "barber_id": barber_id,
                "time": time
            })

            await channel.default_exchange.publish(
                aio_pika.Message(body=message.encode()),
                routing_key=RABBITMQ_QUEUE_NAME,
            )
            logging.info("Booking event sent to RabbitMQ")

    except Exception as e:
        logging.error(f"Failed to send booking event to RabbitMQ: {e}")

@users_bp.route("/book", methods=["POST"])
@jwt_required()
def book_slot():
    data = request.json
    user_identity = get_jwt_identity()

    if isinstance(user_identity, dict): 
        user_id = user_identity.get("id")
    else:
        user_id = str(user_identity)

    if not all(field in data for field in ["barber_id", "time"]):
        return jsonify({"error": "Missing required fields"}), 400

    barber = mongo.barbers.find_one({
        "_id": ObjectId(data["barber_id"]),
        "available_slots": {
            "$elemMatch": {"time": data["time"], "booked": False}
        }
    })

    if not barber:
        return jsonify({"error": "Slot not available"}), 400

    try:
        user_object_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID"}), 400

    mongo.barbers.update_one(
        {"_id": ObjectId(data["barber_id"]), "available_slots.time": data["time"]},
        {"$set": {"available_slots.$.booked": True, "available_slots.$.user_id": user_object_id}}
    )
    mongo.users.update_one(
        {"_id": user_object_id},
        {"$push": {"booked_slots": {"barber_id": data["barber_id"], "time": data["time"]}}}
    )

    asyncio.run(send_booking_event(user_id, data["barber_id"], data["time"]))

    return jsonify({"message": "Appointment booked successfully"}), 201


@users_bp.route("/cancel", methods=["POST"])
@jwt_required()
def cancel_appointment():
    data = request.json
    user_id = get_jwt_identity()

    if not all(field in data for field in ["barber_id", "time"]):
        return jsonify({"error": "Missing required fields"}), 400

    mongo.barbers.update_one(
        {"_id": ObjectId(data["barber_id"]), "available_slots.time": data["time"]},
        {"$set": {"available_slots.$.booked": False, "available_slots.$.user_id": None}}
    )
    mongo.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$pull": {"booked_slots": {"barber_id": data["barber_id"], "time": data["time"]}}}
    )

    return jsonify({"message": "Appointment canceled successfully"}), 200


@users_bp.route("/test", methods=["GET"])
@jwt_required()
def test_auth():
    identity = get_jwt_identity()
    return jsonify({"message": "JWT is working!", "user": identity}), 200
