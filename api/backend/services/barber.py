from flask import Blueprint, jsonify
from bson.objectid import ObjectId
from backend import mongo, bcrypt

barber_bp = Blueprint("barbers", __name__)

# Get Available Slots for a Barber
