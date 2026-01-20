from pydantic import BaseModel

class EmbeddingSchema(BaseModel):
    id: str
    embedding: list[float]
    text: str
    document_id: str
    chunk_index: int
    source: str
    metadata: dict
    embedding_model: str
    created_at: str
    