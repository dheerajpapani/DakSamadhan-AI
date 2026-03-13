from pydantic import BaseModel
from typing import Optional, Dict, List

class ComplaintCreate(BaseModel):
    subject: str
    description: str
    email: str
    category: Optional[str] = None
    
class ComplaintResponse(BaseModel):
    id: str
    subject: str
    description: str
    email: str
    category: str
    sentiment_score: float
    sentiment_label: str
    priority: str
    status: str
    resolution_notes: Optional[str] = None
    responses: List[str] = []
    created_at: str

class ComplaintResolve(BaseModel):
    resolution_notes: str
