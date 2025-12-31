# WhatsApp Database Setup Script - Lazy loading for memory efficiency
# This script is meant to run LOCALLY for uploading chat data to Qdrant
import re
import pandas as pd
import os
from qdrant_client import QdrantClient, models
from qdrant_client.http.models import PointStruct

# Try to import config - if not available, use environment variables
try:
    from config import QDRANT_URL, QDRANT_API_KEY, COLLECTION_NAME, MODEL_NAME, WHATSAPP_CHAT_FILE_PATH
except ImportError:
    from dotenv import load_dotenv
    load_dotenv()
    QDRANT_URL = os.getenv("QDRANT_URL")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
    COLLECTION_NAME = os.getenv("COLLECTION_NAME", "whatsapp_chat_history")
    MODEL_NAME = os.getenv("MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
    WHATSAPP_CHAT_FILE_PATH = os.getenv("WHATSAPP_CHAT_FILE_PATH", "chat_history.txt")

# --- CONFIG ---
# Default dimension for all-MiniLM-L6-v2
VECTOR_DIMENSION = 384
BATCH_SIZE = 20
UPLOAD_TIMEOUT = 150


def parse_whatsapp_chat(file_path):
    """Parse WhatsApp chat export file."""
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        return pd.DataFrame()

    with open(file_path, 'r', encoding='utf-8') as file:
        chat_data = file.read()

    pattern = re.compile(r'(\d{1,2}/\d{1,2}/\d{2,4}, \d{1,2}:\d{2}\s?[AP]M) - ([^:]+): (.+)')
    matches = pattern.findall(chat_data)

    if not matches:
        print("Warning: Regex failed.")
        return pd.DataFrame()

    df = pd.DataFrame(matches, columns=['timestamp', 'sender', 'message'])
    df = df[~df['message'].str.contains("<Media omitted>", na=False)]
    df.reset_index(drop=True, inplace=True)
    return df


def setup_qdrant():
    """Setup Qdrant collection."""
    client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        timeout=UPLOAD_TIMEOUT
    )

    collections = client.get_collections().collections
    collection_exists = any(c.name == COLLECTION_NAME for c in collections)

    if not collection_exists:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(
                size=VECTOR_DIMENSION,
                distance=models.Distance.COSINE
            ),
        )
        print(f"Collection '{COLLECTION_NAME}' created.")
    else:
        print(f"Collection '{COLLECTION_NAME}' already exists.")

    return client


def generate_and_upsert_embeddings(client, df):
    """Generate embeddings and upload to Qdrant - LAZY loading."""
    if df.empty:
        return

    # Check how many already uploaded
    try:
        collection_info = client.get_collection(COLLECTION_NAME)
        existing_count = collection_info.points_count
        print(f"Already uploaded: {existing_count} points")
    except:
        existing_count = 0
        print("Starting fresh upload")

    # Skip already uploaded rows
    if existing_count > 0:
        df = df.iloc[existing_count:]
        print(f"Resuming from point {existing_count}")

    if df.empty:
        print("All data already uploaded!")
        return

    # LAZY LOAD - only import when needed
    print(f"Loading embedding model: {MODEL_NAME} ...")
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer(MODEL_NAME)
    print("Model loaded!")

    total_remaining = len(df)
    batch = []

    for idx, row in df.iterrows():
        text = row["message"]
        embedding = model.encode(text, convert_to_tensor=False)

        batch.append(
            PointStruct(
                id=idx,
                vector=embedding,
                payload={
                    "message": text,
                    "sender": row["sender"],
                    "timestamp": row["timestamp"]
                }
            )
        )

        if len(batch) >= BATCH_SIZE:
            try:
                client.upsert(collection_name=COLLECTION_NAME, points=batch)
            except Exception as e:
                print("Error during upload, retrying...", e)
                client.upsert(collection_name=COLLECTION_NAME, points=batch)

            print(f"Processed {idx+1} total points")
            batch = []

    if batch:
        client.upsert(collection_name=COLLECTION_NAME, points=batch)
        print("Final batch uploaded.")


def main():
    print("=== STARTING DATABASE SYNC ===")

    df = parse_whatsapp_chat(WHATSAPP_CHAT_FILE_PATH)

    if df.empty:
        print("Chat file parsing failed.")
        return

    print(f"Total messages in file: {len(df)}")

    qdrant = setup_qdrant()
    generate_and_upsert_embeddings(qdrant, df)

    print("=== DONE: All data uploaded successfully ===")


if __name__ == "__main__":
    main()
