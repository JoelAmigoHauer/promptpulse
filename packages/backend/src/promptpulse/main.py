"""PromptPulse FastAPI application entrypoint."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from promptpulse.api.routes.health import router as health_router
from promptpulse.core.config import get_settings
from promptpulse.infrastructure.database import check_database_connection, dispose_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ensure infrastructure dependencies are ready before serving requests."""

    await check_database_connection()
    yield
    await dispose_engine()


def create_app() -> FastAPI:
    """Instantiate the FastAPI application with configured middleware."""

    settings = get_settings()
    app = FastAPI(title="PromptPulse API", version="0.1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    return app


app = create_app()


__all__ = ["app", "create_app"]
