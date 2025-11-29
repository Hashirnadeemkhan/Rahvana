# C:\Users\HP\Desktop\whatsappAI\config.py
from dotenv import load_dotenv
import os

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")  # Yeh line add ki hai
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
MODEL_NAME = os.getenv("MODEL_NAME")
WHATSAPP_CHAT_FILE_PATH = os.getenv("WHATSAPP_CHAT_FILE_PATH")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")