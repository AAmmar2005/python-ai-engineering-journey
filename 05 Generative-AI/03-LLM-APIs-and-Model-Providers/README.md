
# 03 — LLM APIs and Model Providers

> Learn to integrate Large Language Models into Python applications using APIs and SDKs, with secure configuration, streaming, error handling, testing, and cost awareness.

| Detail | Information |
|---|---|
| **Stage** | Stage 1 — Foundations |
| **Planned Date** | July 6, 2026 |
| **Level** | Beginner to Advanced |
| **Prerequisites** | Python, environment variables, Module 01 — GenAI Fundamentals, Module 02 — LLM Fundamentals |
| **Primary Language** | Python |
| **Main Focus** | LLM APIs, SDKs, messages, streaming, async, reliability, security, and usage tracking |
| **Next Module** | 04 — Prompt Engineering |

---

## 1. What Is an LLM API?

An API (Application Programming Interface) allows one software system to communicate with another through a defined interface.

An LLM API lets an application send input to a language model and receive a generated response.

For example, a Python application can send a user's question to a model provider and display the resulting answer in a web interface.

A typical request flow looks like this:

```text
User
  |
  v
Python Application
  |
  v
LLM Provider SDK
  |
  v
HTTP API Request
  |
  v
Model Inference
  |
  v
API Response
  |
  v
Application Processes the Result
```

The provider SDK usually handles details such as request construction, authentication headers, and response parsing. Exact behavior depends on the SDK.

**Important:** Calling an API usually performs inference using an existing model. It does not automatically train or fine-tune that model.

---

## 2. What Are Model Providers and SDKs?

A model provider offers access to models through a hosted API, local deployment, or another supported interface.

An SDK (Software Development Kit) is a library that helps developers interact with that interface using their programming language.

### Common Integration Approaches

| Approach | Description | When to use it |
|---|---|---|
| Provider SDK | Use the provider's official programming library | When working with a specific provider |
| Direct HTTP request | Send API requests using an HTTP client | When you need explicit control over HTTP behavior |
| OpenAI-compatible API | Use a compatible request format supported by a provider or local server | When the service documents compatibility |
| Local inference server | Send requests to a model running on your own machine or infrastructure | When local deployment is suitable |

An API described as OpenAI-compatible may support only part of the interface. Verify its endpoint, authentication requirements, request fields, and response behavior.

### Choosing an Approach

Start with a provider's official SDK when it simplifies the integration. Learn the underlying HTTP concepts as well, because they help you debug authentication failures, timeouts, malformed requests, and unexpected responses.

Avoid tightly coupling your whole application to provider-specific response objects. A small internal interface can make it easier to change providers later.

---

## 3. Set Up Your Environment

Use the virtual environment created in Module 00.

Create a project directory:

```text
03-LLM-APIs-and-Model-Providers/
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
├── src/
│   ├── __init__.py
│   └── basic_request.py
├── examples/
│   └── streaming.py
└── tests/
    └── test_helpers.py
```

Install the libraries used in the examples:

```bash
python -m pip install openai python-dotenv pytest
```

Save your dependencies:

```bash
python -m pip freeze > requirements.txt
```

For a real project, consider maintaining a deliberately pinned, reviewed dependency file rather than treating every installed environment package as a direct project dependency.

### Environment Variables

Create `.env.example`:

```dotenv
LLM_API_KEY=replace_with_your_key
LLM_MODEL=replace_with_a_supported_model_id
LLM_BASE_URL=
```

Create your local `.env` file with the actual values required by your provider. Keep `.env` out of version control.

Example `.gitignore`:

```gitignore
.env
.venv/
__pycache__/
.pytest_cache/
*.py[cod]
```

Use the model identifier and endpoint documented by your chosen provider. Do not assume that every provider supports the same models or base URL.

---

## 4. Your First LLM API Request

The following example uses the OpenAI Python SDK and its documented chat-completions interface. It assumes that your provider supports this interface and that the selected model is available to your account.

Create `src/basic_request.py`:

```python
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("LLM_API_KEY")
model = os.getenv("LLM_MODEL")
base_url = os.getenv("LLM_BASE_URL")

if not api_key:
    raise RuntimeError("Set LLM_API_KEY in your environment.")

if not model:
    raise RuntimeError("Set LLM_MODEL in your environment.")

client_options = {"api_key": api_key}

if base_url:
    client_options["base_url"] = base_url

client = OpenAI(**client_options)

response = client.chat.completions.create(
    model=model,
    messages=[
        {
            "role": "system",
            "content": "You are a helpful Python tutor.",
        },
        {
            "role": "user",
            "content": "Explain an API in simple English.",
        },
    ],
)

message = response.choices[0].message.content
print(message or "")
```

