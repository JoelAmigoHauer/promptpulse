from fastapi import APIRouter

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/login")
async def login():
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
async def register():
    return {"message": "Registration successful"}

@router.get("/me")
async def get_current_user():
    return {
        "id": 1,
        "email": "demo@promptpulse.com",
        "full_name": "Demo User"
    }
