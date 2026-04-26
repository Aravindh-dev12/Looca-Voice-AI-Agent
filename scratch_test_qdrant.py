import os
import sys

# Add backend directory to path
sys.path.append(os.path.abspath("backend"))

try:
    from qdrant_client import QdrantClient
    from app.config import get_settings
    settings = get_settings()
    
    print(f"Connecting to: {settings.QDRANT_URL}")
    client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY or None, check_compatibility=False)
    
    print(f"Client type: {type(client)}")
    print(f"Has search: {hasattr(client, 'search')}")
    # print(f"Methods: {dir(client)}")
    
    from app.qdrant_service import search
    
    import asyncio
    async def test_search():
        print("Testing search...")
        results = await search("services", "hello")
        print(f"Results: {results}")

    asyncio.run(test_search())
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
