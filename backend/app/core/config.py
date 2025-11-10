from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

# Paths - FIXED FOR YOUR DIRECTORY STRUCTURE
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # backend folder
DATA_DIR = BASE_DIR / "data"  # backend/data


# Ensure directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)


print(f"\n📂 BASE_DIR: {BASE_DIR}")
print(f"📂 DATA_DIR: {DATA_DIR}")


class Settings:
    # Project
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Arachnie")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    
    # API
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://127.0.0.1:8000")
    API_V1_STR: str = "/api/v1"
    
    # Paths - YAHAN SAHI PATHS DAL DIYE
    DATA_DIR: Path = DATA_DIR
    I130_PDF_PATH: Path = DATA_DIR / "i130.pdf"  # ✅ FIXED
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "https://www.rahvana.com/"
    
    ]
    class Config:
        env_file = ".env"
    # File size limits
    MAX_PDF_SIZE_MB: int = 50
    MAX_JSON_SIZE_MB: int = 10

settings = Settings()