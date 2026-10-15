
# 02 — LLM Fundamentals

> Understand how Large Language Models work, how they process text, how they generate responses, and how to choose the right model for a Generative AI application.

| Detail | Information |
|---|---|
| **Stage** | Stage 1 — Foundations |
| **Planned Date** | July 4, 2026 |
| **Level** | Beginner to Advanced |
| **Prerequisites** | Python, basic ML/DL, and Module 01 — GenAI Fundamentals |
| **Primary Language** | Python |
| **Main Focus** | Tokenization, Transformers, model training, inference, generation settings, and model selection |
| **Next Module** | 03 — LLM APIs and Model Providers |

---

## 1. What Is a Large Language Model?

A Large Language Model (LLM) is a machine learning model designed to process and generate human language. Modern LLMs can also perform tasks such as code generation, summarization, classification, translation, and question answering.

Many modern LLMs are built using the Transformer architecture and trained on large collections of text and other data, depending on the model.

Examples of tasks an LLM can perform include:

- Answering questions.
- Explaining programming concepts.
- Generating and reviewing code.
- Summarizing documents.
- Extracting structured information.
- Translating and rewriting text.
- Supporting applications that use external tools or retrieval systems.

An LLM is not automatically connected to the internet, your database, or your private documents. Those capabilities require appropriate integrations and permissions in the application around the model.

### A Simple Example

**Input:**

```text
Explain an API in simple English.
```

**Possible output:**

```text
An API allows two software systems to communicate.
For example, a weather application can use an API
to request weather information from a server.
```

The model generates the response based on learned patterns and the input context. Its answer may still be incomplete or incorrect.

---

## 2. How Does an LLM Generate Text?

Many widely used LLMs generate text by predicting the next token based on the tokens already provided or generated.

A simplified process looks like this:

1. Receive the input.
2. Convert the input into tokens.
3. Convert tokens into numerical representations.
4. Process those representations through the model.
5. Calculate scores for possible next tokens.
6. Select a token according to the generation strategy.
7. Append the selected token to the sequence.
8. Repeat until a stopping condition is reached.

### Example

Suppose the input is:

```text
The sun rises in the
```

The model may assign probabilities to possible next tokens.

| Possible continuation | Illustrative probability |
|---|---:|
| east | 0.75 |
| morning | 0.10 |
| sky | 0.08 |
| west | 0.02 |
| Other possibilities | 0.05 |

These numbers are hypothetical and are used only to demonstrate the idea.

If the model selects `east`, it can continue generating more tokens until it completes the response or reaches a stopping condition.

**Important:** An LLM is not simply selecting complete sentences from a database. It generates sequences using learned model parameters and a token-generation process.

---

## 3. Tokens and Tokenization

A token is a unit of text processed by a language model. Depending on the tokenizer, a token may represent:

- A complete word.
- Part of a word.
- Punctuation.
- A number or part of a number.
- Whitespace or another text unit.

Tokenization converts text into a sequence of tokens that the model can process.

### Example

The sentence:

```text
I am learning Generative AI.
```

might be divided into token-like units such as:

```text
["I", " am", " learning", " Generative", " AI", "."]
```

This is only an illustration. The actual token sequence depends on the model's tokenizer.

### Why Tokenization Matters

Tokenization affects:

- Input and output limits.
- API usage costs when pricing is token-based.
- Processing speed.
- How much text fits into a context window.
- How different languages and unusual strings are processed.

A 1,000-word document does not necessarily use the same number of tokens as another 1,000-word document. Language, formatting, code, and tokenizer design all matter.

### Hands-On Exercise

Choose a tokenizer compatible with a model you want to study. Encode a few sentences and inspect:

1. The token IDs.
2. The number of tokens.
3. The decoded text.
4. The difference between ordinary English, code, and non-English text.

Do not assume that token IDs or token boundaries are universal across models.

---

## 4. What Is an Embedding?

An embedding is a numerical representation of an item, such as a token, sentence, document, or image.

In language models, token embeddings represent tokens as vectors that can be processed by neural network layers. Other embedding models can represent whole sentences or documents for semantic search.

For example, a vector might look like:

```text
[0.21, -0.45, 0.73, 0.18, ...]
```

The numbers above are illustrative.

### Why Embeddings Matter

