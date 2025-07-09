from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="PromptPulse", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for frontend
if os.path.exists("../promptpulse-frontend/dist"):
    app.mount("/static", StaticFiles(directory="../promptpulse-frontend/dist"), name="static")

@app.get("/")
async def root():
    return {"message": "PromptPulse API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "PromptPulse"}

@app.get("/api/demo")
async def demo_data():
    return {
        "brands": [
            {"id": 1, "name": "TechCorp", "keywords": ["TechCorp", "tech solutions"]},
            {"id": 2, "name": "EcoGreen", "keywords": ["EcoGreen", "sustainable"]},
            {"id": 3, "name": "FinanceFirst", "keywords": ["FinanceFirst", "banking"]}
        ],
        "mentions": 379,
        "sentiment": {"positive": 65, "neutral": 25, "negative": 10}
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
