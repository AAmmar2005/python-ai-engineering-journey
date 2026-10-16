
# 05 — Structured Outputs and Validation

Learn how to turn LLM responses into reliable, machine-readable data using JSON, Pydantic, schema validation, and structured output techniques.

## Module Information

| Field | Details |
|---|---|
| Stage | Stage 1 — Foundations |
| Planned Date | July 10, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Python, LLM APIs, Prompt Engineering |
| Primary Language | Python |
| Main Focus | JSON, schemas, Pydantic, validation, reliable LLM outputs |
| Previous Module | [04 — Prompt Engineering](../04-Prompt-Engineering/README.md) |
| Next Module | [06 — Embeddings and Semantic Search](../06-Embeddings-and-Semantic-Search/README.md) |

---

## 1. Learning Objectives

By the end of this module, you will be able to:

- Explain why LLM applications need structured outputs.
- Understand JSON objects, arrays, data types, and schemas.
- Distinguish between prompting for JSON and provider-enforced structured output.
- Validate LLM responses using Pydantic.
- Handle malformed JSON, missing fields, and incorrect data types.
- Apply business rules after schema validation.
- Design reusable data extraction pipelines.
- Test structured output systems using normal and edge-case inputs.
- Safely use LLM-generated data in backend applications.

## 2. Why Structured Outputs Matter

LLMs naturally generate text. However, real applications often need predictable data that software can process.

Imagine building a customer support system. Instead of receiving a paragraph, your application needs specific fields such as:

- Customer issue
- Issue category
- Priority
- Sentiment
- Suggested response

A structured response could look like this:

```json
{
  "issue": "Unable to reset password",
  "category": "account_access",
  "priority": "high",
  "sentiment": "frustrated",
  "suggested_response": "Please use the password reset link."
}
```

Your Python application can parse these fields, validate them, store them in a database, or display them in a dashboard.

**Important:** Valid JSON does not automatically mean the information is correct. You must validate both the structure and the business meaning.

## 3. Core Concepts

### 3.1 What Is JSON?

JSON stands for JavaScript Object Notation. It is a text format commonly used to exchange data between applications.

Example:

```json
{
  "name": "Waleed",
  "experience_years": 2,
  "is_active": true,
  "skills": ["Python", "LLMs", "FastAPI"],
  "location": null
}
```

Common JSON types:

| Type | Example |
|---|---|
| String | `"Python"` |
| Number | `25` or `3.14` |
| Boolean | `true` or `false` |
| Array | `["Python", "SQL"]` |
| Object | `{"name": "Waleed"}` |
| Null | `null` |

JSON rules:

- Strings use double quotes.
- Object keys must be strings.
- Do not add comments.
- Do not add trailing commas.
- Use `true`, `false`, and `null`, not Python's `True`, `False`, and `None`.

### 3.2 What Is a Schema?

A schema defines the expected structure of data.

For example, a support ticket schema might require:

- `issue`: string
- `category`: one of a predefined set of categories
- `priority`: low, medium, or high
- `confidence`: number between 0 and 1

Schemas help your application understand what it can safely expect.

### 3.3 Prompting for JSON vs. Structured Outputs

These approaches are related but not identical.

| Approach | How It Works | Main Limitation |
|---|---|---|
| JSON prompting | Ask the model to return JSON | The model may return invalid or unexpected output |
| JSON mode | Provider ensures JSON-formatted output where supported | Does not necessarily enforce your complete schema |
| Schema-constrained output | Provider constrains output to a supported schema | Provider and model support varies |
| Application validation | Your code checks the returned data | Cannot independently prove that the facts are true |

For production applications, use provider-enforced structured output when appropriate, then validate the result in your application.

Always check your chosen provider's current documentation for supported schemas and API options.

## 4. Introduction to Pydantic

Pydantic is a Python library for validating data against defined models.

Install the required packages:

```bash
pip install pydantic pytest
```

Create a file named `models.py`:

```python
from typing import Literal

from pydantic import BaseModel, Field


class SupportTicket(BaseModel):
    issue: str = Field(min_length=3)
    category: Literal[
        "account_access",
        "billing",
        "technical",
        "other",
    ]
    priority: Literal["low", "medium", "high"]
    confidence: float = Field(ge=0, le=1)
    needs_human_review: bool
```

