
# 🛠️ 11 — Tool Calling and External APIs

> Learn how LLMs request function calls, how applications execute those requests, and how to connect language models with external APIs, databases, and business logic.

---

## 📅 Learning Schedule

| Detail | Information |
|---|---|
| **Planned Date** | August 5, 2026 |
| **Learning Stage** | Stage 3 — LLM Application Engineering |
| **Difficulty** | Intermediate → Advanced |
| **Primary Language** | Python |
| **Core Technologies** | LLM APIs, Tool Calling, Python Functions, REST APIs, Pydantic |
| **Prerequisites** | LLM APIs, Prompt Engineering, Structured Outputs, LangChain basics |
| **Previous Module** | [10 — LLM Frameworks and LangChain](../10-LLM-Frameworks-and-LangChain/README.md) |
| **Next Module** | [12 — LLM Evaluation and Guardrails](../12-LLM-Evaluation-and-Guardrails/README.md) |

### 🎯 Learning Goal

Build an AI assistant that can request tools, validate arguments, execute approved functions, handle results, and return a grounded response without giving the LLM unrestricted access to your system.

---

## 🗺️ Learning Roadmap

```text
LLM Generates a Response
          │
          ▼
What Is Tool Calling?
          │
          ▼
Define Tools and Schemas
          │
          ▼
LLM Requests a Tool Call
          │
          ▼
Validate Arguments
          │
          ▼
Application Executes the Tool
          │
          ▼
Return the Tool Result
          │
          ▼
LLM Produces the Final Answer
          │
          ▼
Build a Safe API-Connected Assistant
```

---

## 🎯 1. Learning Objectives

By completing this module, you will be able to:

- Explain function calling and tool calling.
- Understand the difference between generating text and requesting a tool.
- Define tools with clear names, descriptions, and argument schemas.
- Understand the tool-calling request and response lifecycle.
- Execute tool calls in Python using an explicit allowlist.
- Connect an LLM with external REST APIs.
- Validate tool arguments and handle failures.
- Understand sequential and multiple tool calls.
- Build a controlled tool-calling loop.
- Apply authorization, input validation, and approval requirements.
- Understand how tools fit into larger AI applications.
- Prepare for later modules covering evaluation, guardrails, and agentic workflows.

---

# 🧠 2. What Is Tool Calling?

Tool calling allows a language model to request that an application run a particular function or external operation.

A tool might:

- Calculate a value.
- Search a knowledge base.
- Retrieve an order.
- Check inventory.
- Query an approved database.
- Call a weather or currency API.
- Create a support ticket.
- Send a notification after authorization.

The key distinction is that **the model requests a tool call, but your application executes it**.

The model does not automatically gain access to your Python environment, database, filesystem, or external services.

### Example

User:

> What is 125 multiplied by 8?

The model may request:

```json
{
  "name": "multiply",
  "arguments": {
    "a": 125,
    "b": 8
  }
}
```

Your application validates the arguments and executes the function:

```python
def multiply(a: float, b: float) -> float:
    return a * b

result = multiply(125, 8)

print(result)
```

Output:

```text
1000
```

Your application can then send the result back to the model so it can formulate a final response.

The JSON shown above is an illustrative tool-call representation. Actual API response objects and argument encodings depend on the provider.

---

# 🔄 3. Understand the Tool-Calling Lifecycle

A common tool-calling flow looks like this:

```text
1. User Sends a Question
           │
           ▼
2. Application Sends Messages + Tool Definitions
           │
           ▼
3. Model Requests a Tool Call
           │
           ▼
4. Application Validates the Request
           │
           ▼
5. Application Executes the Approved Function
           │
           ▼
6. Application Sends the Tool Result Back
           │
           ▼
7. Model Generates the Final Answer
```

### Important Details

1. A tool definition describes what the tool does and what arguments it accepts.
2. The model can request a tool, but the request is not proof that its arguments are correct.
3. Your application decides whether the requested tool is allowed.
4. The function runs in your application's execution environment.
5. The result is returned using the provider's required tool-result format.
6. The model can use that result to answer or request another tool if the application allows it.

