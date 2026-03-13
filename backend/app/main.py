from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import complaints

app = FastAPI(
    title="DakSamadhan-AI API",
    description="AI-powered Complaint Management System API",
    version="0.1.0"
)

import os

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,*").split(",")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Flexible setting
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(complaints.router, prefix="/api/complaints", tags=["complaints"])

@app.get("/")
async def root():
    return {"message": "DakSamadhan-AI API is running", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