This model defines the fields and their constraints.

For example:

- `issue` must contain at least three characters.
- `category` must match one of the allowed values.
- `priority` must be low, medium, or high.
- `confidence` must be between 0 and 1.
- `needs_human_review` must be a boolean.

Pydantic checks whether the supplied data conforms to the model.

## 5. Validate JSON with Pydantic

Create a file named `validate_output.py`:

```python
from pydantic import ValidationError

from models import SupportTicket


raw_json = """
{
  "issue": "Cannot access my account",
  "category": "account_access",
  "priority": "high",
  "confidence": 0.94,
  "needs_human_review": true
}
"""

try:
    ticket = SupportTicket.model_validate_json(raw_json)

    print("Validated ticket:")
    print(ticket.model_dump())

except ValidationError as error:
    print("The output failed validation.")
    print(error)
```

### What Happens Here?

1. The application receives JSON text.
2. Pydantic parses the JSON.
3. Pydantic checks the fields and constraints.
4. If valid, you receive a typed Python object.
5. If invalid, Pydantic raises a `ValidationError`.

You can also validate an existing Python dictionary:

```python
data = {
    "issue": "Payment failed",
    "category": "billing",
    "priority": "medium",
    "confidence": 0.85,
    "needs_human_review": False,
}

ticket = SupportTicket.model_validate(data)

print(ticket.category)
print(ticket.priority)
```

Convert the validated model back into a dictionary:

```python
result = ticket.model_dump()
```

Convert it into JSON:

```python
json_text = ticket.model_dump_json(indent=2)
print(json_text)
```

**Key distinction:** JSON parsing checks whether the text is valid JSON. Pydantic validation checks whether the parsed data matches your model.

## 6. Build a Structured LLM Extraction Pipeline

Now combine your knowledge of LLM APIs, prompt engineering, JSON, and validation.

### Step 1 — Define the Output Model

Use the `SupportTicket` model from the previous section.

### Step 2 — Prepare the Input

Example customer message:

```python
customer_message = """
I have been charged twice for my subscription.
Please fix this as soon as possible.
"""
```

### Step 3 — Write the Prompt

```python
def build_prompt(customer_message: str) -> str:
    return f"""
Analyze the customer message and extract a support ticket.

Allowed categories:
- account_access
- billing
- technical
- other

Allowed priorities:
- low
- medium
- high

Return data matching the required support-ticket structure.
Do not invent facts that are not present in the message.
Set needs_human_review to true if the issue needs manual attention.

Customer message:
<customer_message>
{customer_message}
</customer_message>
"""
```

The tags help distinguish the supplied message from the surrounding instructions, but they are not a security boundary. Treat the message as untrusted input.

### Step 4 — Obtain and Validate the Model Response

The following example uses a placeholder function for the model call. Connect it to the provider client you learned about in Module 03.

```python
import json

from pydantic import ValidationError

from models import SupportTicket


def parse_support_ticket(raw_output: str) -> SupportTicket:
    try:
        data = json.loads(raw_output)
        return SupportTicket.model_validate(data)

    except json.JSONDecodeError as error:
        raise ValueError("The model returned invalid JSON.") from error

    except ValidationError as error:
        raise ValueError("The model output failed schema validation.") from error
```

Example usage:

```python
raw_output = """
{
  "issue": "Customer was charged twice",
  "category": "billing",
  "priority": "high",
  "confidence": 0.96,
  "needs_human_review": true
}
"""

ticket = parse_support_ticket(raw_output)

print(ticket.model_dump())
```

This example validates the response independently of any specific LLM provider. In a real application, pass the raw response from your chosen model into this function.

### Step 5 — Add Business Validation

Schema validation checks structure and types. Business validation checks application-specific rules.

```python
def check_business_rules(ticket: SupportTicket) -> None:
    if ticket.confidence < 0.5 and not ticket.needs_human_review:
        raise ValueError(
            "Low-confidence tickets require human review."
        )
```

Run this after schema validation:

