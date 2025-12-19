from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="DakSamadhan-AI API",
    description="AI-powered Complaint Management System API",
    version="0.1.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "DakSamadhan-AI API is running", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
