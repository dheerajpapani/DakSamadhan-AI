from typing import Dict
from transformers import pipeline
import asyncio
from concurrent.futures import ThreadPoolExecutor

class SentimentAnalyzer:
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=1)
        self.analyzer = None

    def _load_model(self):
        if not self.analyzer:
            print("Loading Sentiment Model...")
            # Explicitly using distilbert for speed
            self.analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
            print("Sentiment Model Loaded.")

    async def analyze(self, text: str) -> Dict[str, float]:
        """
        Analyze sentiment of the text.
        Returns sentiment score (-1 to 1) or labels.
        """
        if not self.analyzer:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(self.executor, self._load_model)

        loop = asyncio.get_event_loop()
        result_list = await loop.run_in_executor(
            self.executor, 
            lambda: self.analyzer(text)
        )
        
        # Result format: [{'label': 'POSITIVE', 'score': 0.99}]
        result = result_list[0]
        
        label = result['label'].lower() # 'positive' or 'negative'
        score = result['score']
        
        # Normalize score to be somewhat aligned with our previous logic if needed,
        # but returning raw label/score is fine.
        return {"sentiment": label, "score": score}

analyzer = SentimentAnalyzer()