Tool calling is therefore an application-control feature, not simply a prompt that says "use this function."

---

# 🧩 4. Tool Calling vs. Structured Outputs vs. RAG

These concepts are related but solve different problems.

| Concept | Main Purpose | Example |
|---|---|---|
| Structured outputs | Return data in a defined schema | Extract a support ticket as JSON |
| Tool calling | Request an operation or function | Look up an order |
| RAG | Retrieve information from a knowledge source | Answer from company documentation |
| Agentic workflow | Coordinate steps toward a goal | Research a topic using several tools and decide what to do next |

A structured response describes information. A tool call requests an operation.

A RAG application can use tool calling, but it does not have to. Likewise, a tool-calling application can be a simple, deterministic function-call loop without being a fully autonomous agent.

---

# 🛠️ 5. Define a Simple Tool

Start with ordinary Python functions.

```python
def get_order_status(order_id: str) -> dict:
    """Return the status of a known order."""

    orders = {
        "ORD-1001": {
            "status": "shipped",
            "estimated_delivery": "2026-08-07",
        },
        "ORD-1002": {
            "status": "processing",
            "estimated_delivery": None,
        },
    }

    order = orders.get(order_id)

    if order is None:
        return {
            "found": False,
            "message": "Order not found.",
        }

    return {
        "found": True,
        "order_id": order_id,
        **order,
    }
```

Test the function without an LLM:

```python
print(get_order_status("ORD-1001"))
print(get_order_status("ORD-9999"))
```

This is a mock order database for learning purposes. A real implementation would retrieve data from an authorized source.

### What Makes a Good Tool?

A good tool has:

- A clear name.
- A specific responsibility.
- A concise description.
- Explicit arguments.
- Predictable output.
- Defined error behavior.
- Appropriate access controls.

Prefer small tools such as `get_order_status()` over a single function that performs unrelated tasks.

---

# 📋 6. Tool Schemas and Argument Validation

The model needs to understand which arguments a tool accepts.

For example:

```json
{
  "name": "get_order_status",
  "description": "Look up the status of an order.",
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "The order identifier."
      }
    },
    "required": ["order_id"],
    "additionalProperties": false
  }
}
```

This schema is illustrative. Use the exact tool-definition format required by your model provider.

### Why Schemas Matter

Schemas help the model produce better-structured requests, but they do not replace server-side validation.

Your application must still check:

- Required fields.
- Argument types.
- Allowed values.
- String lengths and numeric ranges.
- Resource ownership and permissions.
- Whether the operation is appropriate for the current user.

### Validate With Pydantic

```python
from pydantic import BaseModel, Field

class OrderLookupInput(BaseModel):
    order_id: str = Field(
        min_length=1,
        max_length=40,
        pattern=r"^ORD-[0-9]+$",
    )

valid_input = OrderLookupInput(
    order_id="ORD-1001"
)

print(valid_input.model_dump())
```

Validation ensures that the input follows the specified format. It does not establish whether the user is authorized to access that order.

---

# 💻 7. First Practical — Tool Calling With OpenAI

This example uses the OpenAI Python SDK directly so you can understand the underlying protocol before adding a framework abstraction.

Install the dependency:

```bash
pip install openai python-dotenv
```

Add your credentials to `.env`:

```dotenv
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=your_supported_model_name
```

Create `tool_calling.py`:

