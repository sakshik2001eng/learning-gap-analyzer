"""Mongo-backed concept prerequisites and study-resource lookup helpers."""


def get_concepts_for_names(db, names: list[str]) -> dict[str, dict]:
    if not names:
        return {}
    rows = db.concepts.find({"name": {"$in": names}}, {"_id": 0})
    return {row["name"].casefold(): row for row in rows}


def get_resources_for_gaps(db, gaps: list[str]) -> list[dict]:
    if not gaps:
        return []
    rows = db.resources.find({"concept": {"$in": gaps}}, {"_id": 0})
    return list(rows)


def build_learning_support(db, gaps: list[str], scores: list[dict]) -> tuple[list[dict], list[dict]]:
    """Return resources and prerequisite context for assessed concept gaps."""
    concepts = get_concepts_for_names(db, gaps)
    resources = get_resources_for_gaps(db, gaps)
    score_by_name = {item["name"].casefold(): item for item in scores}
    prerequisite_map = []

    for gap in gaps:
        concept = concepts.get(gap.casefold(), {})
        prerequisites = []
        for name in concept.get("prerequisites", []):
            score = score_by_name.get(name.casefold())
            prerequisites.append({
                "name": name,
                "state": score["state"] if score else "unassessed",
            })
        prerequisite_map.append({"concept": gap, "prerequisites": prerequisites})

    return resources, prerequisite_map
