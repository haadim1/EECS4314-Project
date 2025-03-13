from fastapi import APIRouter, HTTPException, Depends
from bson.objectid import ObjectId
from app.database import recommendations_collection, users_collection, barbers_collection
from app.auth.jwt import get_current_user
from app.models import RecommendationRequest  # ✅ Import from models.py

router = APIRouter()

def generate_recommendation(hair_type: str, face_shape: str, preferences: str) -> str:
    """
    Generates a recommendation based on the user's hair type, face shape, and preferences.
    """
    return f"Recommended haircut for {hair_type} hair and {face_shape} face: {preferences}"

@router.post("/recommend")
async def create_recommendation(request: RecommendationRequest, user_id: str = Depends(get_current_user)):
    """
    Create a haircut recommendation for the authenticated user.
    """
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found or unauthorized")
    
    barber = barbers_collection.find_one(
        {"_id": ObjectId(request.barber_id), "available_slots.time": request.time}
    )
    
    if not barber:
        raise HTTPException(status_code=400, detail="Barber or slot not found")
    
    recommendation_text = generate_recommendation(request.hair_type, request.face_shape, request.preferences)
    
    recommendation_entry = {
        "user_id": ObjectId(user_id),
        "barber_id": ObjectId(request.barber_id),
        "time": request.time,
        "hair_type": request.hair_type,
        "face_shape": request.face_shape,
        "preferences": request.preferences,
        "recommendation": recommendation_text,
    }
    
    result = recommendations_collection.insert_one(recommendation_entry)
    recommendation_id = result.inserted_id

    barbers_collection.update_one(
        {"_id": ObjectId(request.barber_id), "available_slots.time": request.time},
        {"$set": {"available_slots.$.recommendation_id": recommendation_id}}
    )

    users_collection.update_one(
        {"_id": ObjectId(user_id), "booked_slots.time": request.time},
        {"$set": {"booked_slots.$.recommendation_id": recommendation_id}}
    )

    return {"recommendation_id": str(recommendation_id), "recommendation": recommendation_text}
