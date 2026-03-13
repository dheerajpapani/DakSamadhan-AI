from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.complaint import ComplaintCreate, ComplaintResponse, ComplaintResolve
from app.api.deps import get_current_user
from app.nlp.classifier import classifier
from app.nlp.sentiment import analyzer
from app.core.supabase_client import supabase
import uuid
from datetime import datetime

router = APIRouter()

SCHEMA = "daksamadhan"


def _db():
    """Return a postgrest client scoped to the daksamadhan schema."""
    return supabase.schema(SCHEMA)


@router.get("/stats/public")
async def get_public_stats():
    """Public endpoint for homepage statistics. No auth required."""
    try:
        result = _db().table("complaints").select("id, status").execute()
        complaints = result.data or []
        resolved_count = sum(1 for c in complaints if c.get("status") == "Resolved")
        return {"resolved_count": resolved_count, "operational": True}
    except Exception:
        return {"resolved_count": 0, "operational": True}


@router.post("/", response_model=ComplaintResponse)
async def create_complaint(
    complaint: ComplaintCreate,
    current_user: dict = Depends(get_current_user),
):
    """Submit a new complaint. Runs AI analysis then persists to Supabase."""

    # 1. AI Analysis
    try:
        # Run category prediction and urgency analysis in parallel
        import asyncio
        category_probs, urgency_label, sentiment_result = await asyncio.gather(
            classifier.predict(complaint.description),
            classifier.analyze_urgency(complaint.description),
            analyzer.analyze(complaint.description)
        )
        
        auto_category = max(category_probs, key=category_probs.get) if category_probs else "Other"
    except Exception as e:
        print(f"AI Analysis failed: {e}")
        auto_category = "Other"
        urgency_label = "Normal"
        sentiment_result = {"sentiment": "neutral", "score": 0.5}

    final_category = complaint.category or auto_category

    # 2. Refined Priority logic
    # Base priority from AI Urgency pass
    if urgency_label == "Critical":
        priority = "High"
    elif urgency_label == "Urgent":
        priority = "Medium"
    else:
        priority = "Low"

    # Escalation Rules:
    # High-impact categories or Negative sentiment can bump priority
    if priority != "High":
        # 1. Negative sentiment bumps by one level
        if sentiment_result["sentiment"] == "negative":
            priority = "High" if priority == "Medium" else "Medium"
            
        # 2. Sensitive categories force at least Medium/High
        if final_category in ["Missing Contents", "Fraudulent Activity", "Damaged Item", "Lost Article"]:
            # If it's one of these and negative/urgent, force High
            if sentiment_result["sentiment"] == "negative" or urgency_label == "Urgent":
                priority = "High"
            else:
                # Minimum Medium for these categories
                priority = "Medium" if priority == "Low" else priority

    # 3. Build record
    complaint_id = str(uuid.uuid4())
    new_complaint = {
        "id": complaint_id,
        "user_id": current_user["id"],
        "subject": complaint.subject,
        "description": complaint.description,
        "email": complaint.email,
        "category": final_category,
        "sentiment_score": sentiment_result.get("score", 0.0),
        "sentiment_label": sentiment_result["sentiment"],
        "priority": priority,
        "status": "Open",
        "resolution_notes": None,
        "responses": [],
        "created_at": datetime.utcnow().isoformat(),
    }

    # 4. Persist to Supabase
    try:
        result = _db().table("complaints").insert(new_complaint).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save complaint")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase insert failed: {e}")
        raise HTTPException(status_code=500, detail="Database error. Please try again.")


@router.patch("/{complaint_id}/resolve", response_model=ComplaintResponse)
async def resolve_complaint(
    complaint_id: str,
    resolution: ComplaintResolve,
    current_user: dict = Depends(get_current_user),
):
    """Mark a complaint as Resolved with notes."""
    try:
        result = _db().table("complaints").update({
            "status": "Resolved",
            "resolution_notes": resolution.resolution_notes,
            "updated_at": datetime.utcnow().isoformat(),
        }).eq("id", complaint_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Complaint not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Resolve failed: {e}")
        raise HTTPException(status_code=500, detail="Database error")


@router.post("/{complaint_id}/respond", response_model=ComplaintResponse)
async def respond_complaint(
    complaint_id: str,
    response_text: str,
    current_user: dict = Depends(get_current_user),
):
    """Append a staff response to a complaint."""
    try:
        # Fetch current responses
        fetch = _db().table("complaints").select("responses, email").eq("id", complaint_id).execute()
        if not fetch.data:
            raise HTTPException(status_code=404, detail="Complaint not found")

        existing = fetch.data[0]
        current_responses = existing.get("responses") or []
        current_responses.append(f"{datetime.utcnow().isoformat()}: {response_text}")

        print(f"Sending email to {existing.get('email', 'unknown')}: {response_text}")

        result = _db().table("complaints").update({
            "responses": current_responses,
            "status": "In Progress",
            "updated_at": datetime.utcnow().isoformat(),
        }).eq("id", complaint_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Complaint not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Respond failed: {e}")
        raise HTTPException(status_code=500, detail="Database error")


@router.get("/", response_model=List[ComplaintResponse])
async def list_complaints(current_user: dict = Depends(get_current_user)):
    """Fetch all complaints (officials only in real RBAC; any auth user for MVP)."""
    try:
        result = _db().table("complaints").select("*").order("created_at", desc=True).execute()
        return result.data or []
    except Exception as e:
        print(f"List failed: {e}")
        raise HTTPException(status_code=500, detail="Database error")


@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: str):
    """Public endpoint to track complaint status by ID. No auth required."""
    try:
        result = _db().table("complaints").select("*").eq("id", complaint_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Complaint not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get complaint failed: {e}")
        raise HTTPException(status_code=500, detail="Database error")
