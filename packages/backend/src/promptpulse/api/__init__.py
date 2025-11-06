"""API package exposing FastAPI routers."""

from promptpulse.api.routes.health import router as health_router

__all__ = ["health_router"]
