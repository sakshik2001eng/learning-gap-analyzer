import re


def normalize_phrase(text: str) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", text.casefold()))


def analyze_semantic(answer: str, concepts: list) -> dict:
    normalized_answer = f" {normalize_phrase(answer)} "
    concept_scores = []
    matched = []
    gaps = []

    for concept in concepts:
        name = concept.name
        keywords = getattr(concept, "keywords", []) or []
        phrases = [name, *keywords]

        found = any(
            f" {normalize_phrase(phrase)} " in normalized_answer
            for phrase in phrases
            if normalize_phrase(phrase)
        )

        concept_scores.append({
            "concept": name,
            "mastery": 90 if found else 0,
            "state": "known" if found else "gap",
        })

        (matched if found else gaps).append(name)

    coverage = round(100 * len(matched) / len(concepts)) if concepts else 0

    return {
        "coverage": coverage,
        "matched": matched,
        "gaps": gaps,
        "concept_scores": concept_scores,
    }
