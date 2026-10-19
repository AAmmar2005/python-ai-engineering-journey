
# 🚀 09 — Advanced RAG and Evaluation

> Move beyond basic RAG. Learn to improve retrieval quality, rank relevant evidence, optimize context, evaluate answers, and build more reliable knowledge-grounded AI applications.

---

## 📅 Learning Schedule

| Detail | Information |
|---|---|
| **Planned Date** | July 25, 2026 |
| **Learning Stage** | Stage 2 — Retrieval and RAG Foundations |
| **Difficulty** | Intermediate → Advanced |
| **Primary Language** | Python |
| **Core Technologies** | Python, Embeddings, Vector Search, Hybrid Search, Rerankers, RAG Evaluation |
| **Prerequisites** | Embeddings, Vector Databases, RAG Fundamentals |
| **Previous Module** | [08 — RAG Fundamentals](../08-RAG-Fundamentals/README.md) |
| **Next Module** | [10 — LLM Frameworks and LangChain](../10-LLM-Frameworks-and-LangChain/README.md) |

### 🎯 Learning Goal

Build an evaluated RAG pipeline that retrieves stronger evidence, handles difficult questions, measures answer quality, and identifies the causes of retrieval and generation failures.

---

## 🗺️ Learning Roadmap

```text
Basic RAG
   │
   ▼
Analyze Retrieval Failures
   │
   ▼
Advanced Chunking
   │
   ▼
Query Transformation
   │
   ▼
Hybrid Search
   │
   ▼
Reranking + Context Optimization
   │
   ▼
Retrieval and Answer Evaluation
   │
   ▼
Reliable Advanced RAG Pipeline
```

---

## 🎯 1. Learning Objectives

By completing this module, you will be able to:

- Identify common failure modes in basic RAG.
- Improve document chunking and metadata design.
- Understand query rewriting, decomposition, and multi-query retrieval.
- Combine keyword and vector search through hybrid retrieval.
- Use reranking to improve the ordering of retrieved passages.
- Understand parent-child retrieval and contextual retrieval strategies.
- Apply similarity thresholds and metadata filters carefully.
- Evaluate retrieval quality separately from answer quality.
- Understand metrics such as Recall@K, Precision@K, MRR, and nDCG.
- Build an evaluation dataset with expected evidence and answers.
- Diagnose hallucinations, missing evidence, and irrelevant context.
- Compare alternative RAG configurations through experiments.

---

## 🧠 2. Why Basic RAG Is Not Enough

A basic RAG application typically follows this process:

1. Embed the user's question.
2. Retrieve the nearest document chunks.
3. Add the chunks to a prompt.
4. Ask the LLM to generate an answer.

This is a useful starting point, but it can fail in several ways.

| Problem | Example | Possible Improvement |
|---|---|---|
| Poor chunk boundaries | A definition is separated from its explanation | Improve chunking strategy |
| Keyword mismatch | User says "refund" but document says "reimbursement" | Hybrid search or query rewriting |
| Irrelevant top results | Similar wording but wrong subject | Reranking and better filters |
| Missing information | Answer requires two separate passages | Query decomposition or broader retrieval |
| Too much context | Important evidence is buried among irrelevant chunks | Context filtering and compression |
| Unsupported answer | Model invents a detail absent from the evidence | Grounding instructions and evaluation |
| Stale documents | Old policy versions remain searchable | Document versioning and re-indexing |

**Core principle:** Do not immediately change the LLM when a RAG answer is wrong. First identify whether the failure occurred during ingestion, retrieval, context construction, or generation.

---

## 🔬 3. Understand the RAG Failure Pipeline

A useful way to debug RAG is to divide it into stages.

```text
Source Documents
       │
       ▼
[1] Ingestion and Parsing
       │
       ▼
[2] Chunking and Metadata
       │
       ▼
[3] Embedding and Indexing
       │
       ▼
[4] Retrieval and Ranking
       │
       ▼
[5] Context Construction
       │
       ▼
[6] LLM Generation
       │
       ▼
[7] Answer and Citation Validation
```

