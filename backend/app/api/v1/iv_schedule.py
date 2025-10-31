from fastapi import APIRouter
from app.services.scraper_service import get_iv_schedule_data, filter_iv_data

router = APIRouter()

@router.get("/iv-schedule")
async def iv_schedule(city: str = "", category: str = ""):
    data = await get_iv_schedule_data()
    if city or category:
        data = filter_iv_data(data, city, category)
    return {"data": data, "total": len(data)}