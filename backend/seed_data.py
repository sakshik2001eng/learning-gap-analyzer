"""Safely seed the sample Python concept graph and learning resources.

Run with ``python seed_data.py`` from the backend directory after configuring
backend/.env. Existing records are updated in place; the collections are never
cleared.
"""

from main import get_database


CONCEPTS = [
    {
        "name": "Variables",
        "keywords": ["variable", "stores a value", "holds a value"],
        "prerequisites": [],
        "description": "Variables are used to store values in Python.",
    },
    {
        "name": "Data Types",
        "keywords": ["data type", "integer", "string", "float", "boolean"],
        "prerequisites": ["Variables"],
        "description": "Data types define the kind of value stored in a variable.",
    },
    {
        "name": "Conditional Statements",
        "keywords": ["if", "else", "elif", "condition", "decision"],
        "prerequisites": ["Variables", "Data Types"],
        "description": "Conditional statements let a program make decisions.",
    },
    {
        "name": "Loops",
        "keywords": ["loop", "for loop", "while loop", "repeat"],
        "prerequisites": ["Variables", "Conditional Statements"],
        "description": "Loops repeat a block of code.",
    },
    {
        "name": "Functions",
        "keywords": ["function", "def", "parameter", "return", "reusable"],
        "prerequisites": ["Variables", "Data Types"],
        "description": "Functions are reusable blocks of Python code.",
    },
]

RESOURCES = [
    {"concept": "Variables", "title": "Python Variables", "type": "Tutorial", "url": "https://www.w3schools.com/python/python_variables.asp"},
    {"concept": "Data Types", "title": "Python Data Types", "type": "Tutorial", "url": "https://www.w3schools.com/python/python_datatypes.asp"},
    {"concept": "Conditional Statements", "title": "Python Conditions", "type": "Tutorial", "url": "https://www.w3schools.com/python/python_conditions.asp"},
    {"concept": "Loops", "title": "Python Loops", "type": "Tutorial", "url": "https://www.w3schools.com/python/python_for_loops.asp"},
    {"concept": "Functions", "title": "Python Functions", "type": "Tutorial", "url": "https://www.w3schools.com/python/python_functions.asp"},
]


def seed_database() -> None:
    db = get_database()
    for concept in CONCEPTS:
        db.concepts.update_one({"name": concept["name"]}, {"$set": concept}, upsert=True)
    for resource in RESOURCES:
        db.resources.update_one(
            {"concept": resource["concept"], "title": resource["title"]},
            {"$set": resource},
            upsert=True,
        )
    print(f"Seeded {len(CONCEPTS)} concepts and {len(RESOURCES)} learning resources.")


if __name__ == "__main__":
    seed_database()
