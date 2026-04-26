import os
import sys
sys.path.append(os.path.abspath("backend"))

from qdrant_client import QdrantClient
client = QdrantClient(location=":memory:")
print(f"Methods: {[m for m in dir(client) if not m.startswith('_')]}")
