from pathlib import Path
import os
from dotenv import load_dotenv
from typing import List

# .env file load karein (Yeh .env.local/backend/.env dono ko dhoondh lega)
load_dotenv()

# Paths - FIXED FOR YOUR DIRECTORY STRUCTURE
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"

# Ensure directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Print statements for debugging
print(f"\n📂 BASE_DIR: {BASE_DIR}")
print(f"📂 DATA_DIR: {DATA_DIR}")


class Settings:
    # Project
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Arachnie")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    
    # API
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://127.0.0.1:8000")
    API_V1_STR: str = "/api/v1"
    
    # Paths
    DATA_DIR: Path = DATA_DIR
    I130_PDF_PATH: Path = BASE_DIR / "pdfs" / "i130.pdf"
    
    # --- [ RAG KEYS ADD KI GAYI HAIN - NO EFFECT ON EXISTING CODE ] ---
    
    # AI/RAG Settings (Gemini Key for server-side processing)
    # Yeh sirf RAG ingestion aur API route use karega, baki code ko chhoota nahi hai.
    GEMINI_KEY: str = os.getenv("GEMINI_KEY", "") 
    
    # Supabase/Vector DB Settings (For knowledge base connection)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "") 

    # --- --- --- --- --- --- --- ---

    # CORS - NOTE: Yahan value .env se RAW string ke roop mein load hogi
    CORS_ORIGINS_RAW: str = os.getenv("CORS_ORIGINS", "")
    
    # File size limits
    MAX_PDF_SIZE_MB: int = 50
    MAX_JSON_SIZE_MB: int = 10
    
    # FIX: Yeh method raw string ko Python List mein badlega
    def get_cors_origins(self) -> List[str]:
        if self.CORS_ORIGINS_RAW:
            # Square brackets aur quotes hatayen aur comma se split karein
            cleaned_raw = self.CORS_ORIGINS_RAW.replace('[', '').replace(']', '').replace('"', '').replace("'", "")
            return [origin.strip() for origin in cleaned_raw.split(',') if origin.strip()]
        return []

settings = Settings()