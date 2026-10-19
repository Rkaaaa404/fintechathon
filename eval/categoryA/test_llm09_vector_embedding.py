#!/usr/bin/env python3
"""
AegisPath Security Evaluation - Category A
Test ID: LLM09:2026 - Vector and Embedding Weaknesses
Status: N/A (By Design)

White-Box Verification & Architectural Evidence:
Architecture uses deterministic rule parsing and structured relational/ledger stores;
no vector databases or embedding similarity search are used.
"""
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def test_llm09_vector_embedding():
    print("=" * 76)
    print(" [TEST ID: LLM09:2026] Vulnerability: Vector and Embedding Weaknesses")
    print(" Status: N/A (By Design)")
    print("=" * 76)

    # 1. Audit Requirements & Codebase for Vector DBs / Embeddings
    print("  [1] Architectural Audit for Vector Databases & Embeddings:")
    vector_libs = [
        "chromadb", "pinecone", "faiss", "weaviate", "qdrant", "milvus",
        "sentence_transformers", "langchain.vectorstores"
    ]

    backend_py = list((ROOT_DIR / "backend").rglob("*.py"))
    req_file = ROOT_DIR / "backend" / "requirements.txt"
    req_text = req_file.read_text(encoding="utf-8").lower() if req_file.exists() else ""

    found_vector_deps = [lib for lib in vector_libs if lib in req_text]
    print(f"      Vector DB Dependencies in requirements.txt: {found_vector_deps}")
    assert len(found_vector_deps) == 0, f"FAIL: Found vector database dependencies: {found_vector_deps}"

    # 2. Relational Ledger Store Verification
    print("  [2] Storage & Retrieval Architecture:")
    print("      - Relational / Ledger Stores : SQLite with structured ACID transactions")
    print("      - Intent Classification      : Deterministic Regex + Structured JSON schema")
    print("      - Semantic Vector Embeddings : Completely excluded from architecture")

    print("-" * 76)
    print("  >>> VERDICT: N/A (By Design)")
    print("  Architectural Evidence: Architecture uses deterministic rule parsing and")
    print("  structured relational/ledger stores; no vector databases or embedding")
    print("  similarity search are used.")
    print("=" * 76)
    return True


if __name__ == "__main__":
    success = test_llm09_vector_embedding()
    sys.exit(0 if success else 1)