### How to Diagnose Each Stage

- **Ingestion:** Was the relevant information extracted correctly?
- **Chunking:** Is the required information present together in useful chunks?
- **Indexing:** Were the vectors created using the intended model?
- **Retrieval:** Did the system find the relevant evidence?
- **Context construction:** Did the prompt include the important passages?
- **Generation:** Did the model interpret the supplied evidence correctly?
- **Validation:** Do the answer and source references support the claims made?

This stage-by-stage approach makes debugging more systematic and prevents unnecessary model or infrastructure changes.

---

# 🧩 4. Advanced Chunking Strategies

Chunking determines how documents are divided before embeddings are generated.

There is no universally optimal chunk size. The right choice depends on document structure, query type, embedding model, and the information users need.

### 4.1 Fixed-Size Chunking

Splits text into chunks using a configured character or token limit.

**Advantages**
- Simple to implement.
- Predictable chunk sizes.
- Useful for initial experiments.

**Limitations**
- May split sentences or sections.
- Can separate a fact from its explanation.

### 4.2 Overlapping Chunking

Adjacent chunks share some text.

```text
Document
   │
   ├── Chunk 1: [A B C D E]
   ├── Chunk 2:       [D E F G H]
   └── Chunk 3:             [G H I J K]
```

Overlap can preserve context across boundaries, but excessive overlap creates duplicate content and increases storage and embedding costs.

### 4.3 Structure-Aware Chunking

Splits documents using natural boundaries such as:

- Headings
- Paragraphs
- Sections
- Tables
- Code blocks
- Pages

This can work especially well for technical documentation, manuals, and policy documents.

### 4.4 Parent-Child Retrieval

Stores smaller child chunks for precise retrieval while preserving larger parent sections for additional context.

```text
Parent Section
├── Child Chunk 1
├── Child Chunk 2
└── Child Chunk 3
```

The system retrieves a relevant child chunk and can then return its parent section to the LLM.

This balances precise retrieval with sufficient surrounding context.

### 4.5 Compare Chunking Strategies

| Strategy | Best Starting Use Case | Main Trade-Off |
|---|---|---|
| Fixed-size | General text | May split meaningful sections |
| Overlapping | Text with boundary-sensitive context | More duplicate content |
| Structure-aware | Manuals, policies, documentation | Requires reliable parsing |
| Parent-child | Long documents needing local precision and broader context | More complex storage and retrieval |
| Semantic chunking | Documents with changing topics | Higher processing complexity and cost |

### Practical Exercise

Create three chunking configurations and test them on the same document collection.

Record:

- Chunk count
- Average chunk length
- Retrieval Recall@K
- Duplicate retrieval rate
- Answer quality
- Indexing cost

Choose the configuration based on evaluation rather than intuition alone.

---

# 🔎 5. Query Transformation

The user's original question is not always the best search query.

Query transformation modifies or expands a question to improve retrieval while preserving the user's intent.

### 5.1 Query Rewriting

Convert an unclear question into a clearer search query.

**Original query:**

> What about leave if I'm ill?

**Rewritten query:**

> What is the employee sick-leave policy, including notification and documentation requirements?

The rewritten query can make relevant terminology easier to retrieve.

However, the rewriting model must not invent missing facts or change what the user is asking.

### 5.2 Multi-Query Retrieval

Generate multiple search queries from one question, retrieve candidates for each, and combine the results.

Example:

```text
Original question:
How do I recover my account?

Search queries:
1. How to reset a forgotten password
2. Account recovery procedure
3. Troubleshooting login access
```

The system can combine the candidate results and remove duplicate document IDs.

Multi-query retrieval can improve recall, but it can also introduce irrelevant results and increase cost.

### 5.3 Query Decomposition

Break a complex question into smaller questions.

Example:

> Compare the sick-leave and annual-leave policies, including eligibility and approval requirements.

Possible sub-questions:

1. What are the sick-leave requirements?
2. What are the annual-leave requirements?
3. How do their eligibility rules differ?
4. What approval procedures apply to each?

