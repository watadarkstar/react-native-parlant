import asyncio
import parlant.sdk as p
from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

async def main():
  async with p.Server() as server:
    agent = await server.create_agent(
        name="Car Guy",
        description="You work at a car dealership",
    )

    await agent.create_guideline(
        condition="when the user greets you",
        action="Respond warmly and invite them to ask about cars.",
    )

asyncio.run(main())