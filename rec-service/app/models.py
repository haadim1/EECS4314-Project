from pydantic import BaseModel

class RecommendationRequest(BaseModel):
    barber_id: str
    time: str
    hair_type: str
    face_shape: str
    preferences: str
