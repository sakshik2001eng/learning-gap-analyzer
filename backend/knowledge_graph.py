import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is missing. Add it to backend/.env")

client = MongoClient(MONGODB_URI)

db = client["learning_gap_analyzer"]

concepts_collection = db["concepts"]
resources_collection = db["resources"]


def get_concept(concept_name: str):
    """Get a concept and its prerequisites from MongoDB."""
    concept = concepts_collection.find_one(
        {"name": concept_name},
        {"_id": 0}
    )

    return concept


def get_prerequisites(concept_name: str):
    """Get prerequisite concepts for a given concept."""
    concept = get_concept(concept_name)

    if not concept:
        return []

    return concept.get("prerequisites", [])


def get_resources_for_concept(concept_name: str):
    """Get learning resources for a concept."""
    resources = resources_collection.find(
        {"concept": concept_name},
        {"_id": 0}
    )

    return list(resources)


def get_resources_for_gaps(gaps: list[str]):
    """Recommend learning resources for detected knowledge gaps."""
    recommended_resources = []

    for gap in gaps:
        resources = get_resources_for_concept(gap)

        for resource in resources:
            if resource not in recommended_resources:
                recommended_resources.append(resource)

    return recommended_resources