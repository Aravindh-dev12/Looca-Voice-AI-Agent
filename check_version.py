import qdrant_client
print(f"Version: {qdrant_client.__version__}")
print(f"File: {qdrant_client.__file__}")
from qdrant_client import QdrantClient
client = QdrantClient(location=":memory:")
print(f"Has search: {hasattr(client, 'search')}")
if not hasattr(client, 'search'):
    print(f"Methods: {dir(client)}")
