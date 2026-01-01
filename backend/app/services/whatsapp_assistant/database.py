# C:\Users\HP\Desktop\whatsappAI\database.py
import re
import pandas as pd
import os
from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer
from config import QDRANT_URL, QDRANT_API_KEY, COLLECTION_NAME, MODEL_NAME, WHATSAPP_CHAT_FILE_PATH
from qdrant_client.http.models import PointStruct

# --- CONFIG (Correct for BGE-M3) ---
VECTOR_DIMENSION = 1024
BATCH_SIZE = 20     # safe batch
UPLOAD_TIMEOUT = 150

def parse_whatsapp_chat(file_path):
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
        print(f"Collection '{COLLECTION_NAME}' already exists. (NOT recreating, safe to continue)")

    return client


def generate_and_upsert_embeddings(client, df):
    if df.empty:
        return

    # CHECK HOW MANY ALREADY UPLOADED
    try:
        collection_info = client.get_collection(COLLECTION_NAME)
        existing_count = collection_info.points_count
        print(f"✓ Already uploaded: {existing_count} points")
    except:
        existing_count = 0
        print("✓ Starting fresh upload")
    
    # SKIP THOSE ROWS
    if existing_count > 0:
        df = df.iloc[existing_count:]  # Start from next row
        print(f"⚡ Resuming from point {existing_count}")
    
    if df.empty:
        print("✓ All data already uploaded!")
        return

    print("Loading embedding model... (BGE-M3 2.2GB)")
    model = SentenceTransformer(MODEL_NAME)

    total_remaining = len(df)
    batch = []

    for idx, row in df.iterrows():  # idx will be the ORIGINAL index
        text = row["message"]
        embedding = model.encode(text, convert_to_tensor=False)

        batch.append(
            PointStruct(
                id=idx,  # Uses original index (21691, 21692, etc.)
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