Run it from the module directory:

```bash
python -m src.basic_request
```

### Understand the Code

- `load_dotenv()` loads variables from your local `.env` file when present.
- `OpenAI(...)` creates the SDK client.
- `model` identifies the model requested from the provider.
- `messages` supplies the conversation input.
- `role` identifies the purpose of each message.
- `create(...)` sends the request.
- `response.choices[0].message.content` accesses the first generated message in a typical chat-completions response.

This interface is not universal. Some providers expose different methods, message formats, or response objects.

The example deliberately avoids printing credentials. In production, also avoid logging full prompts or responses when they may contain sensitive information.

---

## 5. Understanding Message Roles

Many conversational APIs use role-based messages.

| Role | Typical purpose |
|---|---|
| `system` | Supplies high-level behavior instructions in interfaces that support this role |
| `developer` | Supplies application-level instructions in interfaces that support this role |
| `user` | Supplies the user's request |
| `assistant` | Represents a model-generated message |
| `tool` | Represents a tool result in supported tool-calling interfaces |

Not every provider supports every role in the same way. Follow the selected API's documentation.

### Example

```python
messages = [
    {
        "role": "system",
        "content": "Explain programming concepts clearly.",
    },
    {
        "role": "user",
        "content": "What is a Python dictionary?",
    },
]
```

Message roles help organize instructions and conversation content. They are not a substitute for application-side security controls.

For example, telling a model not to access private data does not replace database authorization checks.

---

## 6. API Requests and Responses

An API request commonly contains:

- The selected model.
- Input messages or another supported input format.
- Generation settings.
- Optional response-format or tool definitions.
- Other provider-specific fields.

A response may contain:

- Generated content.
- A response identifier.
- Model or request metadata.
- Token usage information.
- A finish reason.
- Other provider-specific fields.

You should not assume that every field is always present.

### Inspect Usage Metadata

For a compatible chat-completions response:

```python
usage = response.usage

if usage is not None:
    print("Input tokens:", usage.prompt_tokens)
    print("Output tokens:", usage.completion_tokens)
    print("Total tokens:", usage.total_tokens)
```

Some providers and interfaces use different names, return partial usage information, or report usage differently.

Usage metadata can help you measure consumption. To calculate cost, use the applicable pricing rules for the actual model and any additional billable features.

---

## 7. Streaming Responses

Without streaming, an application commonly waits for the response to finish before displaying the generated text.

With streaming, the API sends response chunks as generation progresses, allowing the application to display content incrementally.

### Why Streaming Matters

- Improves perceived responsiveness.
- Allows users to see text while it is being generated.
- Can be useful for chat interfaces and interactive applications.
- Requires handling partial output and stream interruptions.

### Example

Create `examples/streaming.py`:

```python
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("LLM_API_KEY")
model = os.getenv("LLM_MODEL")
base_url = os.getenv("LLM_BASE_URL")

if not api_key or not model:
    raise RuntimeError("Configure LLM_API_KEY and LLM_MODEL.")

options = {"api_key": api_key}

if base_url:
    options["base_url"] = base_url

client = OpenAI(**options)

stream = client.chat.completions.create(
    model=model,
    messages=[
        {
            "role": "user",
            "content": "Explain how an HTTP request works.",
        }
    ],
    stream=True,
)

for chunk in stream:
    if not chunk.choices:
        continue

    delta = chunk.choices[0].delta
    content = delta.content

    if content:
        print(content, end="", flush=True)

print()
```

Run:

```bash
python examples/streaming.py
```

This example assumes the provider supports compatible chat streaming.

**Production consideration:** Handle stream failures, cancellations, incomplete output, and client disconnects. Do not treat partially generated output as a complete validated answer.

---

## 8. Synchronous vs Asynchronous Requests

### Synchronous Requests

A synchronous request blocks the current execution path until the request completes or fails.

This is often sufficient for a simple script or a sequential workflow.

### Asynchronous Requests

An asynchronous client allows an application to wait for network operations without blocking the event loop in the same way as a synchronous call.

