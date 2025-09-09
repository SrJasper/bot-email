import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ALLOW_ORIGINS: list[str] = ["*"]  # em produção, restringir

settings = Settings()
