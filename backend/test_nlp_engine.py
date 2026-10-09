"""Small manual checks for semantic matching; no MongoDB is needed."""
from types import SimpleNamespace as C

from nlp_engine import analyze_semantic

concepts = [
    C(name="Method Overriding", keywords=[
        "subclass provides its own implementation of a parent method",
        "redefines inherited method",
    ]),
    C(name="Method Overloading", keywords=[
        "same method name with different parameter lists",
        "different arguments",
    ]),
]

answers = [
    ("Correct answer", "A child class overrides a parent method by providing its own implementation."),
    ("Half-correct answer", "Overriding means the child class redefines an inherited method."),
    ("Wrong answer", "Overloading is when a method has a different name in another class."),
]

for label, answer in answers:
    result = analyze_semantic(answer, concepts)
    print(f"\n{label}: {answer}")
    for score in result["concept_scores"]:
        print(f"  {score['name']}: {score['mastery']}% ({score['state']})")
    print(f"  Coverage: {result['coverage']}%")
