import os
from dotenv import load_dotenv
from agents import function_tool
from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
MODEL_NAME = os.getenv("MODEL_NAME")

# Lazy load encoder
ENCODER = None
def get_encoder():
    global ENCODER
    if ENCODER is None:
        print("⚡ Loading SentenceTransformer model...")
        ENCODER = SentenceTransformer(MODEL_NAME)
    return ENCODER

# Lazy load Qdrant client
CLIENT = None
def get_qdrant_client():
    global CLIENT
    if CLIENT is None:
        CLIENT = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
        # Ensure collection exists
        collections = [c.name for c in CLIENT.get_collections().collections]
        if COLLECTION_NAME not in collections:
            emb_dim = get_encoder().get_sentence_embedding_dimension()
            CLIENT.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=models.VectorParams(size=emb_dim, distance=models.Distance.COSINE)
            )
    return CLIENT

@function_tool
def search_chat_history(query: str) -> str:
    try:
        encoder = get_encoder()
        client = get_qdrant_client()

        query_vector = encoder.encode(query).tolist()
        search_result = client.query_points(collection_name=COLLECTION_NAME, query=query_vector, limit=8, score_threshold=0.35).points

        if not search_result:
            return "NO_RELEVANT_DATA_FOUND"

        formatted = []
        for hit in search_result:
            start_id = hit.id
            if isinstance(start_id, int):
                window_ids = list(range(start_id, start_id + 5))
                points = client.retrieve(collection_name=COLLECTION_NAME, ids=window_ids)
                points.sort(key=lambda x: x.id)
                block = []
                for p in points:
                    payload = p.payload or {}
                    sender = payload.get("sender", "Unknown")
                    msg = payload.get("message", "")
                    block.append(f"{sender}: {msg}")
                formatted.append("\n".join(block))

        if not formatted:
            return "NO_RELEVANT_DATA_FOUND"

        return "\n\n--- Conversation Snippet ---\n".join(formatted)

    except Exception as e:
        return "NO_RELEVANT_DATA_FOUND"
