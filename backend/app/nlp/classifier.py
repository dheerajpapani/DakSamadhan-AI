from typing import Dict
from transformers import pipeline
import asyncio
from concurrent.futures import ThreadPoolExecutor

class ComplaintClassifier:
    def __init__(self):
        # Initialize pipeline lazily or on startup
        # We use a ThreadPoolExecutor to run blocking HF code in async context
        self.executor = ThreadPoolExecutor(max_workers=1)
        self.classifier = None

    def _load_model(self):
        if not self.classifier:
            print("Loading Classification Model...")
            # Using distilbart-mnli-12-1 for speed/resource efficiency as requested
            self.classifier = pipeline("zero-shot-classification", model="valhalla/distilbart-mnli-12-1")
            print("Classification Model Loaded.")

    async def predict(self, text: str) -> Dict[str, float]:
        """
        Predict the category of the complaint.
        """
        if not self.classifier:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(self.executor, self._load_model)

        candidate_labels = [
            'Delivery Delay', 
            'Lost Article', 
            'Damaged Item', 
            'Staff Behavior', 
            'Refund Issue', 
            'Other'
        ]

        loop = asyncio.get_event_loop()
        # Run synchronous pipeline in thread pool
        result = await loop.run_in_executor(
            self.executor, 
            lambda: self.classifier(text, candidate_labels)
        )
        
        # Result format: {'sequence': '...', 'labels': [...], 'scores': [...]}
        # Convert to dict {label: score}
        return dict(zip(result['labels'], result['scores']))

classifier = ComplaintClassifier()