Embeddings help models represent information numerically. They are also widely used outside the core language model for:

- Semantic search.
- Similarity comparisons.
- Document retrieval.
- Recommendation systems.
- Retrieval-Augmented Generation (RAG).

**Important distinction:** Token embeddings used inside a language model and embeddings produced by a dedicated text-embedding model serve related but different purposes. A model's internal token vectors are not automatically interchangeable with vectors from an external embedding model.

We will study practical embeddings and semantic search in Module 06.

---

## 5. Transformer Architecture

The Transformer architecture is a major foundation of modern LLMs.

Earlier sequence models often processed information recurrently. Transformers use attention mechanisms that allow representations to incorporate information from other relevant positions in the input, subject to the model's attention design and masking rules.

A simplified Transformer-based language model pipeline is:

```text
Input Text
    |
    v
Tokenizer
    |
    v
Token IDs
    |
    v
Token Embeddings + Position Information
    |
    v
Transformer Layers
    |
    v
Output Scores (Logits)
    |
    v
Token Selection
    |
    v
Generated Text
```

This is a simplified conceptual diagram. Specific model architectures may differ in their embedding, positional encoding, attention, normalization, and output designs.

### Main Components

**1. Token embeddings**

Represent token IDs as numerical vectors.

**2. Position information**

Helps the model represent token order or position. Different architectures use different approaches.

**3. Attention**

Allows the model to combine information from relevant token positions.

**4. Feed-forward layers**

Transform the representations within each Transformer block.

**5. Normalization and residual connections**

Help support stable and effective neural network computation.

**6. Output projection**

Produces scores over the model's possible next tokens.

You have already studied neural networks and deep learning. The goal here is to connect that knowledge to the architecture used by many modern language models rather than repeat an entire Deep Learning course.

---

## 6. What Is Attention?

Attention is a mechanism that determines how information from different positions contributes to a representation.

For example, consider:

```text
The developer opened the project because it contained the required files.
```

When processing `it`, the model may use information from `the project` and other relevant context to interpret the sentence.

Attention helps model relationships across tokens. It does not guarantee perfect understanding, and the example is an intuition rather than a claim about a specific attention map.

### Query, Key, and Value

In a common attention formulation, input representations are transformed into:

- **Query (Q):** Represents what a position is looking for.
- **Key (K):** Represents information used to compare positions.
- **Value (V):** Represents information that can be combined into the result.

Scaled dot-product attention is commonly expressed as:

```text
Attention(Q, K, V) =
    softmax(QKᵀ / √dₖ)V
```

Here, `dₖ` is the key-vector dimension.

For decoder-only language models, causal masking prevents a position from attending to future tokens during next-token prediction.

You do not need to memorize every mathematical detail before writing applications. You should understand the purpose of attention and recognize how it fits into the model.

---

## 7. Common LLM Architecture Families

LLMs do not all use the same architecture or objective.

| Architecture family | General idea | Common applications |
|---|---|---|
| Encoder-only | Builds contextual representations of input text | Classification, representation learning, extraction |
| Decoder-only | Generates sequences autoregressively | Text generation, chat, code generation |
| Encoder-decoder | Encodes input and generates an output sequence | Translation, summarization, sequence-to-sequence tasks |

These are broad categories, and real systems can include additional components or different designs.

For example, many chat-oriented generative language models use decoder-only Transformers. Encoder-only models can be particularly useful for classification or embedding-related tasks.

The best architecture depends on the task, available model, performance requirements, and deployment constraints.

---

## 8. Pretraining and Post-Training

A model's behavior depends on how it is trained and adapted.

### 8.1 Pretraining

Pretraining teaches a model general patterns from large training datasets using a training objective appropriate to the model.

For an autoregressive language model, a common objective is next-token prediction.

Pretraining helps establish broad language and pattern capabilities, but it does not automatically make a model a reliable assistant for every task.

### 8.2 Post-Training

Post-training refers to additional training or adaptation after the initial training stage. Depending on the model, this can include:

- Supervised fine-tuning.
- Instruction tuning.
- Preference optimization.
- Other alignment or task-specific techniques.

These techniques can improve instruction following, response style, or other desired behaviors. Their methods and effectiveness vary across models.

### 8.3 Inference

Inference is the process of using a trained model to generate outputs or make predictions.

