
# 01 — Generative AI Fundamentals

> Learn Generative AI from first principles, understand how it works, explore real-world applications, and build a foundation for LLM engineering.

| Detail | Information |
|---|---|
| **Stage** | Stage 1 — Foundations |
| **Planned Date** | July 2, 2026 |
| **Level** | Beginner to Advanced |
| **Prerequisites** | Basic Python, Machine Learning, and Deep Learning |
| **Primary Language** | Python |
| **Main Focus** | Generative AI concepts, model capabilities, limitations, and application architecture |
| **Next Module** | 02 — LLM Fundamentals |

---

## 1. What Is Generative AI?

Generative Artificial Intelligence (Generative AI or GenAI) is a field of AI that focuses on creating new content based on patterns learned from data.

Depending on the model, that content may include:

- Text, such as explanations, emails, and articles.
- Images, such as illustrations and product designs.
- Audio, such as speech, music, and sound.
- Video, such as generated clips and animations.
- Code, such as functions, tests, and application components.
- Structured data, such as JSON objects and extracted information.

For example, a Generative AI application can accept a user's question and generate an answer, summarize a document, create an image from a description, or extract information from an invoice.

Generative AI does not mean that a system understands every request perfectly or always produces correct information. Its outputs depend on the model, its training, the input, available context, and the way the application is designed.

### A Simple Example

**Input:**

"Write a short welcome message for a new software developer."

**Possible output:**

"Welcome to the team! We're excited to have you here and look forward to building great things together."

The system generates a response instead of simply retrieving a predefined sentence from a fixed list.

---

## 2. Artificial Intelligence vs Machine Learning vs Deep Learning vs Generative AI

These terms are related, but they do not mean the same thing.

| Field | Meaning | Example |
|---|---|---|
| Artificial Intelligence (AI) | The broader field of building systems that perform tasks associated with intelligence | A system that plans a route |
| Machine Learning (ML) | Techniques that learn patterns from data | Predicting house prices |
| Deep Learning (DL) | Machine learning using multi-layer neural networks | Image classification |
| Generative AI | AI systems that generate new content | Generating text, images, or code |
| Large Language Models (LLMs) | Models trained to process and generate language, often using Transformer architectures | A chatbot that answers questions |
| Agentic AI | Systems that use models with tools, state, and controlled action loops to work toward goals | An assistant that searches information and prepares a report |

These categories overlap. Generative AI is not a completely separate replacement for machine learning or deep learning. Many modern generative models are built using deep learning.

**Important distinction:** LLM engineering and Agentic AI are related but separate learning areas. An LLM can generate a response without being an agent. An agentic system adds mechanisms for selecting actions, using tools, tracking state, and controlling execution.

---

## 3. How Does Generative AI Work?

At a high level, a Generative AI system learns statistical patterns from training data and uses those patterns to generate outputs.

A simplified lifecycle looks like this:

1. **Data collection:** Gather suitable training data.
2. **Preprocessing:** Prepare and organize the data.
3. **Model training:** Optimize model parameters to learn patterns.
4. **Evaluation:** Measure capabilities, quality, and limitations.
5. **Post-training:** Apply techniques that may improve instruction following, usefulness, or safety.
6. **Inference:** Provide an input and generate an output using the trained model.
7. **Application integration:** Connect the model to a user interface, APIs, databases, or other software.

Not every model follows precisely the same training pipeline. Different model families use different architectures, objectives, and post-training techniques.

### Training vs Inference

| Training | Inference |
|---|---|
| Learns model parameters from data | Uses an already-trained model to produce outputs |
| Usually computationally expensive | Can range from lightweight to computationally expensive |
| Often performed before a model is released | Happens whenever an application requests a prediction or generation |
| Produces a trained model | Produces a response, prediction, or generated content |

**Example:** A language model may be trained before you use it. When you send a message to a chatbot, the model performs inference to generate a response.

Using a model through an API usually does not mean that you are training its underlying parameters.

---

## 4. Generative AI vs Traditional Predictive AI

Traditional predictive systems often estimate a label, probability, score, or numerical value. Generative systems produce content, although some generative models can also support prediction-related tasks.

| Task | Predictive approach | Generative approach |
|---|---|---|
| Customer support | Classify a message as urgent or normal | Draft a response to the message |
| Finance | Predict a transaction's risk score | Draft an explanation of a financial report |
| Healthcare | Estimate risk from relevant clinical data | Draft a summary of a medical document for qualified review |
| Retail | Predict product demand | Generate product descriptions |
| Software development | Predict whether code may contain a defect | Suggest code changes or generate tests |

The best approach depends on the problem. A generative model is not automatically better than a traditional ML model for every task.

For example, if an application only needs to classify a message into five known categories, a conventional classifier may be cheaper, faster, and easier to evaluate.

---

## 5. Main Types of Generative AI

### 5.1 Text Generation

Text models generate natural-language responses, summaries, explanations, translations, and other written content.

**Applications:**
- Chatbots and virtual assistants
- Document summarization
- Question answering
- Email drafting
- Content transformation

### 5.2 Code Generation

