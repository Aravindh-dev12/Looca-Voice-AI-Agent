from qdrant_client import QdrantClient
print(f"Class methods: {[m for m in dir(QdrantClient) if not m.startswith('_')]}")
