import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from app.services.scraper_service import get_iv_schedule_data

async def main():
    print("Starting scraper...")
    data = await get_iv_schedule_data()
    print(f"Done! {len(data)} records saved to backend/data/iv_data.json")

if __name__ == "__main__":
    asyncio.run(main())