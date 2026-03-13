import os
import httpx
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

class ComplaintClassifier:
    def __init__(self):
        self.api_url = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli"
        self.api_key = os.getenv("HF_API_KEY")
        self.headers = {"Authorization": f"Bearer {self.api_key}"}

    async def predict(self, text: str) -> Dict[str, float]:
        """
        Predict the category of the complaint using HF Inference API.
        """
        if not self.api_key:
            print("HF_API_KEY not found. Skipping AI analysis.")
            return {"Other": 1.0}

        candidate_labels = [
            'Delivery Delay', 
            'Lost Article', 
            'Damaged Item', 
            'Missing Contents',
            'Fraudulent Activity',
            'Staff Behavior', 
            'Refund Issue', 
            'Other'
        ]

        payload = {
            "inputs": text,
            "parameters": {"candidate_labels": candidate_labels}
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(self.api_url, headers=self.headers, json=payload)
                
                if response.status_code == 200:
                    result = response.json()
                    return dict(zip(result['labels'], result['scores']))
                else:
                    print(f"HF API Error ({response.status_code}): {response.text}")
                    return {"Other": 1.0}
        except Exception as e:
            print(f"HF API Request failed: {e}")
            return {"Other": 1.0}

    async def analyze_urgency(self, text: str) -> str:
        """
        Secondary pass to determine the urgency/criticality of the issue.
        Returns: 'Critical', 'Urgent', or 'Normal'
        """
        if not self.api_key:
            return "Normal"

        candidate_labels = ['Critical', 'Urgent', 'Normal']
        
        payload = {
            "inputs": text,
            "parameters": {"candidate_labels": candidate_labels}
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(self.api_url, headers=self.headers, json=payload)
                
                if response.status_code == 200:
                    result = response.json()
                    # The highest score label is at result['labels'][0]
                    return result['labels'][0]
                else:
                    return "Normal"
        except Exception:
            return "Normal"

classifier = ComplaintClassifier()
