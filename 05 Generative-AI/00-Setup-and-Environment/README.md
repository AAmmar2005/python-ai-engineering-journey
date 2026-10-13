
# Module 00 — Setup and Environment

> **Course:** Generative AI — From Scratch to GenAI Engineer  
> **Stage:** Stage 1 — Foundations  
> **Module:** 00 — Setup and Environment  
> **Planned Date:** July 1, 2026  
> **Level:** Beginner to Intermediate  
> **Prerequisites:** Basic Python, Git, and command-line familiarity  
> **Primary Technologies:** Python, pip/uv, virtual environments, Git, Jupyter, environment variables  
> **Goal:** Build a clean, reproducible, and secure development environment for Generative AI.

---

## 1. What Is a GenAI Development Environment?

A development environment is the collection of software, libraries, configuration, and tools required to build and run an application.

For Generative AI (GenAI), your environment may include:

- Python for application logic.
- A virtual environment to isolate dependencies.
- Provider SDKs to communicate with language models.
- Environment variables to configure API credentials.
- Git to track changes.
- Jupyter notebooks for experimentation.
- Python modules for reusable application code.
- Testing and logging tools for reliability.

For example, an LLM application might accept a question, send it to a model provider, receive a response, and return that response to the user.

Before implementing the application, you need a reliable environment in which dependencies are installed, credentials are protected, and the code can be reproduced.

### Example application flow

```text
Developer
    |
    v
Python Application
    |
    v
LLM Provider SDK
    |
    v
Model Provider API
    |
    v
Generated Response
```

Your local Python environment runs the application. If you use a hosted model API, inference usually happens on the provider's infrastructure rather than on your computer.

---

## 2. Why Does This Module Matter?

A poorly configured environment can cause problems such as:

- Packages conflicting with one another.
- Code working on one computer but failing on another.
- API credentials accidentally appearing in GitHub.
- Different dependency versions producing different behavior.
- Notebooks becoming difficult to reproduce.
- Errors that are difficult to diagnose.

A professional AI engineer should be able to create an environment that another developer can configure and run using documented instructions.

This module focuses on the engineering setup, not on repeating the Python programming course.

---

## 3. Learning Objectives

After completing this module, you should be able to:

1. Explain why isolated Python environments are useful.
2. Create and activate a virtual environment.
3. Install and manage Python packages.
4. Organize notebooks and reusable Python modules.
5. Configure environment variables and API keys safely.
6. Create a suitable `.gitignore`.
7. Track changes with Git.
8. Record dependencies for reproducible installations.
9. Add basic logging and troubleshoot common errors.
10. Explain when CPU, GPU, or a hosted model API is appropriate.
11. Prepare a clean foundation for the remaining GenAI modules.

---

## 4. Prerequisites

You should be comfortable with:

- Running Python scripts.
- Installing a Python package.
- Navigating directories in a terminal.
- Basic Git commands such as `git add`, `git commit`, and `git push`.

You do not need to relearn Python syntax, object-oriented programming, NumPy, or Deep Learning here.

### Important distinction

A virtual environment isolates Python packages. It does not isolate operating-system processes or replace a security sandbox.

---

## 5. Core Concepts

### 5.1 Python and virtual environments

A Python virtual environment is an isolated location for the packages used by a particular project.

Suppose Project A requires one version of a library while Project B requires another. Installing everything globally may create conflicts.

A virtual environment helps keep those dependencies separate.

Create a project directory:

```bash
mkdir genai-learning
cd genai-learning
```

Create a virtual environment:

```bash
python -m venv .venv
```

On some systems, use `python3` instead of `python`.

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

On macOS or Linux:

```bash
source .venv/bin/activate
```

Check which interpreter is being used:

```bash
python --version
python -c "import sys; print(sys.executable)"
```

When the environment is active, the interpreter should normally point to the project's `.venv` directory.

To leave the environment:

```bash
deactivate
```

### 5.2 Package management

Python packages provide reusable functionality.

For example, a provider SDK allows your Python application to communicate with a model API without manually implementing the entire HTTP protocol.

Install packages using pip:

