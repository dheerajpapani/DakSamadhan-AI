import os
import asyncio
import httpx
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def test_hf():
    print("\n--- Testing Hugging Face API ---")
    api_key = os.getenv("HF_API_KEY")
    headers = {"Authorization": f"Bearer {api_key}"}
    
    # Test Classifier
    url_c = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli"
    payload_c = {"inputs": "My mail is lost", "parameters": {"candidate_labels": ["Lost Article", "Other"]}}
    
    async with httpx.AsyncClient() as client:
        resp = await client.post(url_c, headers=headers, json=payload_c)
        print(f"Classifier Status: {resp.status_code}")
        print(f"Classifier Response: {resp.text[:200]}")
        
    # Test Sentiment
    url_s = "https://router.huggingface.co/hf-inference/models/distilbert-base-uncased-finetuned-sst-2-english"
    async with httpx.AsyncClient() as client:
        resp = await client.post(url_s, headers=headers, json={"inputs": "I am happy"})
        print(f"Sentiment Status: {resp.status_code}")
        print(f"Sentiment Response: {resp.text[:200]}")

async def test_supabase():
    print("\n--- Testing Supabase Connection ---")
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    sb = create_client(url, key)
    
    try:
        # Check if schema/table exists
        res = sb.schema("daksamadhan").table("complaints").select("id").limit(1).execute()
        print("Supabase Connection: SUCCESS")
    except Exception as e:
        print(f"Supabase Connection: FAILED - {e}")

if __name__ == "__main__":
    asyncio.run(test_hf())
    asyncio.run(test_supabase())
