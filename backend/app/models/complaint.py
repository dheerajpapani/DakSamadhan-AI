from pydantic import BaseModel
from typing import Optional, Dict

class ComplaintCreate(BaseModel):
    subject: str
    description: str
    category: Optional[str] = None
    
class ComplaintResponse(BaseModel):
    id: str
    subject: str
    description: str
    category: str
    sentiment_score: float
    sentiment_label: str
    priority: str
    status: str
    created_at: str
