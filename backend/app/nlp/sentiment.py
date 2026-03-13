import os
import httpx
from typing import Dict
from dotenv import load_dotenv

load_dotenv()

class SentimentAnalyzer:
    def __init__(self):
        self.api_url = "https://router.huggingface.co/hf-inference/models/distilbert-base-uncased-finetuned-sst-2-english"
        self.api_key = os.getenv("HF_API_KEY")
        self.headers = {"Authorization": f"Bearer {self.api_key}"}

    async def analyze(self, text: str) -> Dict[str, float]:
        """
        Analyze sentiment of the text using HF Inference API.
        """
        if not self.api_key:
            print("HF_API_KEY not found. Skipping sentiment analysis.")
            return {"sentiment": "neutral", "score": 0.5}

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(self.api_url, headers=self.headers, json={"inputs": text})
                
                if response.status_code == 200:
                    result_list = response.json()
                    # Result format: [[{'label': 'POSITIVE', 'score': 0.99}]]
                    result = result_list[0][0] if isinstance(result_list[0], list) else result_list[0]
                    
                    label = result['label'].lower()
                    score = result['score']
                    return {"sentiment": label, "score": score}
                else:
                    print(f"HF API Error ({response.status_code}): {response.text}")
                    return {"sentiment": "neutral", "score": 0.5}
        except Exception as e:
            print(f"HF API Request failed: {e}")
            return {"sentiment": "neutral", "score": 0.5}

analyzer = SentimentAnalyzer()
