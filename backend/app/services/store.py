from typing import List, Dict
from app.models.complaint import ComplaintResponse

class ComplaintStore:
    def __init__(self):
        self._complaints: List[dict] = []

    async def add(self, complaint: dict) -> dict:
        self._complaints.append(complaint)
        return complaint

    async def get_all(self) -> List[dict]:
        return self._complaints

# Global instance
store = ComplaintStore()