Code-capable models can generate, explain, review, and modify source code.

**Applications:**
- Generating functions
- Writing unit tests
- Explaining unfamiliar code
- Suggesting debugging steps
- Producing documentation

Generated code must still be reviewed, tested, and checked for security issues.

### 5.3 Image Generation

Image-generation models create images from text descriptions, reference images, or other supported inputs.

**Applications:**
- Product concept designs
- Illustrations
- Creative assets
- Visual prototyping

### 5.4 Audio Generation and Processing

Audio models can support speech recognition, transcription, speech synthesis, and other audio tasks.

### 5.5 Video Generation

Video-generation models can generate or transform video content. Capabilities, output length, consistency, and access vary by model.

### 5.6 Multimodal AI

Multimodal systems work with more than one type of information, such as text, images, audio, or video.

For example, a vision-language model may accept a question and an image, then generate a text response.

---

## 6. What Is an LLM?

A Large Language Model (LLM) is a model designed to process and generate language. Many modern LLMs use Transformer-based neural networks.

A common training objective for an autoregressive language model is to predict the next token based on the preceding context.

For example:

**Input:** "The capital of France is"

**Possible continuation:** " Paris"

A token may represent a complete word, part of a word, punctuation, or another text unit. Tokens are not always equivalent to words.

By repeatedly generating tokens, a model can produce complete sentences, explanations, code, and other outputs.

This next-token prediction process is one important foundation of modern language models, but the complete behavior of an instruction-following assistant also depends on training data, post-training, inference settings, and application design.

We will explore tokens, tokenization, context windows, Transformers, attention, inference, and model settings in detail in **Module 02 — LLM Fundamentals**.

---

## 7. Common Generative AI Use Cases

| Use Case | What the system does | Important consideration |
|---|---|---|
| AI chatbot | Responds to user messages | Accuracy and conversation context |
| Document assistant | Answers questions about documents | Retrieval quality and citations |
| Information extractor | Converts documents into structured fields | Schema validation |
| Semantic search | Finds content by meaning | Embedding and retrieval quality |
| Coding assistant | Generates or explains code | Testing and security |
| Research assistant | Collects and summarizes information | Source verification |
| Customer support assistant | Helps answer customer questions | Permissions and escalation |
| Workflow assistant | Uses tools to complete controlled tasks | Authorization and reliable execution |

These use cases will connect directly to the practical projects in this course.

---

## 8. What Is a Generative AI Application?

A Generative AI application is more than a model. It combines a model with software components that make it useful for a specific task.

A typical application may contain:

- **User interface:** Accepts user input and displays results.
- **Backend:** Applies application logic and coordinates requests.
- **Model provider or local model:** Generates the output.
- **Prompt construction:** Supplies instructions and relevant context.
- **Data sources:** Provide documents, databases, or other information when needed.
- **Validation:** Checks output format and business rules.
- **Security:** Enforces authentication, authorization, and data access.
- **Evaluation and monitoring:** Measures quality, failures, latency, and cost.

### Example Architecture

A basic text-generation application:

```text
User
  |
  v
Frontend
  |
  v
Backend API
  |
  v
Prompt Construction
  |
  v
LLM Provider
  |
  v
Output Validation
  |
  v
Response to User
```

A production application may also need rate limiting, logging, retries, caching, streaming, monitoring, and safeguards for sensitive data.

You do not need every component for every project. Start with the simplest architecture that solves the problem, then add complexity when it provides measurable value.

---

## 9. Important Limitations of Generative AI

### 9.1 Hallucinations

A model may generate an answer that sounds convincing but is false, unsupported, or fabricated.

**Example:** It may invent a reference, misstate a fact, or provide an incorrect explanation.

**Mitigation:** Use trusted sources, retrieval where appropriate, explicit validation, citations, and human review for high-impact decisions. These methods reduce risk but do not guarantee correctness.

### 9.2 Knowledge Limitations

A model may lack recent, private, or specialized information.

**Mitigation:** Supply relevant information through approved data sources, retrieval, or suitable tools.

### 9.3 Context Limitations

Models can process only a bounded amount of context per request. Long inputs may exceed that limit or lead to important information being overlooked.

**Mitigation:** Select relevant content, manage context carefully, and evaluate how the model handles long inputs.

### 9.4 Prompt Injection

Instructions embedded in user input or retrieved content may attempt to manipulate the model into ignoring intended rules.

**Mitigation:** Treat external content as untrusted, enforce permissions in application code, validate tool arguments, and avoid giving the model unrestricted authority.

### 9.5 Privacy and Security

Sensitive information may be exposed if applications handle data, logs, credentials, or provider settings incorrectly.

**Mitigation:** Minimize data collection, protect secrets, enforce access controls, and review the provider's data-handling terms.

### 9.6 Cost and Latency

Larger models, longer contexts, repeated calls, and complex workflows can increase expense and response time.

**Mitigation:** Measure actual usage, limit unnecessary calls, compare suitable models, and use caching or smaller models when appropriate.

### 9.7 Bias and Unreliable Outputs

Model outputs may reflect biases in training data or behave inconsistently across similar inputs.

