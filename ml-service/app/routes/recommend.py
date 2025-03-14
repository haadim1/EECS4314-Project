from fastapi import APIRouter, HTTPException, Depends
from bson.objectid import ObjectId
from app.database import recommendations_collection, users_collection, barbers_collection
from app.auth.jwt import get_current_user
from app.models import RecommendationRequest
import os
import openai
router = APIRouter()

import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

def generate_recommendation(hair_type: str, face_shape: str, preferences: str) -> str:
    """
    Generates a hairstyle recommendation based on the user's hair type, face shape, and preferences.
    """
    if not openai_api_key:
        return "Error: OpenAI API key not found. Please check your .env file."

    client = openai.OpenAI(api_key=openai_api_key)

    messages = [
        {"role": "system", "content": "You are a professional hairstylist providing expert recommendations."},
        {"role": "user", "content": f"I have {hair_type} hair and a {face_shape} face. My preferences are: {preferences}. What hairstyle do you recommend?"}
    ]

    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        temperature=0.7,
    )

    return response.choices[0].message.content.strip()

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
