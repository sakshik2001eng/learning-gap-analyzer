from types import SimpleNamespace as C

from nlp_engine import analyze_semantic

CONCEPTS = [
    C(name="Method Overriding", keywords=[
        "subclass provides its own implementation of a parent method",
        "redefines inherited method",
    ]),
    C(name="Method Overloading", keywords=[
        "same method name with different parameter lists",
        "different arguments",
    ]),
]


def test_result_contains_expected_fields():
    result = analyze_semantic(
        "A child class overrides a parent method by providing its own implementation.",
        CONCEPTS,
    )
    assert "coverage" in result
    assert "matched" in result
    assert "gaps" in result
    assert "concept_scores" in result


def test_each_concept_has_valid_mastery_score():
    result = analyze_semantic(
        "A child class overrides a parent method.",
        CONCEPTS,
    )
    for concept in result["concept_scores"]:
        assert 0 <= concept["mastery"] <= 100
        assert concept["state"] in ("known", "gap")


def test_coverage_is_valid_percentage():
    result = analyze_semantic(
        "A child class overrides a parent method.",
        CONCEPTS,
    )
    assert 0 <= result["coverage"] <= 100


def test_empty_concepts_return_zero_coverage():
    result = analyze_semantic("Some answer", [])
    assert result["coverage"] == 0
    assert result["concept_scores"] == []
    assert result["matched"] == []
    assert result["gaps"] == []