**Mitigation:** Evaluate representative cases, test edge cases, apply appropriate human oversight, and monitor failures.

---

## 10. Responsible Generative AI Engineering

Responsible development is part of engineering, not an optional final step.

Before releasing an application, consider:

- Is the output appropriate for the intended use?
- Can the system access only the data the user is authorized to see?
- Are API keys and credentials protected?
- Are model-generated outputs validated before being used?
- Could generated content cause harm if it is wrong?
- Is human approval needed before an external action?
- Are privacy, licensing, and data retention requirements understood?
- Can failures be detected and investigated?

**Core principle:** A model can suggest an action, but application code must enforce permissions and control sensitive operations.

For example, a model may suggest issuing a refund. The backend must independently verify the user's permissions, refund rules, transaction details, and approval requirements before executing it.

---

## 11. Practical Exercise — Build Your First GenAI Experiment

The goal is to understand the basic inference lifecycle before learning advanced frameworks.

### Objective

Send a prompt to a supported language model, receive a response, and inspect the result.

### Steps

1. Review the environment setup from Module 00.
2. Choose a model provider or a locally available model.
3. Configure credentials securely if the provider requires them.
4. Send a simple prompt using the provider's official SDK.
5. Print the generated response.
6. Try three different prompts for the same task.
7. Compare clarity, relevance, factual accuracy, and response length.
8. Record the model used, relevant settings, and any observed limitations.

### Suggested Experiment

Ask the model to explain a Python function in three different ways:

- For a complete beginner.
- For a software developer.
- In five concise bullet points.

Compare how the output changes when the instructions change.

Do not assume that a model will always obey the requested format or produce a correct explanation. Inspect and evaluate the result.

### Deliverables

- A runnable Python example.
- A short explanation of the request and response flow.
- Three prompt variations.
- Notes about output quality and limitations.
- No API keys or private credentials committed to Git.

**Completion rule:** Mark this exercise as completed only after you have run it and reviewed the results.

---

## 12. Knowledge Check

Try answering these questions before moving to the next module.

1. What is Generative AI?
2. How are AI, ML, DL, and GenAI related?
3. What is the difference between training and inference?
4. How does a predictive system differ from a generative system?
5. What is an LLM?
6. What is a token, and why is it not always a complete word?
7. What is a hallucination?
8. Why is a Generative AI application more than just a model?
9. What is prompt injection?
10. Why must a backend validate and authorize actions suggested by a model?
11. When might a traditional ML classifier be a better choice than an LLM?
12. What factors influence the cost and latency of a GenAI application?

### Interview Practice

**Q: Is Generative AI the same as an LLM?**

No. Generative AI is the broader category of systems that generate content. LLMs are one important family of generative models focused on language.

**Q: Does an LLM always know whether its answer is correct?**

No. It can produce plausible but incorrect information. Applications need appropriate grounding, validation, and evaluation.

**Q: Does using an LLM API mean you are training a model?**

Usually not. A typical API request performs inference using a model that has already been trained.

**Q: Is every Generative AI application an AI agent?**

No. A simple application may only send a prompt to a model and return the response. An agentic system adds mechanisms for choosing and executing actions, managing state, and controlling an action loop.

**Q: Should every application use RAG?**

No. RAG is useful when a model needs relevant external information, such as private documents or an updateable knowledge base. Simple tasks may not need retrieval.

**Q: Can prompt engineering guarantee correct answers?**

No. Better instructions can improve outputs, but prompts alone cannot guarantee accuracy, security, or consistent behavior.

---

## 13. Module Completion Checklist

- [ ] Understand the relationship between AI, ML, DL, GenAI, LLMs, and Agentic AI.
- [ ] Explain training versus inference.
- [ ] Identify common Generative AI modalities and use cases.
- [ ] Understand the basic architecture of a GenAI application.
- [ ] Explain hallucinations, context limits, prompt injection, and privacy risks.
- [ ] Complete the first inference experiment.
- [ ] Answer the knowledge-check questions.
- [ ] Commit the exercise and notes to GitHub.

---

## 14. Key Takeaways

- Generative AI creates content using patterns learned by models.
- LLMs are a major part of Generative AI, but they are not the whole field.
- Training and inference are different processes.
- A useful GenAI application combines a model with software, data, validation, and security.
- Model outputs can be incorrect, biased, or manipulated.
- Good engineering requires testing, evaluation, cost awareness, and controlled access.
- Not every problem needs an LLM, RAG, or an agent.

---

## 15. What's Next?

**Module 02 — LLM Fundamentals**

Next, we will study how modern language models work, including:

- Tokens and tokenization
- Transformer architecture and attention
- Pretraining and post-training
- Context windows
- Inference and text generation
- Temperature and top-p
- Model parameters versus generation settings
- Open-weight and proprietary models
- Quantization and local inference
- Model limitations, latency, and cost

The goal is to move from understanding what Generative AI is to understanding the models that power modern GenAI applications.

---

**Learning philosophy:** Understand the concept, build a small working example, test it, document what you learned, and then move to the next topic.