For example, sending a message to a model provider's API usually triggers inference. It does not mean that the underlying model is being retrained on your prompt.

| Concept | Purpose |
|---|---|
| Pretraining | Learn broad patterns from training data |
| Post-training | Adapt the model's behavior or capabilities |
| Inference | Generate outputs using the trained model |
| Fine-tuning | Further train or adapt a model for particular objectives or data |

We will explore fine-tuning in Module 13.

---

## 9. Context Windows

A context window is the amount of tokenized information a model can process within a request or interaction, according to its specific architecture and provider limits.

Depending on the model and interface, relevant context can include:

- System instructions.
- Conversation history.
- Current user input.
- Retrieved documents.
- Tool results.
- Other model-specific input components.

Output generation may also have separate limits or share an overall context budget, depending on the model and API.

### Example

Suppose an application sends:

- Instructions: 500 tokens.
- Conversation history: 2,000 tokens.
- Retrieved documents: 6,000 tokens.
- Current question: 300 tokens.

The input total is 8,800 tokens, before accounting for any other request-specific components.

A model with an applicable context limit below the required total may reject the request or require the application to reduce the input.

### Engineering Best Practices

- Send relevant information instead of every available document.
- Track input and output token usage.
- Check the selected model's current limits.
- Handle oversized requests gracefully.
- Summarize or retrieve context when appropriate.
- Test whether important information remains available in long contexts.

A larger context window does not guarantee that the model will use every detail correctly.

---

## 10. Model Parameters vs Generation Settings

These two concepts are easy to confuse.

### Model Parameters

Model parameters are learned numerical values inside the trained neural network. They are adjusted during training and help determine the model's behavior.

A model with billions of parameters has a large set of learned values. Parameter count alone does not determine quality, speed, or suitability for a task.

### Generation Settings

Generation settings control aspects of how a response is produced at inference time.

Examples include:

- Temperature.
- Top-p.
- Maximum output tokens.
- Stop sequences.
- Other provider-specific sampling options.

These settings do not normally retrain or rewrite the model's learned parameters.

### Comparison

| Model parameters | Generation settings |
|---|---|
| Learned during training | Supplied or selected during inference |
| Form part of the trained model | Control aspects of output generation |
| Usually require training or adaptation to change | Often adjustable per request |
| Influence the model's learned behavior | Influence how candidate outputs are selected or constrained |

Not every provider exposes every setting, and the supported ranges and meanings can vary.

---

## 11. Temperature and Top-p

Temperature and top-p are generation controls used by many language-model interfaces. They are not supported identically by every model or provider.

### 11.1 Temperature

Temperature adjusts the distribution used to select the next token.

As a broad intuition:

- Lower temperature tends to favor higher-probability tokens.
- Higher temperature can make lower-probability choices more likely.
- Very low temperature does not guarantee factual correctness.
- Higher temperature does not automatically make an answer more creative or better.

For a task such as extracting an invoice number, you may prefer consistent output. For brainstorming, you might test settings that allow more variation.

Always evaluate the actual behavior instead of relying only on the setting's name.

### 11.2 Top-p

Top-p, also called nucleus sampling, restricts token selection to a set of high-probability candidates whose cumulative probability reaches a configured threshold, followed by sampling according to the implementation.

A lower threshold generally restricts the candidate set more strongly, while a higher threshold can allow a broader set.

### 11.3 Practical Guidance

- Start with the model's documented defaults.
- Change one setting at a time.
- Compare outputs on the same test prompts.
- Record the model, settings, and results.
- Follow the provider's documentation for supported controls.

Do not assume that the same numeric settings produce equivalent behavior across different models.

---

## 12. Proprietary Models vs Open-Weight Models

Model availability is an important engineering decision.

### Proprietary or Hosted Models

These are commonly accessed through a provider's API or hosted service.

**Potential advantages:**
- Easier initial setup.
- No need to operate model infrastructure yourself.
- Provider-managed inference infrastructure.
- Access to provider-specific capabilities.

**Potential trade-offs:**
- Usage costs.
- Network dependency.
- Provider-specific APIs and limitations.
- Data-handling and compliance considerations.
- Less control over the underlying model.

### Open-Weight Models

Open-weight models make trained model weights available under specified terms. They may be run locally or deployed on your own infrastructure when hardware and licenses permit.

