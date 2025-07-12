from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str = "postgresql://promptpulse:promptpulse123@localhost/promptpulse"
    redis_url: str = "redis://localhost:6379"
    secret_key: str = "your_secret_key_here_change_in_production"
    openai_api_key: Optional[str] = None
    google_ai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    openrouter_api_key: str = ""
    debug: bool = False
    environment: str = "production"
    host: str = "0.0.0.0"
    port: int = 8000
    celery_broker_url: str = "redis://localhost:6379/0"
    celery_result_backend: str = "redis://localhost:6379/0"
    
    class Config:
        env_file = ".env"
        extra = "forbid"

settings = Settings()
