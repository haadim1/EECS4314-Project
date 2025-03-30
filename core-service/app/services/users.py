import asyncio
import aio_pika
import os
import json
import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from app import mongo
from datetime import datetime

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
RABBITMQ_QUEUE_NAME = os.getenv("RABBITMQ_QUEUE_NAME")

users_bp = Blueprint("users", __name__)

async def send_booking_event(user_id, barber_id, time, canceled=False):
    """Send booking or cancellation event to RabbitMQ."""
    try:
        connection = await aio_pika.connect_robust(RABBITMQ_URL)
        async with connection:
            channel = await connection.channel()
            await channel.set_qos(prefetch_count=10)

            await channel.declare_queue(RABBITMQ_QUEUE_NAME, durable=True)

            event_type = "BOOKING_CANCELED" if canceled else "BOOKING_CONFIRMED"

            message = json.dumps({
                "event_type": event_type,
                "user_id": user_id,
                "barber_id": barber_id,
                "time": time
            })

            await channel.default_exchange.publish(
                aio_pika.Message(body=message.encode()),
                routing_key=RABBITMQ_QUEUE_NAME,
            )
            logging.info(f"{event_type} event sent to RabbitMQ")

    except Exception as e:
        logging.error(f"Failed to send {event_type} event to RabbitMQ: {e}")


@users_bp.route("/book", methods=["POST"])
@jwt_required()
def book_slot():
    data = request.json
    user_identity = get_jwt_identity()

    if isinstance(user_identity, dict): 
        user_id = user_identity.get("id")
    else:
        user_id = str(user_identity)

    # Validate required fields
    required_fields = ["barber_id", "time", "date", "service", "notes"]
    if not all(field in data for field in required_fields):
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

    # Create appointment document
    appointment = {
        "user_id": user_object_id,
        "barber_id": ObjectId(data["barber_id"]),
        "barber_name": barber.get("name", "Unknown Stylist"),
        "service": data["service"],
        "date": data["date"],
        "time": data["time"],
        "notes": data.get("notes", ""),
        "status": "Upcoming",
        "created_at": datetime.utcnow(),
        "price": data.get("price"),
        "duration": data.get("duration")
    }

    # Update barber's available slots
    mongo.barbers.update_one(
        {"_id": ObjectId(data["barber_id"]), "available_slots.time": data["time"]},
        {
            "$set": {
                "available_slots.$.booked": True,
                "available_slots.$.user_id": user_object_id,
                "available_slots.$.appointment_details": appointment
            }
        }
    )

    # Add appointment to appointments collection
    appointment_id = mongo.appointments.insert_one(appointment).inserted_id

    # Update user's booked slots with full appointment details
    mongo.users.update_one(
        {"_id": user_object_id},
        {
            "$push": {
                "appointments": {
                    "appointment_id": appointment_id,
                    **appointment
                }
            }
        }
    )

    asyncio.run(send_booking_event(user_id, data["barber_id"], data["time"]))

    return jsonify({
        "message": "Appointment booked successfully",
        "appointment_id": str(appointment_id)
    }), 201

@users_bp.route("/test", methods=["GET"])
@jwt_required()
def test_auth():
    identity = get_jwt_identity()
    return jsonify({"message": "JWT is working!", "user": identity}), 200


@users_bp.route("/info", methods=["GET"])
@jwt_required()
def get_user_info():
    user_identity = get_jwt_identity()
    
    if isinstance(user_identity, dict):
        user_id = user_identity.get("id")
    else:
        user_id = str(user_identity)

    try:
        user_id = ObjectId(user_id)
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    try:
        user = mongo.users.find_one({"_id": user_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        user["_id"] = str(user["_id"])

        return jsonify({
            "id": user["_id"],
            "name": user.get("name", "Client"),
            "email": user.get("email"),
            "role": user.get("role", "customer"),
            "created_at": user.get("created_at")
        }), 200

    except Exception as e:
        logging.error(f"Error fetching user info: {e}")
        return jsonify({"error": "Failed to fetch user information"}), 500


@users_bp.route("/appointments", methods=["GET"])
@jwt_required()
def get_user_appointments():
    user_identity = get_jwt_identity()
    
    if isinstance(user_identity, dict):
        user_id = user_identity.get("id")
    else:
        user_id = str(user_identity)

    try:
        user_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID"}), 400

    try:
        # Find all appointments for the user
        appointments = list(mongo.appointments.find({"user_id": user_id}))
        
        # Convert ObjectIds to strings for JSON serialization
        for appointment in appointments:
            appointment["_id"] = str(appointment["_id"])
            appointment["user_id"] = str(appointment["user_id"])
            appointment["barber_id"] = str(appointment["barber_id"])
            # Convert datetime to ISO format string if present
            if "created_at" in appointment:
                appointment["created_at"] = appointment["created_at"].isoformat()

        return jsonify({
            "appointments": appointments
        }), 200

    except Exception as e:
        logging.error(f"Error fetching appointments: {e}")
        return jsonify({"error": "Failed to fetch appointments"}), 500


@users_bp.route("/appointments/cancel/<appointment_id>", methods=["POST"])
@jwt_required()
def cancel_appointment(appointment_id):
    user_identity = get_jwt_identity()
    
    if isinstance(user_identity, dict):
        user_id = user_identity.get("id")
    else:
        user_id = str(user_identity)

    try:
        user_object_id = ObjectId(user_id)
        appointment_object_id = ObjectId(appointment_id)
    except:
        return jsonify({"error": "Invalid ID format"}), 400

    try:
        # Find the appointment first to get details
        appointment = mongo.appointments.find_one({
            "_id": appointment_object_id,
            "user_id": user_object_id
        })

        if not appointment:
            return jsonify({"error": "Appointment not found or unauthorized"}), 404

        # Update appointment status
        mongo.appointments.update_one(
            {"_id": appointment_object_id},
            {"$set": {"status": "Cancelled", "cancelled_at": datetime.utcnow()}}
        )

        # Free up the barber's slot
        mongo.barbers.update_one(
            {
                "_id": appointment["barber_id"],
                "available_slots.time": appointment["time"]
            },
            {
                "$set": {
                    "available_slots.$.booked": False,
                    "available_slots.$.user_id": None,
                    "available_slots.$.appointment_details": None
                }
            }
        )

        # Update user's appointments array
        mongo.users.update_one(
            {"_id": user_object_id},
            {
                "$pull": {
                    "appointments": {
                        "appointment_id": appointment_object_id
                    }
                }
            }
        )

        # Send cancellation event to RabbitMQ
        asyncio.run(send_booking_event(
            str(user_object_id),
            str(appointment["barber_id"]),
            appointment["time"],
            canceled=True
        ))

        return jsonify({
            "message": "Appointment cancelled successfully",
            "appointment_id": str(appointment_object_id)
        }), 200

    except Exception as e:
        logging.error(f"Error cancelling appointment: {e}")
        return jsonify({"error": "Failed to cancel appointment"}), 500