This is useful when an application needs to manage multiple independent I/O operations.

### Example

```python
import asyncio
import os

from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()


async def main():
    api_key = os.getenv("LLM_API_KEY")
    model = os.getenv("LLM_MODEL")
    base_url = os.getenv("LLM_BASE_URL")

    if not api_key or not model:
        raise RuntimeError("Configure LLM_API_KEY and LLM_MODEL.")

    options = {"api_key": api_key}

    if base_url:
        options["base_url"] = base_url

    async with AsyncOpenAI(**options) as client:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": "Explain asynchronous Python simply.",
                }
            ],
        )

        print(response.choices[0].message.content or "")


if __name__ == "__main__":
    asyncio.run(main())
```

Asynchronous execution does not automatically make a single model request faster. It helps manage waiting and concurrency when the workload supports it.

Before sending many requests concurrently, implement appropriate concurrency limits and respect provider rate limits.

---

## 9. Error Handling

API requests can fail for many reasons.

| Failure | Possible cause | Appropriate response |
|---|---|---|
| Authentication error | Missing, invalid, or revoked credentials | Check credentials securely |
| Permission error | Account lacks access to the requested model or operation | Verify account and model access |
| Rate limit | Request or token limits exceeded | Apply documented retry and backoff behavior |
| Timeout | Response took too long | Set suitable timeouts and handle failure |
| Server error | Provider-side problem | Retry selectively when safe |
| Invalid request | Unsupported model, malformed input, or invalid settings | Fix the request instead of retrying unchanged |
| Network error | Connection failure or interruption | Handle temporary failure appropriately |

### Basic Example

```python
import os

from dotenv import load_dotenv
from openai import (
    APIConnectionError,
    APIStatusError,
    APITimeoutError,
    OpenAI,
    RateLimitError,
)

load_dotenv()

client = OpenAI(
    api_key=os.environ["LLM_API_KEY"],
    timeout=30.0,
    max_retries=2,
)

try:
    response = client.chat.completions.create(
        model=os.environ["LLM_MODEL"],
        messages=[
            {
                "role": "user",
                "content": "Explain exception handling in Python.",
            }
        ],
    )

    print(response.choices[0].message.content or "")

except RateLimitError:
    print("Rate limit reached. Try again later.")

except APITimeoutError:
    print("The request timed out.")

except APIConnectionError:
    print("Could not connect to the model provider.")

except APIStatusError as exc:
    print(f"Provider returned HTTP status {exc.status_code}.")
```

The SDK may perform retries for certain failures, depending on its configuration and version. Avoid layering multiple uncontrolled retry systems on top of one another.

In production, record safe diagnostic information and use appropriate logging rather than relying only on `print()`.

---

## 10. Retries, Backoff, and Idempotency

Retries can improve resilience when failures are temporary. However, retrying every error is inefficient and can create additional costs.

### Exponential Backoff

A common strategy increases the waiting period between attempts:

```text
Attempt 1 -> wait briefly
Attempt 2 -> wait longer
Attempt 3 -> wait longer again
```

Real implementations should use documented retry behavior, reasonable maximum attempts, and often jitter to avoid many clients retrying at the same moment.

### When to Retry

Potentially retryable failures include certain rate limits, connection interruptions, and transient server errors.

Do not blindly retry:

- Invalid requests.
- Invalid credentials.
- Unsupported models.
- Permanent permission failures.

### Idempotency

An operation is idempotent when repeating it has the same intended effect as performing it once.

A text-generation request may be safe to repeat from a business perspective, but a repeated request can still incur additional charges or return a different result.

For operations that change external state, such as creating a payment or sending a message, use appropriate idempotency mechanisms and application-side safeguards where supported.

---

## 11. Rate Limits and Concurrency

Providers may limit requests based on request count, token usage, account tier, model, or other dimensions.

### Good Practices

- Read the provider's current rate-limit documentation.
- Respect retry guidance and relevant response headers.
- Limit concurrent requests.
- Use bounded queues for larger workloads.
- Avoid retry storms.
- Track rate-limit errors.
- Consider batching only when the provider and task support it.
- Design a useful response when a service is temporarily unavailable.

Do not hardcode a rate limit from an example or assume every model on a provider shares the same limits.

---

## 12. Cost and Token Usage

LLM API costs depend on the provider's pricing rules and the features used.

Possible cost factors include:

