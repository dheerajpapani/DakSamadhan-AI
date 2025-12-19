from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.complaint import ComplaintCreate, ComplaintResponse
from app.api.deps import get_current_user
from app.nlp.classifier import classifier
from app.nlp.sentiment import analyzer
from app.services.store import store
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ComplaintResponse)
async def create_complaint(
    complaint: ComplaintCreate,
    current_user: dict = Depends(get_current_user)
):
    # 1. AI Analysis
    category_probs = await classifier.predict(complaint.description)
    auto_category = max(category_probs, key=category_probs.get)
    final_category = complaint.category or auto_category
    
    sentiment_result = await analyzer.analyze(complaint.description)
    
    # 2. Priority Logic
    priority = "Low"
    if sentiment_result["sentiment"] == "negative":
        priority = "Medium"
        if final_category in ["Damaged", "Lost"]:
            priority = "High"
            
    # 3. Save to Store
    complaint_id = str(uuid.uuid4())
    new_complaint = {
        "id": complaint_id,
        "subject": complaint.subject,
        "description": complaint.description,
        "category": final_category,
        "sentiment_score": sentiment_result.get("score", 0.0),
        "sentiment_label": sentiment_result["sentiment"],
        "priority": priority,
        "status": "Open",
        "created_at": datetime.utcnow().isoformat()
    }
    
    await store.add(new_complaint)
    
    return new_complaint

@router.get("/", response_model=List[ComplaintResponse])
async def list_complaints(
    current_user: dict = Depends(get_current_user)
):
    """
    Fetch all complaints. 
    In future: Add filter parameters.
    """
    return await store.get_all()