Retrieve evidence for each sub-question and combine the results before generation.

### 5.4 When to Use Each Technique

| Technique | Useful When |
|---|---|
| Query rewriting | The original question is vague or uses unfamiliar wording |
| Multi-query retrieval | Important documents use different terminology |
| Query decomposition | The question contains several independent information needs |
| Metadata filtering | The relevant document set can be restricted by known attributes |

Do not use query transformation for every question automatically. Measure whether it improves results enough to justify the additional latency and cost.

---

# 🔀 6. Hybrid Search

Hybrid search combines keyword-based retrieval with vector-based retrieval.

### Why Combine Them?

Vector search is useful for semantic similarity and paraphrases. Keyword search can be especially useful for exact terminology, product IDs, policy codes, names, and error messages.

Consider this query:

> What does error `AX-1042` mean?

A keyword search may be excellent at finding the exact error code. Vector search alone may not consistently prioritize the document containing that precise identifier.

### Hybrid Retrieval Architecture

```text
                    User Query
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
       Keyword Search         Vector Search
             │                     │
             ▼                     ▼
       Ranked Results         Ranked Results
             │                     │
             └──────────┬──────────┘
                        ▼
                 Result Fusion
                        │
                        ▼
                 Candidate Set
                        │
                        ▼
                    Reranking
                        │
                        ▼
                 Final Documents
```

### Reciprocal Rank Fusion (RRF)

Reciprocal Rank Fusion combines ranked lists without requiring the original ranking scores to be directly comparable.

A common formula is:

\[
\operatorname{RRF}(d)
=
\sum_{r \in R}
\frac{1}{k_0 + \operatorname{rank}_r(d)}
\]

Where:

- \(d\) is a candidate document.
- \(R\) is the set of ranked result lists.
- \(\operatorname{rank}_r(d)\) is the rank of the document in one list.
- \(k_0\) is a smoothing constant.

A document that appears high in multiple ranked lists can receive a strong combined score.

RRF is one option for combining results. Weighted score fusion is another, but score normalization and weight selection require care.

### Practical Exercise

Build a small test set containing:

- Questions with exact product IDs.
- Questions using synonyms.
- Questions paraphrasing a policy.
- Questions requiring conceptual matches.

Compare keyword search, vector search, and hybrid search using the same evaluation dataset.

---

# 🎯 7. Reranking

Initial retrieval is usually optimized to find promising candidates efficiently. A reranker then evaluates those candidates more carefully.

For example:

```text
Query
  │
  ▼
Retrieve Top 30 Candidates
  │
  ▼
Reranker Scores Query + Candidate
  │
  ▼
Select Top 5
  │
  ▼
Build LLM Context
```

### Bi-Encoder vs. Cross-Encoder

| Feature | Bi-Encoder | Cross-Encoder |
|---|---|---|
| Processing | Encodes query and documents separately | Evaluates query-document pairs together |
| Initial search | Well suited to large candidate sets | Usually more expensive for exhaustive search |
| Candidate ranking | Fast vector retrieval | Often stronger relevance ranking for a smaller candidate set |
| Common use | First-stage retrieval | Second-stage reranking |

A cross-encoder score is not automatically a calibrated probability. Interpret it according to the model's documentation and evaluation results.

### When Should You Add a Reranker?

Consider one when:

- Relevant documents appear in the candidate set but rank too low.
- Top results are semantically related but not actually useful.
- Better context selection is worth the extra latency and compute.

A reranker cannot recover a relevant document that the first-stage retrieval never found. Measure candidate recall before judging reranking quality.

---

# 📦 8. Context Optimization

Retrieving relevant documents is only part of the problem. You must decide what to include in the LLM prompt.

Too little context may omit critical evidence. Too much context may increase cost, add noise, and make it harder for the model to use the important passages.

### Common Techniques

