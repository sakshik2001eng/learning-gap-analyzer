"""Semantic concept matching (analysis v2)."""
import re
from functools import lru_cache

MODEL_NAME = "all-MiniLM-L6-v2"
MATCH_THRESHOLD = 0.65
KEYWORD_HIT_SCORE = 0.90


@lru_cache(maxsize=1)
def _get_model():
    from sentence_transformers import SentenceTransformer
    return SentenceTransformer(MODEL_NAME)


def _normalize(text: str) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", text.casefold()))


def _split_sentences(text: str) -> list[str]:
    parts = [p.strip() for p in re.split(r"[.!?\n]+", text) if p.strip()]
    return parts or [text.strip()]


def _severity(mastery: int) -> str:
    if mastery < 65:
        return "High"
    if mastery < 75:
        return "Medium"
    return "Low"


def analyze_semantic(answer: str, expected_concepts) -> dict:
    from sentence_transformers import util

    model = _get_model()
    sentences = _split_sentences(answer)
    if not sentences or not sentences[0]:
        sentences = [""]
    sentence_emb = model.encode(sentences, convert_to_tensor=True)
    padded_answer = f" {_normalize(answer)} "

    results = []
    for concept in expected_concepts:
        probes = [concept.name] + list(concept.keywords)
        probes = [phrase for phrase in probes if phrase and phrase.strip()]
        if probes:
            probe_emb = model.encode(probes, convert_to_tensor=True)
            sims = util.cos_sim(probe_emb, sentence_emb)
            best_score = sims.max()
            semantic = max(0.0, float(best_score))
            best_sentence = sentences[int(sims.max(dim=0).values.argmax())]
        else:
            semantic = 0.0
            best_sentence = sentences[0]
        keyword_hit = any(
            f" {_normalize(p)} " in padded_answer for p in probes if _normalize(p)
        )

        score = max(semantic, KEYWORD_HIT_SCORE if keyword_hit else 0.0)
        mastery = round(100 * min(score, 1.0))
        known = score >= MATCH_THRESHOLD

        results.append({
            "name": concept.name,
            "mastery": mastery,
            "state": "known" if known else "gap",
            "severity": None if known else _severity(mastery),
            "matched_by": "keyword" if keyword_hit else ("semantic" if known else "none"),
            "best_sentence": best_sentence,
        })

    matched = [r["name"] for r in results if r["state"] == "known"]
    gaps = [r["name"] for r in results if r["state"] == "gap"]
    coverage = round(100 * len(matched) / len(results)) if results else 0

    return {
        "matched": matched,
        "gaps": gaps,
        "coverage": coverage,
        "concept_scores": results,
        "graph": [{"name": r["name"], "state": r["state"]} for r in results],
    }