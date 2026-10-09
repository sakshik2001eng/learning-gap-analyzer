# NLP Module: Semantic Gap Detection

**Author:** Pratiksha Satpute\
**Role:** Member 3 --- NLP / Gap Detection

## What It Does

The existing `/analyze` endpoint checks only exact keywords. This module
checks the **meaning** of a student's answer, so a correct answer
written in different words can still count as understood.

For each expected concept, it returns a mastery score (0--100), a
`known` or `gap` status, gap severity, and a graph list that the
frontend can display.

## Files

All files are in the `backend/` directory.

  -----------------------------------------------------------------------------------
  File                                Purpose
  ----------------------------------- -----------------------------------------------
  `nlp_engine.py`                     Main logic:
                                      `analyze_semantic(answer, expected_concepts)`

  `nlp_app.py`                        Small standalone API for testing the module on
                                      port `8001`

  `test_nlp_engine.py`                Test script with three sample answers; no
                                      database needed

  `requirements.txt`                  Includes the `sentence-transformers` dependency
  -----------------------------------------------------------------------------------

## How It Works

1.  The answer is split into sentences.
2.  The `all-MiniLM-L6-v2` model from Sentence Transformers converts
    each sentence and each concept (name plus keyword phrases) into
    vectors.
3.  Cosine similarity is calculated, and the best match for each concept
    is kept.
4.  If the exact phrase appears in the answer, the score is at least
    `0.90`.
5.  A score greater than or equal to `MATCH_THRESHOLD` (`0.65`) is
    marked `known`; a lower score is marked `gap`.
6.  `mastery = round(100 * score)`. Gap severity is assigned as follows:
    -   **High:** score below `0.65`
    -   **Medium:** score below `0.75`
    -   **Low:** otherwise

These severity ranges are intended to match the frontend mock data.

## Setup (Windows, VS Code Terminal)

Run these commands from the project directory:

``` powershell
cd backend
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

The first run downloads the model (approximately 90 MB) and requires an
internet connection.

## Run the Quick Test

No database is needed to run this test.

``` powershell
python test_nlp_engine.py
```

## Run the Test API

Start the standalone API:

``` powershell
fastapi dev nlp_app.py --port 8001
```

Then open <http://127.0.0.1:8001/docs>.

1.  Find `POST /analyze-semantic`.
2.  Click **Try it out**.
3.  Paste a request body.
4.  Click **Execute** to view the response.

### Example Request

``` json
{
  "answer": "A child class gets everything from its parent class.",
  "expected_concepts": [
    {
      "name": "Method Overriding",
      "keywords": [
        "subclass provides its own implementation of a parent method"
      ]
    },
    {
      "name": "Inheritance",
      "keywords": [
        "subclass inherits from a parent class"
      ]
    }
  ]
}
```

Example expected outcome: coverage is `50`, **Method Overriding** is
marked `gap`, and **Inheritance** is marked `known`. Actual scores
depend on the model's similarity results and the configured threshold.

## Output Fields

The response includes:

-   `matched` --- concepts classified as known.
-   `gaps` --- concepts that need more attention.
-   `coverage` --- overall concept coverage, from `0` to `100`.
-   `concept_scores` --- per-concept details:
    -   `name`
    -   `mastery`
    -   `state`
    -   `severity`
    -   `matched_by`
    -   `best_sentence`
-   `graph` --- a list of `{ "name", "state" }` objects in the shape
    expected by the frontend `ConceptGraph`.

## Tips and Limitations

-   Use **descriptive keyword phrases**, not just single words.
-   Similar concept names such as "Method Overriding" and "Method
    Overloading" can look similar to the model. Include clear,
    descriptive keyword phrases to help distinguish them.
-   The `0.65` threshold was chosen using a small test set. Re-tune it
    with a larger collection of labelled student answers.
-   This module is **not yet connected** to the main `/analyze`
    endpoint.

## Connecting It to `/analyze`

The following changes are for the person maintaining `main.py`.

### 1. Import the semantic analyzer

Add this after the other imports:

``` python
try:
    from nlp_engine import analyze_semantic
except ImportError:
    analyze_semantic = None
```

### 2. Call It Inside `analyze_answer`

After the existing `analyze_concepts(...)` call, add:

``` python
semantic = None
if analyze_semantic and request.expected_concepts:
    semantic = analyze_semantic(request.answer, request.expected_concepts)
    matched_concepts = semantic["matched"]
    possible_gaps = semantic["gaps"]
    coverage = semantic["coverage"]
```

### 3. Add the Results to the `record` Dictionary

Set `analysis_status` to `"semantic_v2"` when semantic analysis is
available, and add the two fields below:

``` python
"analysis_status": "semantic_v2" if semantic else analysis_status,
"concept_scores": semantic["concept_scores"] if semantic else [],
"graph": semantic["graph"] if semantic else [],
```

**Integration note:** Keep the existing fallback value for
`analysis_status` if your `record` dictionary uses a different variable
or structure. Check the surrounding code in `main.py` before replacing
the existing field.