- Input tokens.
- Output tokens.
- Model selection.
- Cached input, where supported.
- Image, audio, or other multimodal inputs.
- Additional tools or billable services.

### Example Calculation

Suppose a hypothetical model charges:

- $0.50 per million input tokens.
- $1.50 per million output tokens.

A request uses 2,000 input tokens and 500 output tokens.

Input cost:

```text
2,000 / 1,000,000 × $0.50 = $0.001
```

Output cost:

```text
500 / 1,000,000 × $1.50 = $0.00075
```

Total hypothetical cost:

```text
$0.001 + $0.00075 = $0.00175
```

These prices are illustrative, not current provider pricing. Always check the selected model's pricing page and account for other applicable charges.

### Engineering Recommendations

- Measure usage from actual responses when available.
- Set sensible output limits.
- Avoid repeatedly sending unnecessary context.
- Select models according to task requirements.
- Monitor cost per task and per user.
- Establish budgets or alerts when supported.
- Include retries and failed requests in cost reviews.

---

## 13. Security and Privacy

An LLM integration must protect both credentials and user data.

### API Key Security

- Store credentials in environment variables or an approved secret manager.
- Never commit keys to Git.
- Never expose server-side API keys in frontend JavaScript.
- Rotate keys if they are exposed.
- Use separate credentials for different environments where appropriate.
- Restrict access to production secrets.

### Data Privacy

- Send only the information required for the task.
- Understand the provider's data retention and processing terms.
- Avoid logging secrets, access tokens, or unnecessary personal information.
- Apply authentication and authorization before retrieving private data.
- Review applicable organizational and legal requirements.

### Trust Boundaries

A model response is not automatically safe or valid. Validate outputs before using them in database queries, file operations, shell commands, or external actions.

A prompt is not a security boundary. Permissions must be enforced by the application.

---

## 14. Testing LLM API Integrations

Tests should check your application's behavior without requiring a live model call for every test run.

### What to Test

- Missing configuration.
- Correct request construction.
- Response parsing.
- Empty or unexpected responses.
- Provider errors.
- Timeouts and retry behavior.
- Logging that avoids secrets.
- Output validation.
- Application behavior when the provider is unavailable.

### Example: Test a Response Helper

Create `src/helpers.py`:

```python
def extract_message_content(response):
    choices = getattr(response, "choices", None)

    if not choices:
        return ""

    message = getattr(choices[0], "message", None)

    if message is None:
        return ""

    content = getattr(message, "content", None)
    return content if isinstance(content, str) else ""
```

Create `tests/test_helpers.py`:

```python
from types import SimpleNamespace

from src.helpers import extract_message_content


def test_extracts_message_content():
    response = SimpleNamespace(
        choices=[
            SimpleNamespace(
                message=SimpleNamespace(content="Hello")
            )
        ]
    )

    assert extract_message_content(response) == "Hello"


def test_returns_empty_when_no_choices():
    response = SimpleNamespace(choices=[])

    assert extract_message_content(response) == ""
```

Run:

```bash
pytest -q
```

This is a small example of unit testing response handling. It does not test the provider itself or guarantee the correctness of generated text.

For broader coverage, mock the SDK client and test your request construction and exception handling without sending real API requests.

---

## 15. Common Mistakes

1. Hardcoding an API key in source code.
2. Assuming every provider uses the same API format.
3. Assuming every model identifier is available to every account.
4. Ignoring timeouts and temporary failures.
5. Retrying invalid requests repeatedly.
6. Sending unlimited concurrent requests.
7. Logging private prompts and responses unnecessarily.
8. Treating streamed partial text as a completed answer.
9. Ignoring token usage and cost.
10. Testing only with live API calls.
11. Assuming that a successful HTTP response guarantees a correct answer.
12. Allowing model-generated content to perform sensitive actions without validation or authorization.

---

## 16. Practical Project — Build a Reusable LLM Client

### Objective

Build a small Python module that makes model requests through a provider SDK and separates integration code from application logic.

### Required Features

- Environment-based configuration.
- Configurable model identifier.
- A reusable client or wrapper.
- A function to send a message and return text.
- Configurable timeout.
- Appropriate error handling.
- Token usage reporting when available.
- Unit tests with mocked responses.
- Clear README instructions.

### Suggested Structure

