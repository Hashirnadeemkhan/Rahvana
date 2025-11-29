# C:\Users\HP\Desktop\arachnie\Arachnie\backend\app\services\whatsapp_assistant\tools.py

import os
import traceback
from dotenv import load_dotenv # <--- ADDED: To load environment variables
from agents import function_tool
from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer

# Load .env variables inside the tools module
load_dotenv() 

# --- Retrieve variables directly from environment ---
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY") 
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
MODEL_NAME = os.getenv("MODEL_NAME")
# ----------------------------------------------------

# --- Connect to Qdrant & Embedding Model (Silent) ---
# NOTE: Ab yeh code sahi variables use karega
qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    timeout=60
)

encoder = SentenceTransformer(MODEL_NAME)

# Ensure collection exists
try:
    collections = [c.name for c in qdrant_client.get_collections().collections]
    if COLLECTION_NAME not in collections:
        emb_dim = encoder.get_sentence_embedding_dimension()
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(
                size=emb_dim,
                distance=models.Distance.COSINE
            )
        )
except:
    pass  # silent on purpose for production


# --- Function Tool for Chat Search (Silent) ---
@function_tool
def search_chat_history(query: str) -> str:
    """
    Production-ready semantic search for chat history.
    Returns summarized contextual blocks without any debug logs.
    """
    try:
        clean_query = " ".join(query.strip().split())
        query_vector = encoder.encode(clean_query).tolist()

        search_result = qdrant_client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            limit=8,
            score_threshold=0.35
        ).points

        if not search_result:
            return "NO_RELEVANT_DATA_FOUND"

        formatted_conversations = []

        for hit in search_result:
            start_id = hit.id

            if isinstance(start_id, int):
                window_ids = list(range(start_id, start_id + 5))

                try:
                    points = qdrant_client.retrieve(
                        collection_name=COLLECTION_NAME,
                        ids=window_ids
                    )

                    points.sort(key=lambda x: x.id)

                    block = []
                    for p in points:
                        payload = p.payload or {}
                        sender = payload.get("sender", "Unknown")
                        msg = payload.get("message", "")
                        block.append(f"{sender}: {msg}")

                    formatted_conversations.append("\n".join(block))

                except:
                    continue

        if not formatted_conversations:
            return "NO_RELEVANT_DATA_FOUND"

        return "\n\n--- Conversation Snippet ---\n".join(formatted_conversations)

    except Exception as e:
        # print(f"Search Error: {e}") # Debugging ke liye hata diya
        return "NO_RELEVANT_DATA_FOUND"