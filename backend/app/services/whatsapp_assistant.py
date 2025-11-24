
import os
from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel, set_tracing_disabled
from supabase import create_client, Client
from backend.app.core.config import settings

# Disable tracing for the agent SDK
set_tracing_disabled(disabled=True)

# 1. Initialize Supabase client
# We will use this later to fetch data from your 'whatsapp_knowledge' table
try:
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    print("✅ Supabase client initialized successfully.")
except Exception as e:
    print(f"🔥 Failed to initialize Supabase client: {e}")
    supabase = None

# 2. Setup the Gemini Provider and Model
# This uses the GEMINI_KEY from your .env file
provider = AsyncOpenAI(
    api_key=settings.GEMINI_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

model = OpenAIChatCompletionsModel(
    model="gemini-1.5-flash",  # Using gemini-1.5-flash as it's a newer and better model
    openai_client=provider
)

# 3. Define the AI Agent's Instructions
# These are the rules you provided earlier
agent_instructions = """
You are an AI assistant answering questions based on information from approved WhatsApp groups.

Your rules are:
- Provide a short summary of the topic.
- Only use useful, factual, time-based, or situation-based information.
- You are ONLY allowed to use the information provided to you from the knowledge base.
- Never reveal any personal details or identify who wrote the messages.
- Always start your reply with: "Yes, according to the latest updates shared in the group,".
"""

# 4. Create the Agent
whatsapp_agent = Agent(
    name="WhatsApp Knowledge Assistant",
    instructions=agent_instructions,
    model=model
)

# 5. Create a function to run the agent
async def get_answer(user_question: str):
    """
    This function takes a user's question, retrieves relevant data from Supabase (in the future),
    and returns an answer from the AI agent.
    """
    
    # --- RAG Implementation (Future) ---
    # In Phase 2, we will add code here to:
    # 1. Convert the user_question into an embedding.
    # 2. Query the 'whatsapp_knowledge' table in Supabase to find relevant text chunks.
    # 3. Pass those chunks as context to the agent.
    # For now, we are not passing any external context.
    # ------------------------------------

    print(f"🏃 Running agent with question: {user_question}")
    
    # Call the agent using the Runner
    result = await Runner.run(
        starting_agent=whatsapp_agent,
        input=user_question
    )

    print(f"✅ Agent finished with result: {result.final_output}")
    
    return result.final_output

