"""Semantic concept matching for student answers (NLP analysis v2)."""

import re
from functools import lru_cache
from typing import Any

MODEL_NAME = "all-MiniLM-L6-v2"
MATCH_THRESHOLD = 0.65
KEYWORD_HIT_SCORE = 0.90


@lru_cache(maxsize=1)
def _get_model():
    # Load on first analysis request; this avoids slowing API startup.
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(MODEL_NAME)


def _field(concept: Any, key: str, default=None):
    if isinstance(concept, dict):
        return concept.get(key, default)
    return getattr(concept, key, default)


def _normalize(text: str) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", text.casefold()))


def _split_sentences(text: str) -> list[str]:
    parts = [part.strip() for part in re.split(r"[.!?\n]+", text) if part.strip()]
    return parts or [text.strip()]


def _severity(mastery: int) -> str:
    # A concept below MATCH_THRESHOLD is a gap. Rank the gaps by how far
    # their score is from the mastery threshold.
    if mastery < 45:
        return "High"
    if mastery < 58:
        return "Medium"
    return "Low"


def analyze_semantic(answer: str, expected_concepts: list[Any]) -> dict:
    """Return per-concept semantic scores and known/gap graph nodes.

    Accepts dictionaries from MongoDB as well as Pydantic concept objects.
    The model and its first-run download are loaded lazily.
    """
    from sentence_transformers import util

    model = _get_model()
    sentences = _split_sentences(answer)
    if not sentences or not sentences[0]:
        sentences = [""]
    sentence_embeddings = model.encode(sentences, convert_to_tensor=True)
    padded_answer = f" {_normalize(answer)} "

    results = []
    for concept in expected_concepts:
        name = str(_field(concept, "name", "Concept"))
        keywords = _field(concept, "keywords", []) or []
        probes = [name, *keywords]
        probes = [str(phrase).strip() for phrase in probes if phrase and str(phrase).strip()]

        if probes:
            probe_embeddings = model.encode(probes, convert_to_tensor=True)
            similarities = util.cos_sim(probe_embeddings, sentence_embeddings)
            best_score = similarities.max()
            semantic_score = max(0.0, float(best_score))
            best_sentence_index = int(similarities.max(dim=0).values.argmax())
            best_sentence = sentences[best_sentence_index]
        else:
            semantic_score = 0.0
            best_sentence = sentences[0]

        keyword_hit = any(
            f" {_normalize(phrase)} " in padded_answer
            for phrase in probes
            if _normalize(phrase)
        )
        score = min(1.0, max(semantic_score, KEYWORD_HIT_SCORE if keyword_hit else 0.0))
        mastery = round(100 * score)
        known = score >= MATCH_THRESHOLD
        results.append({
            "name": name,
            "mastery": mastery,
            "state": "known" if known else "gap",
            "severity": None if known else _severity(mastery),
            "matched_by": "keyword" if keyword_hit else ("semantic" if known else "none"),
            "best_sentence": best_sentence,
        })

    matched = [item["name"] for item in results if item["state"] == "known"]
    gaps = [item["name"] for item in results if item["state"] == "gap"]
    coverage = round(100 * len(matched) / len(results)) if results else 0
    return {
        "matched": matched,
        "gaps": gaps,
        "coverage": coverage,
        "concept_scores": results,
        "graph": [{"name": item["name"], "state": item["state"]} for item in results],
    }
