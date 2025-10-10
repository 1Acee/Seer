from pydantic_settings import BaseSettings
from typing import List
import json

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379"
    
    # API Keys
    REDDIT_CLIENT_ID: str = ""
    REDDIT_CLIENT_SECRET: str = ""
    REDDIT_USER_AGENT: str = "Seer/1.0"
    
    YOUTUBE_API_KEY: str = ""
    
    SPOTIFY_CLIENT_ID: str = ""
    SPOTIFY_CLIENT_SECRET: str = ""
    
    # Application
    ENV: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str
    API_V1_PREFIX: str = "/api/v1"
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: str = '["http://localhost:3000"]'
    
    @property
    def allowed_origins_list(self) -> List[str]:
        return json.loads(self.ALLOWED_ORIGINS)
    
    # Scheduler
    SCRAPER_INTERVAL_HOURS: int = 4
    PROCESSING_INTERVAL_HOURS: int = 1
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()