```bash
python -m pip install --upgrade pip
python -m pip install python-dotenv pydantic pytest
```

Alternatively, use `uv` if you prefer a modern Python project and dependency manager. Choose one primary workflow and document it clearly.

For a simple environment, record installed dependencies:

```bash
python -m pip freeze > requirements.txt
```

Install them in another compatible environment:

```bash
python -m pip install -r requirements.txt
```

`pip freeze` records installed package versions, but it is not a complete dependency-management strategy for every project. For larger projects, use a dependency file with explicit project dependencies and a lockfile when supported by your chosen tooling.

### 5.3 Project structure

Keep experiments separate from reusable code.

```text
00-Setup-and-Environment/
|
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
|
├── notebooks/
|   └── 01-environment-check.ipynb
|
├── src/
|   └── genai_setup/
|       └── __init__.py
|
├── examples/
|   └── environment_check.py
|
└── tests/
    └── test_environment.py
```

This is a teaching example, not a requirement to create every file immediately.

### 5.4 Jupyter notebooks versus Python modules

| Feature | Jupyter notebook | Python module |
|---|---|---|
| Best use | Experiments and demonstrations | Reusable application logic |
| Execution | Cell by cell | Script, import, or application entry point |
| Strength | Immediate feedback and explanations | Testing, reuse, maintainability |
| Limitation | Hidden execution state can cause confusion | Less convenient for exploratory work |

Use notebooks to understand concepts and Python modules to build maintainable applications.

### 5.5 Environment variables and secrets

Never hardcode real API keys in your source code.

Use a `.env` file for local development when appropriate, and keep it out of version control.

Example `.env.example`:

```dotenv
# Replace placeholders with your local configuration.
OPENAI_API_KEY=your_api_key_here
MODEL_NAME=your_chosen_model
```

Example `.gitignore`:

```gitignore
.venv/
__pycache__/
*.py[cod]
.env
.ipynb_checkpoints/
.pytest_cache/
.ruff_cache/
.DS_Store
```

The `.env.example` file can be committed because it contains placeholders, not secrets.

For a real deployment, use your hosting platform's secret-management facility rather than depending on a local `.env` file.

### 5.6 Basic logging

Logging helps developers understand what an application is doing.

Create `examples/environment_check.py`:

```python
import logging
import sys
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
)

def main() -> None:
    logging.info("GenAI environment check started")
    logging.info("Python version: %s", sys.version.split()[0])
    logging.info("Working directory: %s", Path.cwd())
    logging.info("Environment check completed")

if __name__ == "__main__":
    main()
```

Run it from the project directory:

```bash
python examples/environment_check.py
```

Expected behavior: the script prints the Python version, working directory, and progress messages.

Do not log API keys, passwords, private prompts, or sensitive user information.

---

## 6. How a GenAI Environment Works Internally

A hosted LLM application usually has the following lifecycle:

```text
1. Configure the application
          |
          v
2. Load settings and secrets
          |
          v
3. Validate configuration
          |
          v
4. Execute Python application
          |
          v
5. Send request through provider SDK
          |
          v
6. Receive and process the response
          |
          v
7. Log safe operational information
```

The provider SDK typically handles request serialization and communication with the API. Your application remains responsible for configuration, validation, error handling, and safe processing of the response.

For local inference, the lifecycle differs because the model runtime and model weights may also need to be installed or downloaded.

---

## 7. CPU, GPU, and Hosted Inference

| Approach | What happens | Typical use |
|---|---|---|
| CPU | Computation runs on the processor | Setup, preprocessing, small models |
| GPU | Compatible workloads use a graphics processor | Model training or accelerated local inference |
| Hosted API | The provider runs the model remotely | Learning APIs and building applications without managing model hardware |

You do not need a powerful GPU to begin learning GenAI through hosted APIs.

Local inference can reduce dependence on external APIs, but it introduces hardware, memory, model licensing, deployment, and performance considerations.

---

## 8. Best Practices

