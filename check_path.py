import qdrant_client
print(f"File: {qdrant_client.__file__}")
try:
    print(f"Version: {qdrant_client.__version__}")
except:
    print("No __version__")
from qdrant_client import QdrantClient
print(f"QdrantClient path: {QdrantClient.__module__}")
