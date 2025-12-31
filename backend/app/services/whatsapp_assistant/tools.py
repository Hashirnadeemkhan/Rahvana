# WhatsApp Assistant Tools - Lazy loading for memory efficiency
import os
import traceback
from typing import List, Optional
from functools import lru_cache

from dotenv import load_dotenv

# External libraries
from agents import function_tool
from qdrant_client import QdrantClient, models

# Load environment variables (safe to call multiple times)
load_dotenv()

# ==================== CONFIGURATION ====================
QDRANT_URL: Optional[str] = os.getenv("QDRANT_URL")
QDRANT_API_KEY: Optional[str] = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME: str = os.getenv("COLLECTION_NAME", "whatsapp_chat_history")
MODEL_NAME: str = os.getenv("MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")

# Critical check — agar Qdrant nahi mila to fail fast
if not QDRANT_URL:
    raise EnvironmentError("QDRANT_URL is required in .env file")
if not QDRANT_API_KEY:
    raise EnvironmentError("QDRANT_API_KEY is required in .env file")

# ==================== GLOBAL CLIENTS (Module-level singletons) ====================
qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    timeout=60,
)

# ==================== LAZY MODEL LOADING ====================
# Model is loaded only when WhatsApp search is actually used
# This saves ~500MB RAM on startup

_encoder = None  # Cached model instance

def _get_encoder():
    """Lazy load the embedding model - only loads when needed."""
    global _encoder
    if _encoder is None:
        print(f"Loading embedding model: {MODEL_NAME} ...")
        from sentence_transformers import SentenceTransformer
        _encoder = SentenceTransformer(MODEL_NAME)
        print(f"Model loaded successfully! Embedding dim: {_encoder.get_sentence_embedding_dimension()}")
    return _encoder


def _get_vector_dim() -> int:
    """Get vector dimension from model."""
    return _get_encoder().get_sentence_embedding_dimension()


# ==================== ENSURE COLLECTION EXISTS ====================
def _ensure_collection_exists() -> None:
    """Idempotent function — collection banayega agar nahi hai"""
    try:
        collections = qdrant_client.get_collections()
        existing_names = [c.name for c in collections.collections]

        if COLLECTION_NAME not in existing_names:
            # Only try to get dimension if we have env configured
            try:
                dim = _get_vector_dim()
                print(f"Creating collection '{COLLECTION_NAME}' with vector size {dim}...")
                qdrant_client.create_collection(
                    collection_name=COLLECTION_NAME,
                    vectors_config=models.VectorParams(
                        size=dim,
                        distance=models.Distance.COSINE,
                    ),
                )
                print(f"Collection '{COLLECTION_NAME}' created successfully.")
            except Exception as dim_error:
                print(f"Warning: Could not get model dimension: {dim_error}")
                # Create with default MiniLM dimension
                qdrant_client.create_collection(
                    collection_name=COLLECTION_NAME,
                    vectors_config=models.VectorParams(
                        size=384,  # all-MiniLM-L6-v2 default
                        distance=models.Distance.COSINE,
                    ),
                )
    except Exception as e:
        print(f"Warning: Could not verify/create collection: {e}")

# Run once on import (Qdrant check, not model load)
_ensure_collection_exists()


# ==================== MAIN TOOL: Semantic Chat History Search ====================
@function_tool
def search_chat_history(query: str) -> str:
    """
    Semantically searches past WhatsApp chat history using Qdrant + Sentence Transformers.

    Returns:
        - Relevant conversation snippets (natural text blocks)
        - "NO_RELEVANT_DATA_FOUND" if nothing useful is found
    """
    if not query or not query.strip():
        return "NO_RELEVANT_DATA_FOUND"

    try:
        # Lazy load model only when this function is called
        encoder = _get_encoder()

        # Clean and encode query
        clean_query = query.strip()
        query_vector = encoder.encode(clean_query, normalize_embeddings=True).tolist()

        # Semantic search in Qdrant
        search_results = qdrant_client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            limit=10,
            score_threshold=0.32,
        ).points

        if not search_results:
            return "NO_RELEVANT_DATA_FOUND"

        # Collect relevant message windows
        formatted_blocks: List[str] = []
        processed_ids = set()

        for hit in search_results:
            center_id = hit.id
            if not isinstance(center_id, int):
                continue

            # Create a window of ±2 messages around the hit
            window_ids = list(range(center_id - 2, center_id + 3))
            try:
                points = qdrant_client.retrieve(
                    collection_name=COLLECTION_NAME,
                    ids=window_ids,
                    with_payload=True,
                )

                # Sort by ID to maintain chronological order
                points.sort(key=lambda x: x.id if isinstance(x.id, int) else 0)

                block_lines = []
                for p in points:
                    if p.id in processed_ids:
                        continue
                    processed_ids.add(p.id)

                    payload = p.payload or {}
                    sender = payload.get("sender", "Unknown")
                    message = payload.get("message", "").strip()

                    if message:
                        block_lines.append(f"{sender}: {message}")

                if block_lines:
                    formatted_blocks.append("\n".join(block_lines))

            except Exception:
                continue

        # Deduplicate blocks and join
        unique_blocks = []
        seen = set()
        for block in formatted_blocks:
            if block not in seen:
                seen.add(block)
                unique_blocks.append(block)

        if not unique_blocks:
            return "NO_RELEVANT_DATA_FOUND"

        return "\n\n--- Conversation Snippet ---\n".join(unique_blocks)

    except Exception as e:
        print(f"[search_chat_history] Unexpected error: {e}")
        traceback.print_exc()
        return "NO_RELEVANT_DATA_FOUND"
