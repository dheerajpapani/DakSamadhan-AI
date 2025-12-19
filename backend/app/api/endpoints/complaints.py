from fastapi import APIRouter, Depends, HTTPException
from app.models.complaint import ComplaintCreate, ComplaintResponse
from app.api.deps import get_current_user
from app.nlp.classifier import classifier
from app.nlp.sentiment import analyzer
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
    # Pick highest confidence category if not provided
    auto_category = max(category_probs, key=category_probs.get)
    final_category = complaint.category or auto_category
    
    sentiment_result = await analyzer.analyze(complaint.description)
    
    # 2. Priority Logic (Simple Rule-based)
    # Negative sentiment + "Damage" or "Delay" = High
    priority = "Low"
    if sentiment_result["sentiment"] == "negative":
        priority = "Medium"
        if final_category in ["Damaged", "Lost"]:
            priority = "High"
            
    # 3. Save to DB (Mock)
    complaint_id = str(uuid.uuid4())
    
    # 4. Return Response
    return {
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
