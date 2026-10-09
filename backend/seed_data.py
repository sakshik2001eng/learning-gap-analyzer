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


concepts = [
    {
        "name": "Variables",
        "keywords": ["variable", "stores a value", "holds a value"],
        "prerequisites": [],
        "description": "Variables are used to store values in Python."
    },
    {
        "name": "Data Types",
        "keywords": ["data type", "integer", "string", "float", "boolean"],
        "prerequisites": ["Variables"],
        "description": "Data types define the type of value stored in a variable."
    },
    {
        "name": "Conditional Statements",
        "keywords": ["if", "else", "elif", "condition", "decision"],
        "prerequisites": ["Variables", "Data Types"],
        "description": "Conditional statements are used to make decisions in a program."
    },
    {
        "name": "Loops",
        "keywords": ["loop", "for loop", "while loop", "repeat"],
        "prerequisites": ["Variables", "Conditional Statements"],
        "description": "Loops are used to repeat a block of code."
    },
    {
        "name": "Functions",
        "keywords": ["function", "def", "parameter", "return", "reusable"],
        "prerequisites": ["Variables", "Data Types"],
        "description": "Functions are reusable blocks of code."
    }
]


resources = [
    {
        "concept": "Variables",
        "title": "Python Variables",
        "type": "Tutorial",
        "url": "https://www.w3schools.com/python/python_variables.asp"
    },
    {
        "concept": "Data Types",
        "title": "Python Data Types",
        "type": "Tutorial",
        "url": "https://www.w3schools.com/python/python_datatypes.asp"
    },
    {
        "concept": "Conditional Statements",
        "title": "Python Conditions",
        "type": "Tutorial",
        "url": "https://www.w3schools.com/python/python_conditions.asp"
    },
    {
        "concept": "Loops",
        "title": "Python Loops",
        "type": "Tutorial",
        "url": "https://www.w3schools.com/python/python_for_loops.asp"
    },
    {
        "concept": "Functions",
        "title": "Python Functions",
        "type": "Tutorial",
        "url": "https://www.w3schools.com/python/python_functions.asp"
    }
]


# Clear old seed data
concepts_collection.delete_many({})
resources_collection.delete_many({})


# Insert new data
if concepts:
    concepts_collection.insert_many(concepts)

if resources:
    resources_collection.insert_many(resources)


print("✅ Concepts inserted successfully!")
print("✅ Resources inserted successfully!")
print("✅ Knowledge graph seed data completed!")