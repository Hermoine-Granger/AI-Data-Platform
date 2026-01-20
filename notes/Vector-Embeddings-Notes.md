# Vector Databases – Core Concepts

## 1. What is a Vector Embedding?

A **vector embedding** is a numeric representation of data (text, image, audio, etc.) as a list of numbers (a vector). It captures **semantic meaning** in a high-dimensional space.

- Embeddings allow machines to compare similarity  
  → **Closer vectors ≈ more similar meaning**
- Created either via:
  - Feature engineering, or
  - A trained model (e.g., NLP models like **BERT**) that converts concepts into **dense vectors**

---

## 2. What is Cosine Similarity?

**Cosine similarity** measures how similar two vectors are based on the **angle between them**, not their magnitude.

### Formula
\[
\text{cosine\_similarity}(A, B) = \frac{A \cdot B}{\|A\| \|B\|}
\]

*(Dot product divided by the product of magnitudes)*

### Range
- `1` → Vectors point in the same direction (**very similar**)
- `0` → Vectors are orthogonal (**unrelated**)
- `-1` → Vectors point in opposite directions (**very dissimilar**)

**Why it’s useful:**  
- Focuses on **meaning**, not scale
- Ideal for **semantic similarity search**

---

## 3. Similarity Metrics

- **Cosine Similarity**
  - Angle-based
  - Best for semantic meaning

- **Dot Product**
  - Captures both direction and magnitude
  - Works well when models are trained with dot-product objectives

- **Euclidean Distance**
  - Literal geometric distance
  - Sensitive to vector scale

---

## 4. Metadata & Filtering

- Metadata allows you to **constrain searches**
- Example:
  - Find similar documents **only within a specific tag, category, or time range**

---

## 5. Vector Database

- **Pinecone**
  - Purpose-built vector database
  - Optimized for fast similarity search at scale