**Potential advantages:**
- More control over deployment.
- Opportunities for local or private inference.
- Greater flexibility for experimentation and adaptation.
- Potentially different cost economics at scale.

**Potential trade-offs:**
- Hardware requirements.
- Serving and maintenance work.
- Performance and memory constraints.
- Licensing restrictions or obligations.
- Security and operational responsibilities.

**Important:** Open weights do not automatically mean unrestricted commercial use or fully open training data. Always review the particular model's license and terms.

---

## 13. Quantization and Local Inference

### What Is Quantization?

Quantization represents model values using lower-precision numerical formats or other compressed representations.

Depending on the method and model, quantization can reduce memory use and improve inference efficiency, but it may also affect output quality.

### Why Is It Useful?

Large models may require substantial memory to load and run. Quantization can make some models more practical on consumer hardware.

### Local Inference

Local inference means running a model on your own computer or infrastructure instead of sending the inference request to an external hosted API.

Possible benefits include more deployment control and reduced reliance on an external service. However, local inference still requires careful security, resource management, and licensing review.

### Things to Evaluate

- Available RAM and GPU memory.
- Model size and quantization format.
- Inference speed.
- Output quality.
- CPU/GPU compatibility.
- License and permitted usage.
- Privacy and local logging.

A quantized model is not necessarily better than a full-precision model. Choose based on measured quality, resource limits, and the requirements of your application.

---

## 14. How to Choose an LLM

Do not select a model based only on popularity or parameter count.

Evaluate these factors:

| Factor | Questions to ask |
|---|---|
| Task quality | Does it perform well on your actual use case? |
| Accuracy | How often does it produce incorrect or unsupported answers? |
| Structured output | Can it reliably produce the required format? |
| Tool calling | Does it support the required tool-calling interface? |
| Context length | Can it handle the input and output requirements? |
| Latency | Is it fast enough for the application? |
| Cost | What is the cost under realistic usage? |
| Privacy | Can it meet your data-handling requirements? |
| Deployment | Can it run in your intended environment? |
| License | Are your intended uses permitted? |
| Reliability | What are the service limits and failure modes? |

### A Practical Selection Process

1. Define the task and its success criteria.
2. Prepare representative test examples.
3. Choose a few candidate models.
4. Run the same tests on each candidate.
5. Compare quality, latency, cost, and failure behavior.
6. Check provider documentation and licensing.
7. Choose the simplest model that meets your requirements.
8. Re-evaluate when the model, prompt, data, or application changes.

A smaller or cheaper model may be sufficient for classification or extraction, while a more capable model may be justified for complex reasoning or difficult language tasks.

---

## 15. Common LLM Limitations

LLMs are powerful but imperfect.

### Hallucinations

A model can generate plausible-sounding but incorrect information.

**Response:** Use evaluation, trusted sources, retrieval when appropriate, and human review for high-impact decisions.

### Knowledge Gaps

A model may not know recent events or private information.

**Response:** Supply approved information through suitable retrieval or tools.

### Prompt Sensitivity

Small changes in input can sometimes produce different outputs.

**Response:** Test representative prompts and maintain regression tests.

### Long-Context Challenges

A model may overlook relevant details in a large input.

**Response:** Improve context selection and evaluate performance on long documents.

### Nondeterministic Outputs

Some generation configurations can produce different responses to the same input.

**Response:** Use suitable settings, structured outputs, validation, and automated tests. Even when randomness is reduced, identical outputs are not guaranteed across every system.

### Cost and Latency

Long inputs, long outputs, repeated requests, and larger models can increase cost and response time.

**Response:** Measure real usage, reduce unnecessary calls, and select appropriate models.

---

## 16. Practical Lab — Inspect LLM Behavior

This lab connects the concepts to a small experiment.

### Objective

Compare how a language model responds to different prompts and generation settings.

### Tasks

1. Choose a supported model through a provider API or a local inference tool.
2. Send a simple question.
3. Record the model identifier and request settings.
4. Repeat the same task with a different prompt.
5. If supported, compare lower and higher temperature settings.
6. Inspect the response length and consistency.
7. Check factual claims rather than judging only how convincing the text sounds.
8. Record token usage, latency, or estimated cost when available.

### Suggested Prompt

```text
Explain the difference between a list and a tuple in Python.
Give one short example of each.
```

