from qdrant_client import QdrantClient
client = QdrantClient(location=":memory:")
try:
    client.search(collection_name="test", query_vector=[0.1]*1024)
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
