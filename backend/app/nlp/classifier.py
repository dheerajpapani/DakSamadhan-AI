from typing import List, Dict

class ComplaintClassifier:
    def __init__(self):
        # TODO: Load HuggingFace model
        pass

    async def predict(self, text: str) -> Dict[str, float]:
        """
        Predict the category of the complaint.
        Returns dictionary of category -> confidence
        """
        # Placeholder
        return {"delivery_delay": 0.8, "damaged": 0.1, "other": 0.1}

classifier = ComplaintClassifier()