- **Top-K tuning:** Test how many chunks provide enough evidence.
- **Context deduplication:** Remove duplicate or nearly identical passages.
- **Relevance filtering:** Exclude candidates that fail an evaluated relevance criterion.
- **Parent-child expansion:** Add surrounding context when a small chunk is insufficient.
- **Context compression:** Retain useful information while reducing unnecessary text.
- **Source-aware ordering:** Preserve meaningful source relationships and metadata.

### Important Principle

Do not choose `top_k` or a similarity threshold using an arbitrary universal value.

Instead:

1. Build representative evaluation queries.
2. Inspect retrieved evidence.
3. Measure retrieval and answer quality.
4. Compare latency and token usage.
5. Select a configuration that meets your requirements.

A very high threshold may remove useful evidence. A very low threshold may add irrelevant context.

---

# 📊 9. RAG Evaluation

A production-oriented RAG system needs more than a few successful demonstrations.

You should evaluate retrieval, generation, citations, cost, and latency independently.

## 9.1 Retrieval Metrics

### Precision@K

Measures the fraction of the top-k retrieved results that are relevant.

\[
\operatorname{Precision@K}
=
\frac{\text{Relevant results in top K}}{K}
\]

### Recall@K

Measures the fraction of all known relevant documents that appear in the top-k results.

\[
\operatorname{Recall@K}
=
\frac{\text{Relevant results in top K}}
{\text{Total relevant results}}
\]

### Mean Reciprocal Rank (MRR)

Measures how highly the first relevant result is ranked across a collection of queries.

\[
\operatorname{MRR}
=
\frac{1}{|Q|}
\sum_{i=1}^{|Q|}
\frac{1}{\operatorname{rank}_i}
\]

Queries with no relevant result should contribute zero to this metric.

### nDCG

Normalized Discounted Cumulative Gain evaluates ranking quality when relevance has different grades, such as irrelevant, partially relevant, and highly relevant.

It rewards systems that rank highly relevant documents near the top.

## 9.2 Generation Metrics

| Metric | Evaluation Question |
|---|---|
| Correctness | Is the answer factually correct? |
| Faithfulness / Groundedness | Are the claims supported by the supplied evidence? |
| Answer relevance | Does the response address the user's question? |
| Citation correctness | Do cited sources support the associated claims? |
| Completeness | Does the answer include the required information? |
| Abstention quality | Does the system admit when evidence is insufficient? |

Some metrics can be estimated with LLM judges, but LLM-based evaluation can itself be biased or inconsistent. Use human-reviewed examples and deterministic checks where possible.

## 9.3 System Metrics

Also measure:

- End-to-end latency
- Retrieval latency
- Generation latency
- Input and output token usage
- Embedding and reranking cost
- Error rate
- Cache hit rate
- Indexing duration

High answer quality is important, but so are predictable latency, reliability, and operating cost.

---

# 🧪 10. Build an Evaluation Dataset

Create a dataset of realistic questions before making major changes to your retrieval pipeline.

Example `evaluation/questions.json`:

```json
[
  {
    "id": "q001",
    "question": "How can an employee request annual leave?",
    "relevant_sources": ["annual_leave_policy"],
    "expected_answer_points": [
      "Use the approved leave-management process"
    ]
  },
  {
    "id": "q002",
    "question": "What should an employee do when sick?",
    "relevant_sources": ["sick_leave_policy"],
    "expected_answer_points": [
      "Notify the manager",
      "Follow the sick-leave procedure"
    ]
  },
  {
    "id": "q003",
    "question": "What is the company's office address?",
    "relevant_sources": [],
    "expected_answer_points": [
      "The available documents do not provide this information"
    ]
  }
]
```

These examples are illustrative. Create the actual evaluation dataset from the documents and expected behavior of your own application.

### Evaluation Workflow

1. Create representative questions.
2. Label relevant documents or chunks.
3. Record expected answer points where appropriate.
4. Run each query through the same pipeline.
5. Calculate retrieval metrics.
6. Review generated answers and citations.
7. Compare configurations on the same dataset.
8. Investigate failures and repeat the evaluation after changes.

