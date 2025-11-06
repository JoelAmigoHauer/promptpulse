"""Database engine and session management."""
from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import (AsyncEngine, AsyncSession, async_sessionmaker,
                                   create_async_engine)

from promptpulse.core.config import get_settings

_settings = get_settings()

_engine: AsyncEngine = create_async_engine(
    _settings.database_url,
    echo=False,
    pool_pre_ping=True,
)
_session_factory = async_sessionmaker(_engine, expire_on_commit=False)


async def check_database_connection() -> None:
    """Verify that the database connection is healthy."""

    async with _engine.connect() as connection:
        await connection.execute(text("SELECT 1"))


@asynccontextmanager
async def get_session() -> AsyncIterator[AsyncSession]:
    """Provide a transactional scope around a series of operations."""

    async with _session_factory() as session:
        yield session


async def dispose_engine() -> None:
    """Dispose of the underlying engine (used during shutdown)."""

    await _engine.dispose()


__all__ = [
    "AsyncSession",
    "check_database_connection",
    "dispose_engine",
    "get_session",
]