```python
check_business_rules(ticket)
```

This is a simple example. Real business rules should reflect your application's requirements and risk level.

## 7. Provider-Enforced Structured Output

Some providers and models support structured output directly through their SDKs.

For compatible OpenAI models and SDK versions, a Pydantic model can be supplied using the parsing interface:

```python
from openai import OpenAI

from models import SupportTicket

client = OpenAI()

response = client.chat.completions.parse(
    model="YOUR_SUPPORTED_MODEL",
    messages=[
        {
            "role": "system",
            "content": (
                "Extract a support ticket from the user message. "
                "Do not invent missing facts."
            ),
        },
        {
            "role": "user",
            "content": (
                "I was charged twice for my subscription."
            ),
        },
    ],
    response_format=SupportTicket,
)

ticket = response.choices[0].message.parsed

if ticket is None:
    raise ValueError("The response did not contain a parsed ticket.")

print(ticket.model_dump())
```

Before running this example:

1. Install and configure the provider SDK.
2. Set `OPENAI_API_KEY` in your environment.
3. Replace `YOUR_SUPPORTED_MODEL` with a model that supports this feature.
4. Check the provider's current documentation for API compatibility, refusals, and incomplete responses.

Provider-enforced structure reduces formatting errors, but it does not guarantee factual correctness or compliance with your business rules.

## 8. Error Handling and Recovery

LLM applications must expect failures.

| Failure | Example | Response |
|---|---|---|
| Invalid JSON | Missing closing brace | Reject or attempt bounded repair |
| Missing required field | No `priority` | Reject and request a corrected result if appropriate |
| Invalid enum | Priority is `"urgent"` | Reject or map only through an explicit business rule |
| Wrong type | Confidence is `"high"` | Reject or apply a documented conversion rule |
| Invalid business value | Confidence outside the allowed range | Reject |
| Refusal or incomplete response | Model declines or output is cut off | Handle as a separate outcome |

A safe recovery strategy:

1. Try to parse the response.
2. Validate it against the schema.
3. Record the validation failure without exposing secrets.
4. If appropriate, make a limited correction attempt with clear error details.
5. Validate the corrected result again.
6. Stop after a small, configured number of attempts.
7. Send unresolved cases to a fallback or human reviewer.

Do not retry indefinitely. Do not silently replace missing or invalid values with fabricated information.

## 9. Structured Outputs vs. Tool Calling

These concepts serve different purposes.

| Structured Outputs | Tool Calling |
|---|---|
| Produces data in an expected format | Requests that an application or tool perform an operation |
| Example: extract an invoice total | Example: request an invoice lookup |
| Output is parsed and validated | Tool arguments are validated before execution |
| Does not itself execute an external action | The application decides whether to execute the requested tool |

For example, a model might return a structured request to look up an invoice. Your backend must still check permissions, validate the invoice identifier, and authorize access before making the lookup.

You will explore tool calling in Module 11.

## 10. Reliability, Security, and Best Practices

Follow these principles when building production GenAI applications:

- **Validate every response:** Never assume model output is correct just because it looks reasonable.
- **Use explicit schemas:** Define required fields, allowed values, and sensible boundaries.
- **Separate validation layers:** Parse JSON, validate the schema, check business rules, and verify important facts.
- **Treat output as untrusted:** Never execute model-generated code or SQL directly.
- **Protect sensitive data:** Avoid sending secrets or unnecessary personal information to an LLM.
- **Authorize actions in application code:** The model cannot grant itself permissions.
- **Handle refusals and incomplete outputs:** Do not treat every response as a successful extraction.
- **Keep logs safe:** Avoid logging credentials, API keys, or unnecessary sensitive content.
- **Test edge cases:** Include empty input, unusual characters, conflicting instructions, and malformed responses.
- **Measure quality:** Track schema-validity rate separately from factual accuracy and task success.

Remember: a schema can constrain the shape of a response, but it cannot prove that the response is true.

## 11. Practical Lab — Support Ticket Extractor

### Objective

Build a reusable Python application that converts customer messages into validated support-ticket objects.

### Suggested Project Structure