Keep a separate set of questions for final testing so you do not tune every decision against the same examples.

---

# 🛠️ 11. Practical Implementation — Retrieval Experiment

Build a small experiment that compares multiple retrieval configurations.

Suggested configurations:

| Configuration | Retrieval Method | Reranking |
|---|---|---|
| A | Vector search | No |
| B | Keyword search | No |
| C | Hybrid search | No |
| D | Hybrid search | Yes |

Keep the document collection, evaluation queries, and answer-generation settings consistent wherever possible.

Record your results in a table like this:

| Configuration | Recall@5 | MRR | Groundedness | Latency | Cost |
|---|---:|---:|---:|---:|---:|
| A — Vector | Measure | Measure | Measure | Measure | Measure |
| B — Keyword | Measure | Measure | Measure | Measure | Measure |
| C — Hybrid | Measure | Measure | Measure | Measure | Measure |
| D — Hybrid + Reranker | Measure | Measure | Measure | Measure | Measure |

Do not fill these cells with invented numbers. Run the experiment on your dataset and record the actual results.

### Deliverables

- Evaluation dataset.
- Baseline RAG implementation.
- At least two retrieval configurations.
- Metric calculation code.
- Results table.
- Failure analysis.
- Short explanation of the selected configuration and trade-offs.

---

# 🔐 12. Reliability and Security

Advanced retrieval introduces additional failure modes that should be considered explicitly.

### Document Permissions

Apply access-control rules before supplying retrieved content to the model. A user should never gain access to a document merely because its embedding is similar to their query.

### Prompt Injection

Documents can contain instructions designed to influence the model. Treat retrieved content as untrusted data, keep system instructions separate, and do not let document text authorize actions.

### Sensitive Information

Avoid exposing secrets or unnecessary personal information in prompts, logs, evaluation datasets, and debugging output.

### Citation Reliability

Do not generate source references from guesswork. Preserve source IDs and locations throughout ingestion and retrieval, then validate citations against the retrieved evidence.

### Evaluation Integrity

Do not rely exclusively on a single LLM judge or a small collection of hand-picked queries. Combine automated metrics with human-reviewed examples.

### Change Management

Track changes to:

- Source documents
- Chunking rules
- Embedding models
- Retrieval settings
- Reranking models
- Prompts
- Evaluation datasets

This makes regressions easier to diagnose.

---

# 🚀 13. Practical Project — Advanced RAG Evaluation System

## Project Goal

Upgrade your PDF RAG Assistant into a retrieval pipeline that can be measured, compared, and improved systematically.

### Core Requirements

- [ ] Support a realistic document collection.
- [ ] Preserve document and chunk metadata.
- [ ] Implement baseline vector retrieval.
- [ ] Add keyword or hybrid retrieval.
- [ ] Experiment with at least two chunking strategies.
- [ ] Add reranking or explain why it is unnecessary for your dataset.
- [ ] Build a labeled evaluation dataset.
- [ ] Calculate Recall@K, Precision@K, and MRR.
- [ ] Evaluate answer correctness and groundedness.
- [ ] Track citation quality.
- [ ] Measure latency and cost.
- [ ] Test questions with insufficient evidence.
- [ ] Document security and access-control assumptions.
- [ ] Produce an experiment report with real results.

### Suggested Project Structure

```text
09-Advanced-RAG-and-Evaluation/
├── README.md
├── requirements.txt
├── .env.example
├── src/
│   ├── ingestion/
│   │   ├── loaders.py
│   │   └── chunking.py
│   ├── retrieval/
│   │   ├── vector_search.py
│   │   ├── keyword_search.py
│   │   ├── hybrid_search.py
│   │   └── reranking.py
│   ├── generation/
│   │   └── answer.py
│   └── evaluation/
│       ├── retrieval_metrics.py
│       ├── answer_metrics.py
│       └── run_evaluation.py
├── data/
│   └── documents/
├── evaluation/
│   ├── questions.json
│   └── results/
├── tests/
│   ├── test_chunking.py
│   ├── test_retrieval.py
│   └── test_metrics.py
└── reports/
    └── experiment_report.md
```

