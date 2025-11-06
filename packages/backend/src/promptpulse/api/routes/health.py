"""Health check endpoints."""
from fastapi import APIRouter

from promptpulse.infrastructure.database import check_database_connection

router = APIRouter(prefix="", tags=["health"])


@router.get("/health", summary="Service health status")
async def read_health() -> dict[str, str]:
    """Return a simple health payload after verifying the database connection."""

    await check_database_connection()
    return {"status": "ok"}


__all__ = ["router"]