```text
llm-client/
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
├── src/
│   ├── __init__.py
│   ├── config.py
│   ├── client.py
│   └── helpers.py
└── tests/
    ├── test_helpers.py
    └── test_client.py
```

### Milestones

1. Make one successful API request.
2. Move configuration into a dedicated module.
3. Add a reusable function for sending a prompt.
4. Add timeout and error handling.
5. Add tests that do not need a live API key.
6. Record token usage when the provider supplies it.
7. Document setup, supported interface, limitations, and example usage.

### Stretch Goals

- Add streaming support.
- Add asynchronous requests.
- Add bounded concurrency.
- Add structured logging.
- Add a second provider behind a common interface.
- Add a simple cost estimator using configurable pricing data.

Do not add every advanced feature immediately. Finish the smallest reliable version first.

---

## 17. Interview Questions

**Q1. What is an LLM API?**

An interface that allows an application to submit inputs to a language model and receive outputs through a defined request-response protocol.

**Q2. What is the difference between an SDK and an API?**

The API defines how a service can be used. An SDK provides code libraries and helpers for interacting with that service.

**Q3. Why use environment variables for API keys?**

They separate sensitive configuration from source code. Production systems may use a dedicated secret manager for stronger operational controls.

**Q4. What is streaming?**

Streaming delivers output incrementally instead of requiring the application to wait for the entire response.

**Q5. When is async useful?**

It helps an application manage concurrent I/O operations efficiently, particularly when multiple requests can be in progress at the same time.

**Q6. What is exponential backoff?**

A retry strategy that increases the waiting interval between attempts, often with jitter and a maximum retry limit.

**Q7. Why shouldn't every error be retried?**

Some errors are permanent or require a changed request. Repeating them wastes time and may incur extra costs.

**Q8. How do you reduce LLM API costs?**

Measure token usage, reduce unnecessary context, choose an appropriate model, constrain output length, and monitor real usage.

**Q9. Why mock API calls in unit tests?**

Mocking makes tests faster, more predictable, and independent of provider availability, credentials, and usage charges.

**Q10. Does a successful API response mean the answer is correct?**

No. A successful request means the service returned a response. Factual correctness and task quality require separate evaluation.

**Q11. Why isn't a prompt sufficient for authorization?**

Model instructions can be ignored or manipulated. Application code must enforce identity, permissions, and business rules.

**Q12. How would you design an application that can switch providers?**

Define a small internal interface for required operations, isolate provider-specific request and response handling, and test each adapter against the same application contract.

---

## 18. Module Completion Checklist

- [ ] Explain APIs, SDKs, and model providers.
- [ ] Configure a provider without hardcoding credentials.
- [ ] Send a successful model request.
- [ ] Understand message roles and response structure.
- [ ] Inspect usage metadata where available.
- [ ] Implement or understand streaming.
- [ ] Understand synchronous and asynchronous requests.
- [ ] Handle timeouts and provider errors.
- [ ] Understand retries, backoff, idempotency, and rate limits.
- [ ] Estimate costs using applicable pricing.
- [ ] Protect credentials and sensitive data.
- [ ] Write unit tests using mocked responses.
- [ ] Build the reusable LLM client project.
- [ ] Commit the code and documentation to GitHub.

---

## 19. Key Takeaways

- LLM APIs connect applications to hosted or compatible model interfaces.
- SDKs simplify API usage but do not remove the need to understand HTTP and failure handling.
- API keys belong in secure configuration, not committed source code.
- Streaming and async improve application responsiveness and I/O handling in appropriate situations.
- Retries must be bounded and selective.
- Rate limits, token usage, latency, and cost are production engineering concerns.
- Unit tests should not require a live model call for every test.
- Provider-specific behavior should be isolated behind clear application interfaces.
- Model output requires validation, and sensitive actions require application-side authorization.

---

## 20. What's Next?

**Module 04 — Prompt Engineering**

Next, you will learn to design and test instructions that help LLMs produce more useful and consistent outputs.

Topics include:

- Clear instructions and context.
- Role and task definition.
- Zero-shot and few-shot prompting.
- Prompt templates and reusable variables.
- Summarization, classification, and extraction.
- Task decomposition.
- Prompt injection awareness.
- Prompt versioning and evaluation.
- Recognizing when prompting alone is insufficient.

The goal is to build prompts as testable application components rather than relying on trial and error.

---

**Learning philosophy:** Make one request, understand the response, handle failure, test the integration, and then build on it.