```python
import json
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"]
)

MODEL = os.environ["OPENAI_MODEL"]


def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""

    return a * b


tools = [
    {
        "type": "function",
        "function": {
            "name": "multiply",
            "description": "Multiply two numbers.",
            "parameters": {
                "type": "object",
                "properties": {
                    "a": {
                        "type": "number",
                        "description": "First number.",
                    },
                    "b": {
                        "type": "number",
                        "description": "Second number.",
                    },
                },
                "required": ["a", "b"],
                "additionalProperties": False,
            },
            "strict": True,
        },
    }
]

messages = [
    {
        "role": "user",
        "content": "What is 125 multiplied by 8?",
    }
]

response = client.chat.completions.create(
    model=MODEL,
    messages=messages,
    tools=tools,
    tool_choice="auto",
)

assistant_message = response.choices[0].message

# Preserve the assistant's response, including any tool calls.
messages.append(assistant_message)

if assistant_message.tool_calls:
    for tool_call in assistant_message.tool_calls:
        if tool_call.function.name != "multiply":
            raise ValueError("Requested tool is not allowed.")

        arguments = json.loads(
            tool_call.function.arguments
        )

        a = arguments["a"]
        b = arguments["b"]

        result = multiply(a, b)

        messages.append(
            {
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps({"result": result}),
            }
        )

    final_response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
    )

    print(final_response.choices[0].message.content)
else:
    print(assistant_message.content)
```

### Understand the Code

- `tools` describes the available function.
- `tool_choice="auto"` allows the model to decide whether to request a tool.
- The model returns a tool-call request.
- `json.loads()` parses the arguments.
- The application explicitly checks the requested function name.
- Python executes the function.
- The tool result is appended with its matching `tool_call_id`.
- A second model request can produce the final answer.

### Important Limitations

This is a first example, not a complete production tool runner.

For production use:

- Validate arguments against a schema.
- Handle malformed JSON and model/API errors.
- Support multiple tool calls in a response.
- Set execution and request timeouts.
- Limit the number of tool-loop iterations.
- Return safe error messages.
- Add authorization for user-specific resources.
- Record appropriate audit information without logging secrets.
- Check current provider documentation for model-specific tool-calling requirements.

---

# 🔁 8. Build a Controlled Tool-Calling Loop

Real applications may need more than one tool call. A model might request a calculation, inspect the result, and then request another permitted operation.

A controlled loop typically follows this pattern:

```text
Send Messages + Tools
        │
        ▼
Receive Model Response
        │
        ▼
Any Tool Calls?
   ┌────┴─────┐
   │          │
  No         Yes
   │          │
   ▼          ▼
Return     Validate Each Call
Answer          │
                ▼
          Check Allowlist
                │
                ▼
          Execute Tool
                │
                ▼
          Append Results
                │
                └──────► Send Messages Again
```

### Loop Design Requirements

Your implementation should:

1. Set a maximum number of model/tool iterations.
2. Execute only explicitly registered tools.
3. Validate every argument.
4. Match each tool result to the correct tool-call ID.
5. Handle failed tool executions without crashing the whole application.
6. Avoid executing the same side-effecting operation more than once unintentionally.
7. Return a controlled error if the iteration limit is reached.

A maximum iteration count prevents an accidental infinite loop. It does not, by itself, make tool execution secure.

---

# 🌐 9. Connect Tools to External APIs

A tool can call a REST API instead of a local Python function.

For example, imagine your application needs to retrieve public information from an external service.

```python
import requests

def fetch_public_data(url: str) -> dict:
    """Fetch JSON from a configured public API endpoint."""

    response = requests.get(
        url,
        timeout=10,
    )

    response.raise_for_status()

    return response.json()
```

This illustrates HTTP request mechanics, but **do not expose this arbitrary-URL function directly as an LLM tool**. An untrusted model-generated URL could create a server-side request forgery (SSRF) vulnerability or reach internal services.

A safer design fixes the service endpoint in your application and allows the model to provide only validated parameters.

Example pattern:

```python
import requests

API_BASE_URL = "https://api.example.com"

def get_product(product_id: str) -> dict:
    """Fetch a product from the configured product service."""

    if not product_id.isalnum():
        raise ValueError("Invalid product identifier.")

    response = requests.get(
        f"{API_BASE_URL}/products/{product_id}",
        timeout=10,
    )

    response.raise_for_status()

    return response.json()
```

`api.example.com` is a placeholder, not a real service for this exercise. Replace it with a trusted endpoint you control or are authorized to use.

### External API Best Practices

- Use HTTPS.
- Set timeouts.
- Handle non-success HTTP status codes.
- Validate and limit user-controlled parameters.
- Store API credentials in a secret manager or environment variables.
- Restrict outbound network access where appropriate.
- Avoid returning unnecessary sensitive data to the model.
- Apply rate limits and cost controls.
- Log tool name, outcome, and latency safely.
- Use idempotency controls for operations that create or modify resources.