Then try:

```text
Explain the difference between a list and a tuple in Python.
Assume I am a beginner. Use a comparison table and one short example.
```

Compare the outputs. Identify which changes came from the instructions and which may have come from generation settings or model variability.

### Deliverables

- A runnable inference script or notebook.
- The selected model identifier.
- The prompts and supported settings tested.
- A short comparison of the outputs.
- Notes on quality, limitations, latency, and cost.
- No committed secrets or API keys.

**Completion rule:** Mark the lab complete only after running the experiment and recording your observations.

---

## 17. Interview Questions

### Q1. What is an LLM?

An LLM is a model designed to process and generate language. Many modern LLMs use Transformer architectures and are trained on large datasets.

### Q2. What is a token?

A token is a unit of text processed by a model. It can be a word, part of a word, punctuation, or another tokenizer-defined unit.

### Q3. What is the purpose of a Transformer?

A Transformer architecture uses attention and other neural network components to process relationships between token representations and produce useful output representations.

### Q4. What is attention?

Attention is a mechanism that combines information from different positions according to learned relationships and the architecture's attention rules.

### Q5. What is the difference between pretraining and inference?

Pretraining learns model parameters from training data. Inference uses a trained model to generate outputs or predictions.

### Q6. What is a context window?

A context window is the amount of tokenized information a model can process within the applicable context limit.

### Q7. What is the difference between model parameters and temperature?

Model parameters are learned values within the model. Temperature is an inference-time generation setting that influences token selection.

### Q8. Does a larger model always perform better?

No. Performance depends on the model, training, task, evaluation method, inference setup, and deployment constraints.

### Q9. What is quantization?

Quantization uses lower-precision representations or other compression methods to reduce resource requirements, potentially at the cost of some quality.

### Q10. What is the difference between open-weight and proprietary models?

Open-weight models make their trained weights available under specific terms. Proprietary models are generally accessed under provider-controlled terms. Availability and license conditions vary.

### Q11. Why can an LLM hallucinate?

The generation process can produce plausible content that is not supported by facts or available evidence. The model does not guarantee that every generated claim is true.

### Q12. How should you choose a model for a production application?

Test candidate models on representative tasks and compare quality, latency, cost, reliability, privacy, deployment needs, and licensing.

---

## 18. Module Completion Checklist

- [ ] Explain how an LLM generates text.
- [ ] Understand tokens and tokenization.
- [ ] Explain embeddings and distinguish internal token embeddings from dedicated embedding models.
- [ ] Understand the purpose of Transformers and attention.
- [ ] Distinguish common model architecture families.
- [ ] Explain pretraining, post-training, and inference.
- [ ] Understand context windows.
- [ ] Distinguish model parameters from generation settings.
- [ ] Explain temperature and top-p at a conceptual level.
- [ ] Compare hosted and open-weight models.
- [ ] Understand quantization and local inference.
- [ ] Complete the practical lab.
- [ ] Answer the interview questions.
- [ ] Commit your code and notes to GitHub.

---

## 19. Key Takeaways

- LLMs generate language using learned model parameters and a token-generation process.
- Tokenization determines how text is represented as model inputs.
- Transformers and attention are important foundations of many modern LLMs.
- Pretraining, post-training, and inference serve different purposes.
- Context windows constrain how much information can be processed in a request.
- Model parameters are different from inference-time generation settings.
- Temperature and top-p influence token selection but do not guarantee quality.
- Hosted and open-weight models have different operational and licensing trade-offs.
- Quantization can reduce resource use but may affect output quality.
- Model selection should be based on evaluation and engineering requirements, not popularity alone.

---

## 20. What's Next?

**Module 03 — LLM APIs and Model Providers**

Next, we will connect these concepts to real applications by learning how to:

- Configure model-provider SDKs.
- Manage API keys securely.
- Send requests and handle responses.
- Understand messages and conversation roles.
- Stream generated responses.
- Implement timeouts, retries, and backoff.
- Handle rate limits and errors.
- Use asynchronous requests where appropriate.
- Track token usage and cost.
- Test provider integrations and prepare for provider changes.

The goal is to move from understanding LLMs to integrating them reliably into software applications.

---

**Learning philosophy:** Understand the model, run an experiment, measure the result, document your findings, and then move to the next module.