```text
05-Structured-Outputs-and-Validation/
├── README.md
├── models.py
├── prompts.py
├── parser.py
├── validator.py
├── main.py
├── tests/
│   ├── test_models.py
│   ├── test_parser.py
│   └── test_business_rules.py
└── data/
    └── sample_tickets.jsonl
```

### Requirements

1. Define a Pydantic model for support tickets.
2. Create a prompt template for extracting ticket details.
3. Connect the application to an LLM provider.
4. Parse and validate the response.
5. Add business rules for low-confidence outputs.
6. Handle malformed JSON and invalid fields.
7. Add automated tests.
8. Save a small dataset of sample messages and expected outputs.
9. Report validation success rate and extraction accuracy.
10. Document known limitations and how failures are handled.

### Required Test Cases

Test at least these situations:

- A normal billing complaint.
- A password-reset request.
- A message with no useful information.
- An output missing a required field.
- An invalid category or priority.
- A confidence value outside the allowed range.
- Malformed JSON.
- A message containing instructions that attempt to override the extraction task.

Use mocked LLM responses for deterministic unit tests. Keep separate evaluation tests for the actual model, because its outputs can vary.

### Completion Deliverables

- Working Python implementation.
- Pydantic schema.
- Validated extraction pipeline.
- Automated test suite.
- Sample evaluation dataset.
- Short explanation of design choices and limitations.

## 12. Interview Questions

**Q1. What are structured outputs in GenAI?**

Structured outputs are model responses that follow an expected data format, such as JSON matching a defined schema.

**Q2. Why is prompting for JSON not enough?**

A model may produce invalid JSON, missing fields, unexpected values, or incorrect facts. Applications need validation and error handling.

**Q3. What is Pydantic?**

Pydantic is a Python library that validates data using typed models and field constraints.

**Q4. What is the difference between JSON parsing and schema validation?**

Parsing checks whether text is valid JSON. Schema validation checks whether the resulting data matches the required structure and constraints.

**Q5. Does valid structured output guarantee factual accuracy?**

No. A response can match every schema rule and still contain incorrect information.

**Q6. What is the difference between JSON mode and schema-constrained output?**

JSON mode focuses on valid JSON formatting. Schema-constrained output also enforces a supported structure, subject to provider and model capabilities.

**Q7. How should an application handle invalid model output?**

Reject it, log the failure safely, optionally attempt a limited correction, validate again, and use a fallback or human review when necessary.

**Q8. Why should model-generated data be validated before database operations?**

Validation reduces malformed data and enforces application rules. Authorization and transaction checks are still required before sensitive operations.

**Q9. How would you test an LLM extraction pipeline?**

Use deterministic unit tests with mocked outputs, edge-case tests, and a separate evaluation dataset to measure extraction quality.

**Q10. How are structured outputs different from tool calling?**

Structured outputs return data in a defined format. Tool calling requests an operation that the application may execute after validation and authorization.

## 13. Completion Checklist

- [ ] Understand JSON syntax and data types.
- [ ] Understand schemas and required fields.
- [ ] Compare JSON prompting, JSON mode, and schema-constrained output.
- [ ] Create Pydantic models with field constraints.
- [ ] Validate JSON strings and Python dictionaries.
- [ ] Handle parsing and validation errors.
- [ ] Add business-rule validation.
- [ ] Integrate a supported provider's structured-output feature.
- [ ] Write unit tests using mocked responses.
- [ ] Evaluate extraction accuracy with sample data.
- [ ] Complete the Support Ticket Extractor project.

## 14. Key Takeaways

- LLMs generate content, but applications need dependable data contracts.
- JSON is a data format; a schema describes the expected structure.
- Pydantic helps validate and work with typed Python data.
- Provider-enforced structured output can improve formatting reliability.
- Schema validity does not guarantee factual accuracy.
- Business rules, authorization, testing, and error handling remain application responsibilities.
- Production GenAI engineering requires measuring reliability, not just generating a successful response.

---

## Next Module

**Module 06 — Embeddings and Semantic Search**

In the next module, you will learn how to represent text as numerical vectors and compare meaning beyond exact keyword matching.

Planned date: **July 13, 2026**.
