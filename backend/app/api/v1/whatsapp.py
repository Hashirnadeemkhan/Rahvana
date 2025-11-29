# C:\Users\HP\Desktop\arachnie\Arachnie\backend\app\api\v1\whatsapp.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.whatsapp_assistant.main import get_whatsapp_response

router = APIRouter()

class WhatsAppQuery(BaseModel):
    query: str

@router.post("/ask-whatsapp")
async def ask_whatsapp(query: WhatsAppQuery):
    """
    Receives a query for the WhatsApp AI assistant and returns the agent's response.
    """
    if not query.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    try:
        response = await get_whatsapp_response(query.query)
        return {"response": response}
    except Exception as e:
        # Log the exception for debugging
        print(f"Error in /ask-whatsapp endpoint: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
