from fastapi import Header, HTTPException
from typing import Optional
from app.core.supabase_client import supabase


async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Verify Supabase JWT by calling auth.get_user().
    Returns the authenticated user's id and email.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token")

    try:
        token = authorization.replace("Bearer ", "").strip()
        response = supabase.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return {
            "id": str(response.user.id),
            "email": response.user.email,
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