---

# 🔐 10. Tool Security and Permissions

Tool calling creates a boundary between model-generated requests and real application actions.

Treat every requested call as untrusted input.

### Read Operations vs. Write Operations

| Tool Type | Example | Typical Safeguard |
|---|---|---|
| Read-only | Search public documentation | Validate inputs and control data access |
| User-specific read | Get an order or profile | Authenticate and authorize the user |
| Reversible write | Create a draft ticket | Validate fields and enforce permissions |
| Sensitive write | Issue a refund or change a payroll record | Strong authorization and approval |
| Destructive action | Delete an account or permanent records | Explicit confirmation and strict controls |

### Essential Security Rules

**1. Never execute arbitrary model-generated code.**

Use a predefined registry of functions.

**2. Never trust the model to authorize itself.**

Enforce permissions in your application or downstream service.

**3. Keep credentials out of prompts.**

Secrets belong in secure configuration, not in model context.

**4. Validate every argument.**

A well-formed tool call can still request an unauthorized action.

**5. Separate proposal from execution.**

For consequential operations, show the intended action and require appropriate confirmation before committing it.

**6. Treat tool results as untrusted data.**

External services can return malformed data, sensitive content, or instructions intended to manipulate the model.

**7. Preserve auditability.**

Record who initiated an operation, which tool ran, whether it succeeded, and which approval or authorization applied, while minimizing sensitive data in logs.

---

# 🧪 11. Error Handling and Testing

Tool calls can fail for many reasons:

- Invalid arguments.
- Unknown tool names.
- Missing permissions.
- Network timeouts.
- API rate limits.
- External service errors.
- Unexpected response formats.
- Model-generated requests that do not match your business rules.

### Example: Validate Before Execution

```python
from pydantic import ValidationError

def execute_order_lookup(raw_arguments: dict) -> dict:
    try:
        validated = OrderLookupInput.model_validate(
            raw_arguments
        )
    except ValidationError:
        return {
            "success": False,
            "error": "Invalid order lookup arguments.",
        }

    result = get_order_status(
        validated.order_id
    )

    return {
        "success": True,
        "data": result,
    }
```

This example uses the `OrderLookupInput` schema and `get_order_status()` function defined earlier in the module.

In a real application, authorization must also be checked before returning an order's data.

### Testing Checklist

- Test valid and invalid arguments.
- Test unknown tool names.
- Test missing required fields.
- Test unauthorized access.
- Test external API timeouts.
- Test rate-limit responses.
- Test malformed external API responses.
- Test maximum tool-loop iterations.
- Test duplicate execution of write operations.
- Mock external services in unit tests.

Keep tool functions independently testable so most tests do not require paid LLM calls.

---

# 🚀 12. Final Project — API-Connected AI Assistant

## Project Goal

Build an assistant that can answer questions by calling a small set of controlled tools.

### Suggested Tools

1. `calculate_total` — perform a calculation.
2. `search_knowledge_base` — retrieve approved documentation.
3. `get_order_status` — look up a mock order.
4. `create_support_ticket` — create a ticket in a mock service.

### Core Requirements

- [ ] Define tools with clear descriptions.
- [ ] Define argument schemas.
- [ ] Register tools in an explicit allowlist.
- [ ] Validate every model-generated argument.
- [ ] Execute tools in application code.
- [ ] Return tool results using the correct API protocol.
- [ ] Support multiple calls or define a deliberate single-call limit.
- [ ] Handle tool and external API errors.
- [ ] Apply authentication and authorization where required.
- [ ] Require appropriate confirmation for consequential actions.
- [ ] Add unit tests for tool functions.
- [ ] Record latency, outcomes, and tool usage.
- [ ] Document security assumptions and known limitations.

### Suggested Project Structure

