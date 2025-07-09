from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/login")
async def login(db: Session = Depends(get_db)):
    # Demo login - returns mock user data
    return {
        "access_token": "demo_token_12345",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "email": "demo@promptpulse.com",
            "full_name": "Demo User"
        }
    }

@router.post("/register")
async def register(db: Session = Depends(get_db)):
    return {"message": "Registration successful"}

@router.get("/me")
async def get_current_user():
    return {
        "id": 1,
        "email": "demo@promptpulse.com",
        "full_name": "Demo User"
    }