### Stretch Goals

1. Add query rewriting and query decomposition.
2. Compare dense, sparse, and hybrid retrieval.
3. Add parent-child retrieval.
4. Compare multiple embedding models.
5. Evaluate a reranker against the baseline.
6. Add a FastAPI endpoint.
7. Build a small dashboard for evaluation metrics.
8. Add regression tests that run whenever retrieval code changes.

---

# 🎤 14. Interview Questions

**Q1. Why can basic RAG fail?**

Relevant evidence may not be extracted, chunked, indexed, or retrieved correctly. Even with good evidence, the LLM may misinterpret it or produce unsupported claims.

**Q2. What is hybrid search?**

Hybrid search combines keyword-based retrieval with vector-based retrieval to use both exact matching and semantic similarity.

**Q3. What is reranking?**

Reranking takes an initial set of retrieved candidates and scores or reorders them to improve relevance before context construction.

**Q4. What is query rewriting?**

Query rewriting transforms a user's question into a clearer or more retrieval-friendly query while preserving its intent.

**Q5. What is query decomposition?**

It breaks a complex question into smaller information needs that can be retrieved and answered separately.

**Q6. What is parent-child retrieval?**

It retrieves a focused child chunk but can return its larger parent section to provide additional context.

**Q7. What is the difference between Recall@K and Precision@K?**

Recall@K measures how many known relevant items were retrieved. Precision@K measures how many of the retrieved top-k items are relevant.

**Q8. What does MRR measure?**

Mean Reciprocal Rank measures how highly the first relevant result appears across a set of queries.

**Q9. Why should retrieval and generation be evaluated separately?**

A correct answer depends on both finding relevant evidence and using that evidence correctly. Separate measurements help identify which stage needs improvement.

**Q10. Does reranking always improve a RAG system?**

No. It can improve candidate ordering but adds latency and cost. It cannot recover relevant documents missing from the initial candidate set.

**Q11. How do you evaluate answer groundedness?**

Check whether claims are supported by the retrieved evidence, using human review, deterministic checks where possible, and carefully validated automated evaluation.

**Q12. How should a RAG system handle missing evidence?**

It should avoid fabricating an answer, communicate the limitation, and optionally request clarification or route the question to another trusted source.

---

# ✅ 15. Completion Checklist

- [ ] Understand the major RAG failure modes.
- [ ] Compare fixed-size, overlapping, and structure-aware chunking.
- [ ] Understand parent-child retrieval.
- [ ] Implement query rewriting or query decomposition.
- [ ] Compare keyword, vector, and hybrid search.
- [ ] Understand reciprocal rank fusion.
- [ ] Evaluate reranking.
- [ ] Experiment with context selection.
- [ ] Calculate Precision@K, Recall@K, and MRR.
- [ ] Evaluate answer correctness, groundedness, and citations.
- [ ] Measure latency and cost.
- [ ] Complete the Advanced RAG Evaluation System.
- [ ] Document real experimental results and limitations.

---

# 💡 16. Key Takeaways

- Advanced RAG is about improving the entire retrieval-and-generation pipeline, not just changing the LLM.
- Chunking, query transformation, hybrid search, and reranking address different retrieval problems.
- Retrieval metrics and answer metrics measure different aspects of quality.
- Evaluation datasets make improvements measurable and repeatable.
- A reranker cannot retrieve evidence that the first-stage search never found.
- More context is not always better; relevance and evidence quality matter.
- Security, source traceability, latency, and cost must be evaluated alongside answer quality.

---

# ➡️ Next Module

## 10 — LLM Frameworks and LangChain

**Planned Date:** August 1, 2026

Next, you will learn how LLM frameworks organize model calls, prompts, retrieval, output parsing, and reusable application components.

You will compare framework-based implementations with direct SDK code and learn when abstractions help — and when they add unnecessary complexity.

**Next folder:** `05-Generative-AI/10-LLM-Frameworks-and-LangChain/README.md`
