# RAG Embedding Storage Schema Design

## Requirements for a Good RAG Embedding Schema

A well-designed embedding schema for a **Retrieval-Augmented Generation (RAG)** system must support:

1. **Semantic Search**
   - Efficient similarity search using vector embeddings

2. **Filtering**
   - Search constraints based on document, source, tenant, date, etc.

3. **Chunk-Level Retrieval**
   - Retrieval at chunk level instead of entire documents

4. **Traceability**
   - Ability to identify which document and chunk contributed to an answer

5. **Re-Embedding & Versioning**
   - Support for model upgrades and re-indexing without data loss

---

## Logical Data Model (High Level)

### Core Entities

1. **Document**
2. **Chunk**
3. **Embedding**

> In practice, **Chunk** and **Embedding** are often stored together in a vector database.

---

## Embedding / Chunk Table (Vector Database)

| Field              | Type           | Purpose |
|-------------------|----------------|---------|
| `id`               | UUID / string  | Unique vector identifier |
| `embedding`        | vector\<float\> | Dense vector (e.g., 768 / 1536 dimensions) |
| `text`             | string         | Original chunk text |
| `document_id`      | string         | Reference to parent document |
| `chunk_index`      | int            | Order of the chunk within the document |
| `source`           | string         | Source type (pdf / web / db / api) |
| `metadata`         | json           | Flexible attributes for filtering |
| `embedding_model`  | string         | Embedding model used (for versioning) |
| `created_at`       | timestamp      | Audit and lifecycle tracking |

---

## Supported Capabilities

This schema enables:

- ✅ Semantic search
- ✅ Metadata-based filtering
- ✅ Re-ranking of retrieved results
- ✅ Source attribution and explainability

---

## Example Metadata

```json
{
  "tenant_id": "tenant_123",
  "file_name": "vector_db_notes.pdf",
  "page_number": 12,
  "language": "en",
  "topic": "vector-database",
  "version": "v1"
}
