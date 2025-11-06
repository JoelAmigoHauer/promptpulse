"""Application configuration utilities."""
from functools import lru_cache
from typing import List

from pydantic import AliasChoices, Field
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_prefix="PROMPTPULSE_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    environment: str = Field(default="development", description="Current deployment environment tag.")
    database_url: str = Field(
        default="postgresql+asyncpg://promptpulse:promptpulse123@localhost:5432/promptpulse",
        description="SQLAlchemy-compatible database URL.",
        validation_alias=AliasChoices(
            "PROMPTPULSE_DATABASE_URL",
            "DATABASE_URL",
            "POSTGRES_PRISMA_URL",
            "POSTGRES_URL",
        ),
    )
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL used for caching or task coordination.",
        validation_alias=AliasChoices("PROMPTPULSE_REDIS_URL", "REDIS_URL"),
    )
    cors_allow_origins: List[str] = Field(
        default_factory=lambda: ["http://localhost:5173"],
        description="List of origins allowed by the CORS middleware.",
    )

    @model_validator(mode="before")
    @classmethod
    def _split_origins(cls, values: dict) -> dict:
        origins = values.get("cors_allow_origins")
        if isinstance(origins, str):
            values["cors_allow_origins"] = [origin.strip() for origin in origins.split(",") if origin.strip()]
        return values


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached Settings instance."""

    return Settings()  # type: ignore[call-arg]


__all__ = ["Settings", "get_settings"]
