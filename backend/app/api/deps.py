from fastapi import Header, HTTPException
from typing import Optional

async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Verify Supabase JWT. 
    For MVP/Dev, we might just check if it exists or is a specific mock token.
    In production, use supabase.auth.get_user(token)
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token")
    
    # Simple Mock Validation for MVP since we don't have real Keys in .env yet
    # In real imp: token = authorization.replace("Bearer ", "")
    # user = supabase.auth.get_user(token)
    
    return {"id": "user-123", "role": "citizen"}
