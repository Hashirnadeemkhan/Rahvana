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

# --- FIX 1: Absolute import (importing tool from inside app) ---
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
    model="gemini-2.5-flash",          # or "gemini-1.5-pro", whichever is latest
    openai_client=provider,
)

# Disable tracing (optional, useful for debugging in production)
set_tracing_disabled(disabled=True)


# ==================== WHATSAPP AGENT DEFINITION ====================
whatsapp_agent = Agent(
    name="WhatsApp Analyst",
    instructions="""
You are a friendly WhatsApp Assistant. Follow these rules carefully:

1. Always start by using the `search_chat_history` tool.
2. If relevant data is found in history, respond naturally based on it.
   → Never mention "chat history", "database", or "previous messages".
3. If "NO_RELEVANT_DATA_FOUND" is returned, answer naturally using your general knowledge.
4. Be helpful, concise, and friendly. Remember past conversations.
5. Language Handling:
   - Mirror the user's language by default:
     • English → respond in English
     • Roman Urdu → respond in Roman Urdu
     • Urdu (Arabic script) → respond in Urdu
     • Any other language → respond in that same language naturally
   - However, detect if the user **wants to switch to English or another language**. Respect their preference and respond in that language while keeping the tone, style, and context natural.
   - Always understand the user’s **tone, intent, and emotional cues** to adjust your responses accordingly.
6. Maintain a natural, friendly, and conversational style. Be context-aware and helpful.
""",
    model=model,
    tools=[search_chat_history],
    model_settings=ModelSettings(
        temperature=0.3,
        max_tokens=500,
        tool_choice="required",   # Forces the tool to be used
    ),
)


# ==================== SESSION MEMORY (Conversation History) ====================
session = SQLiteSession("whatsapp_conversation_db")


# ==================== MAIN API FUNCTION ====================
async def get_whatsapp_response(user_query: str) -> str:
    """
    This function can be called from FastAPI or any API endpoint.
    It takes a user query → sends it to the Agent → returns the final answer as a string.
    """
    try:
        result = await Runner.run(
            starting_agent=whatsapp_agent,
            input=user_query,
            session=session,
        )

        # Extract the final output
        if hasattr(result, "final_output") and result.final_output:
            return result.final_output.strip()
        else:
            return str(result).strip()

    except Exception as e:
        print(f"[ERROR] Agent generation failed: {e}")
        return "Sorry, a technical issue occurred. Please try again later! 😔"


# ==================== TESTING CLI (Run script directly) ====================
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
                print("\n\nBye! Take care 👋")
                break
            except Exception as e:
                print(f"Unexpected error: {e}")

    # Run the CLI loop
    asyncio.run(test_cli())
