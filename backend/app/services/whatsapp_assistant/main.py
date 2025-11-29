# C:\Users\HP\Desktop\arachnie\Arachnie\backend\app\services\whatsapp_assistant\main.py

import os
import asyncio
from dotenv import load_dotenv

# OpenAI Agents SDK Imports
from agents import Agent, Runner, OpenAIChatCompletionsModel, AsyncOpenAI, set_tracing_disabled, ModelSettings,SQLiteSession

# --- FIX 1: Correct Import Path (Absolute Import) ---
# Hum poora path bata rahe hain taake Python confuse na ho
from app.services.whatsapp_assistant.tools import search_chat_history

# Load Keys
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    # Fallback checking if user hasn't set it in env yet
    print("Warning: GEMINI_API_KEY not found in environment variables")

# 1. Setup Provider
provider = AsyncOpenAI(
    api_key=api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# 2. Setup Model Wrapper
model = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash", # Recommended model
    openai_client=provider
)

set_tracing_disabled(disabled=True)

# 3. Define the Agent
whatsapp_agent = Agent(
    name="WhatsApp Analyst",
    instructions="""
    You are a WhatsApp Assistant designed to answer users naturally.
    
    1. ALWAYS use `search_chat_history` first.
    2. If found, answer naturally. DO NOT mention "chat history" or "database".
    3. If "NO_RELEVANT_DATA_FOUND", answer using general knowledge naturally.
    4. Be helpful, concise, and friendly and remember past conversations and history.
    """,
    model=model,
    tools=[search_chat_history],
    model_settings=ModelSettings(
        temperature=0.3, 
        max_tokens=500,
        tool_choice="required"
    )
)
# Create session memory
session = SQLiteSession("my_first_conversation")

# --- FIX 2: Create the function specifically for the API ---
async def get_whatsapp_response(user_query: str) -> str:
    """
    Ye function API call karegi. Ye loop mein nahi phansega.
    Ek sawal lega -> Agent ko dega -> Jawab return karega.
    """
    try:
        # Runner ko sirf ek turn ke liye chalayenge
        result = await Runner.run(starting_agent=whatsapp_agent, input=user_query, session=session)
        
        # Result se final text nikalna
        if hasattr(result, 'final_output'):
            return result.final_output
        else:
            return str(result)
            
    except Exception as e:
        print(f"Error in Agent generation: {e}")
        return "Sorry, I encountered an error while processing your request."

# --- Optional: Testing ke liye CLI block (Jab direct run karein) ---
if __name__ == "__main__":
    async def test_loop():
        print("\n🤖 Testing Mode (Type 'exit' to quit)\n")
        while True:
            q = input("You: ")
            if q.lower() in ["exit", "quit"]: break
            res = await get_whatsapp_response(q)
            print(f"AI: {res}\n")
    
    asyncio.run(test_loop())