```text
11-Tool-Calling-and-External-APIs/
├── README.md
├── requirements.txt
├── .env.example
├── app.py
├── src/
│   ├── config.py
│   ├── tool_schemas.py
│   ├── tool_registry.py
│   ├── tool_executor.py
│   ├── api_clients.py
│   ├── authorization.py
│   └── llm_client.py
├── tests/
│   ├── test_tool_schemas.py
│   ├── test_tool_executor.py
│   ├── test_authorization.py
│   └── test_api_clients.py
└── docs/
    └── security.md
```

### Stretch Goals

1. Add FastAPI endpoints.
2. Add a database-backed tool.
3. Add retry logic with bounded attempts.
4. Add idempotency keys for write operations.
5. Add an approval step for sensitive actions.
6. Add structured logging and tracing.
7. Add a simple web interface.
8. Compare direct SDK tool calling with LangChain integration.
9. Add evaluation tests for tool selection and argument correctness.

---

# 🎤 13. Interview Questions

**Q1. What is tool calling?**

Tool calling allows a model to request that an application execute a defined function or operation using structured arguments.

**Q2. Does the LLM execute the function itself?**

No. The application receives the request, validates it, executes the function if permitted, and returns the result.

**Q3. What is a tool schema?**

A description of the tool's name, purpose, parameters, and expected argument structure.

**Q4. Is schema validation enough for security?**

No. Validation checks input shape and constraints. Authentication, authorization, business rules, and operational safeguards are separate requirements.

**Q5. What is the difference between a tool call and a normal response?**

A normal response provides content to the user. A tool call requests an application operation that must be handled through the tool execution protocol.

**Q6. What happens after a tool executes?**

The application sends the tool result back to the model using the appropriate tool-call identifier and message format. The model can then produce a final answer or request another permitted tool.

**Q7. How do you prevent arbitrary function execution?**

Use an explicit tool registry or allowlist, validate names and arguments, and never evaluate arbitrary model-generated code.

**Q8. What is the risk of allowing an LLM to choose arbitrary URLs?**

It can enable SSRF or access to internal network resources. Use fixed trusted endpoints, strict parameter validation, and network restrictions.

**Q9. How do you prevent duplicate write operations?**

Use idempotency controls, durable operation state, appropriate transaction handling, and explicit rules for retrying operations.

**Q10. Is every tool-calling system an agent?**

No. A simple application can perform a single controlled tool call. Agentic systems typically add broader multi-step planning, state, feedback, or decision-making.

---

# ✅ 14. Completion Checklist

- [ ] Understand the tool-calling lifecycle.
- [ ] Explain the difference between tool calling, structured outputs, and RAG.
- [ ] Define tools and argument schemas.
- [ ] Implement a tool with Python.
- [ ] Connect a model using a tool-calling API.
- [ ] Execute calls through an explicit allowlist.
- [ ] Return tool results to the model.
- [ ] Understand controlled multi-step tool loops.
- [ ] Integrate a trusted external API.
- [ ] Validate inputs and enforce permissions.
- [ ] Handle timeouts, failures, and duplicate operations.
- [ ] Test tools independently of the LLM.
- [ ] Complete the API-Connected AI Assistant.
- [ ] Document the security and reliability limitations.

---

# 💡 15. Key Takeaways

- Tool calling connects model reasoning with application capabilities.
- The model requests an operation; the application decides whether to execute it.
- Tool descriptions and schemas help the model produce structured requests.
- Server-side validation and authorization remain mandatory.
- External API integration requires timeouts, error handling, and safe credential management.
- Side-effecting operations need stronger safeguards than read-only operations.
- Tool calling is a building block for agentic systems, but a simple tool loop is not automatically a complete agent.

---

# ➡️ Next Module

## 12 — LLM Evaluation and Guardrails

**Planned Date:** August 10, 2026

Next, you will learn how to evaluate LLM outputs systematically and add guardrails for input validation, output quality, policy compliance, and safer application behavior.

You will build on the tool-calling assistant and learn how to test not only whether it works, but whether it behaves reliably under realistic and adversarial inputs.

**Next folder:** `05-Generative-AI/12-LLM-Evaluation-and-Guardrails/README.md`
