# C:\Users\HP\Desktop\arachnie\Arachnie\backend\app\services\whatsapp_assistant\main.py
import os
import asyncio
from dotenv import load_dotenv

# OpenAI Agents SDK Imports
from agents import (
    Agent,
    Runner,
    OpenAIChatCompletionsModel,
    AsyncOpenAI,
    set_tracing_disabled,
    ModelSettings,
    SQLiteSession,
)

# --- FIX 1: Absolute import (app ke andar se tool import kar rahe hain) ---
from app.services.whatsapp_assistant.tools import search_chat_history


# ==================== ENVIRONMENT SETUP ====================
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise EnvironmentError("GEMINI_API_KEY not found in environment variables!")


# ==================== PROVIDER & MODEL SETUP ====================
provider = AsyncOpenAI(
    api_key=GEMINI_API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

model = OpenAIChatCompletionsModel(
    model="gemini-1.5-flash",          # ya "gemini-1.5-pro" jo bhi latest ho
    openai_client=provider,
)

# Tracing off kar di (optional, production mein useful hota hai debug ke liye)
set_tracing_disabled(disabled=True)


# ==================== WHATSAPP AGENT DEFINITION ====================
whatsapp_agent = Agent(
    name="WhatsApp Analyst",
    instructions="""
You are a friendly WhatsApp Assistant. Tum user ke saath natural Hindi/English mix mein baat karo.

Rules:
1. Pehle hamesha search_chat_history tool use karo.
2. Agar history mein relevant data mila to usi se natural jawab do.
   → Kabhi bhi "chat history", "database", "previous messages" jaise words mat bolna.
3. Agar "NO_RELEVANT_DATA_FOUND" aaya to apne general knowledge se naturally jawab do.
4. Helpful, concise aur dostana bano. Past conversations yaad rakho.
""",
    model=model,
    tools=[search_chat_history],
    model_settings=ModelSettings(
        temperature=0.3,
        max_tokens=500,
        tool_choice="required",   # Force karta hai tool use karne ko
    ),
)


# ==================== SESSION MEMORY (Conversation History) ====================
session = SQLiteSession("whatsapp_conversation_db")


# ==================== MAIN API FUNCTION ====================
async def get_whatsapp_response(user_query: str) -> str:
    """
    Yeh function FastAPI ya kisi bhi API endpoint se call hogi.
    Ek user query lega → Agent ko dega → Final answer string return karega.
    """
    try:
        result = await Runner.run(
            starting_agent=whatsapp_agent,
            input=user_query,
            session=session,
        )

        # Final output nikalte hain
        if hasattr(result, "final_output") and result.final_output:
            return result.final_output.strip()
        else:
            return str(result).strip()

    except Exception as e:
        print(f"[ERROR] Agent generation failed: {e}")
        return "Sorry, kuch technical issue aa gaya. Thodi der baad try karo! 😔"


# ==================== TESTING CLI (Direct script run karne ke liye) ====================
if __name__ == "__main__":
    async def test_cli():
        print("\n🤖 WhatsApp Agent Testing Mode (type 'exit' or 'quit' to stop)\n")
        while True:
            try:
                user_input = input("You: ").strip()
                if user_input.lower() in {"exit", "quit", "bye"}:
                    print("Bye bye! 👋")
                    break
                if not user_input:
                    continue

                response = await get_whatsapp_response(user_input)
                print(f"AI: {response}\n")

            except KeyboardInterrupt:
                print("\n\nBye! Take care � ya")
                break
            except Exception as e:
                print(f"Unexpected error: {e}")

    # Run the CLI loop
    asyncio.run(test_cli())