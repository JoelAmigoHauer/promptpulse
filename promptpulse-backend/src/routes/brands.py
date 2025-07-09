from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(prefix="/api/brands", tags=["brands"])

@router.get("/")
async def get_brands(db: Session = Depends(get_db)):
    return [
        {
            "id": 1,
            "name": "TechCorp",
            "description": "Technology solutions company",
            "keywords": ["TechCorp", "tech solutions", "innovation"],
            "mentions": 156,
            "sentiment": {"positive": 70, "neutral": 20, "negative": 10}
        },
        {
            "id": 2,
            "name": "EcoGreen",
            "description": "Sustainable products company",
            "keywords": ["EcoGreen", "sustainable", "eco-friendly"],
            "mentions": 89,
            "sentiment": {"positive": 80, "neutral": 15, "negative": 5}
        },
        {
            "id": 3,
            "name": "FinanceFirst",
            "description": "Financial services provider",
            "keywords": ["FinanceFirst", "banking", "finance"],
            "mentions": 134,
            "sentiment": {"positive": 60, "neutral": 30, "negative": 10}
        }
    ]

@router.post("/")
async def create_brand(db: Session = Depends(get_db)):
    return {"message": "Brand created successfully"}

@router.get("/{brand_id}")
async def get_brand(brand_id: int, db: Session = Depends(get_db)):
    return {
        "id": brand_id,
        "name": "Sample Brand",
        "description": "Sample brand description",
        "keywords": ["sample", "brand"],
        "mentions": 50,
        "sentiment": {"positive": 65, "neutral": 25, "negative": 10}
    }