- Use one virtual environment per project.
- Document the supported Python version.
- Install only the packages you need.
- Keep secrets out of source control.
- Use `.env.example` to document required configuration.
- Record dependencies and verify fresh installations.
- Use Git commits to track meaningful changes.
- Separate exploratory notebooks from reusable code.
- Use logging instead of scattering debugging print statements throughout production code.
- Test code in a clean environment before sharing it.
- Document any paid API, hardware, or service requirements.

---

## 9. Common Mistakes

| Mistake | Solution |
|---|---|
| Installing packages into the wrong interpreter | Check `sys.executable` and activate the correct environment |
| Committing `.env` | Add it to `.gitignore` and rotate exposed credentials |
| Assuming a GPU is mandatory | Begin with hosted APIs or CPU-friendly examples |
| Relying on notebook execution order | Restart the kernel and run cells from the beginning |
| Installing every available AI framework | Install only what the current exercise requires |
| Ignoring dependency versions | Document and test the environment |
| Logging sensitive information | Log operational metadata without exposing secrets |

If a secret is accidentally pushed to a public repository, removing the file is not enough. Revoke or rotate the exposed credential immediately.

---

## 10. Security and Reliability Checklist

Before moving to the next module, verify:

- [ ] The virtual environment works.
- [ ] Required packages install successfully.
- [ ] The Python version is documented.
- [ ] `.env` is excluded from Git.
- [ ] `.env.example` contains placeholders only.
- [ ] No real API keys exist in committed files.
- [ ] The example script runs successfully.
- [ ] Git changes can be reviewed before committing.
- [ ] Dependency installation is reproducible enough for another learner to follow.
- [ ] Any external service requirements are documented.

---

## 11. Practical Exercises

### Beginner: Create Your Environment

Create a virtual environment, install Pydantic and Pytest, and write a script that displays your Python version and project directory.

**Acceptance criteria:** the script runs inside the virtual environment and its output is documented.

### Intermediate: Safe Configuration

Create `.env.example`, `.gitignore`, and a configuration-loading example.

Use placeholder credentials and verify that missing required configuration produces a clear error.

**Acceptance criteria:** no secrets are hardcoded, and missing configuration is handled explicitly.

### Challenge: Reproducible GenAI Starter

Create a small project containing a Python module, a notebook, logging, dependency documentation, and a basic test.

Test the project from a fresh virtual environment.

**Acceptance criteria:** another developer can follow your README, install dependencies, run the example, and run the tests.

---

## 12. Interview Questions

**Q1. Why should you use a virtual environment?**

It isolates project dependencies and reduces conflicts between projects.

**Q2. What is the difference between a package and a virtual environment?**

A package provides functionality. A virtual environment isolates an interpreter and its installed packages for a project.

**Q3. Why should API keys not be committed to GitHub?**

Anyone with access to the committed secret may be able to misuse it, causing security incidents or unexpected charges.

**Q4. When do you need a GPU for GenAI?**

A GPU is useful for many local model-training and inference workloads. Hosted APIs allow you to use remote model infrastructure without owning a GPU.

**Q5. Why are notebooks not always suitable for production application logic?**

They can depend on hidden execution state and are harder to structure and test consistently than reusable Python modules.

**Q6. What is the purpose of a dependency lockfile?**

It records resolved dependency versions so compatible environments can be recreated more consistently. Its exact behavior depends on the package-management tool.

**Q7. What is the difference between logging and testing?**

Logging records events during execution. Testing checks whether the code behaves as expected.

---

## 13. Key Takeaways

- A clean environment makes GenAI projects easier to develop and reproduce.
- Virtual environments prevent many dependency conflicts.
- API credentials must be protected.
- Hosted APIs are sufficient for starting GenAI development.
- Notebooks support experimentation; modules support reusable engineering.
- Logging, testing, dependency management, and Git are part of professional development.

---

## 14. Next Module

**Module 01 — GenAI Fundamentals**

Next, you will learn what Generative AI is, how it differs from traditional Machine Learning, and how text, image, audio, video, and multimodal models fit into real-world applications.

We will begin with first principles and build toward the architecture of practical GenAI systems.

**The objective is not merely to run code. It is to understand what you are building and why.**
