# 16 — Model Deployment

> Learn how to take a trained Machine Learning model and make it usable outside the notebook.

**Start Date:** March 3, 2026

---

## 🎯 Goal

The goal of this module is to understand the basic process of deploying a Machine Learning model.

I will learn how to:

- save a trained model
- load a trained model
- perform inference
- create a prediction API
- use FastAPI
- validate API requests
- Dockerize the API
- run the model locally
- understand cloud deployment
- understand batch inference
- understand real-time inference
- understand basic production considerations

This module is not meant to make me an advanced MLOps engineer.

My main long-term goal is:

**GenAI → RAG → Agentic AI → AI Engineering**

Therefore, I only need the ML deployment concepts that will help me later build and deploy AI systems.

---

# 1. What is Model Deployment?

Model deployment means making a trained Machine Learning model available for real-world use.

During training:

```text
Dataset
   ↓
Preprocessing
   ↓
Training
   ↓
Evaluation
   ↓
Trained Model
````

Deployment adds:

```text
Trained Model
      ↓
Save Model
      ↓
Load Model
      ↓
Prediction Function
      ↓
API / Application
      ↓
User
```

---

# 2. Training vs Deployment

Training and deployment are different stages.

## Training

The model learns from data.

```text
data
 ↓
features
 ↓
algorithm
 ↓
training
 ↓
model
```

Example:

```python
model.fit(X_train, y_train)
```

---

## Deployment

The trained model is used to make predictions.

```text
request
   ↓
input data
   ↓
preprocessing
   ↓
model
   ↓
prediction
   ↓
response
```

Example:

```python
prediction = model.predict(X)
```

---

# 3. Why Deploy a Model?

A model inside a notebook is not very useful for most applications.

For example:

```python
model.predict([[500, 3, 2]])
```

works inside Python.

But a website or mobile application cannot directly execute my notebook.

Instead:

```text
Frontend
   ↓
HTTP Request
   ↓
Backend API
   ↓
ML Model
   ↓
Prediction
   ↓
HTTP Response
   ↓
Frontend
```

This is why model deployment is important.

---

# 4. Model Deployment Architecture

A basic architecture looks like this:

```text
User
  ↓
Frontend / Application
  ↓
FastAPI
  ↓
Preprocessing
  ↓
ML Model
  ↓
Prediction
  ↓
JSON Response
```

Example:

```text
POST /predict
```

Request:

```json
{
    "age": 35,
    "income": 50000
}
```

Response:

```json
{
    "prediction": 1
}
```

---

# 5. Model Artifacts

After training a model, I need to save it.

A trained model is an artifact.

Examples:

```text
model.pkl
model.joblib
model.onnx
```

The most common beginner options are:

* pickle
* joblib

---

# 6. Saving a Model

Example:

```python
import joblib

joblib.dump(model, "model.joblib")
```

This stores the trained model.

---

# 7. Loading a Model

Later I can load it:

```python
import joblib

model = joblib.load("model.joblib")
```

Now I can use it for prediction.

```python
prediction = model.predict(X)
```

---

# 8. Why Save the Model?

Without saving:

```text
Application starts
      ↓
Train model again
      ↓
Make prediction
```

This is inefficient.

With a saved model:

```text
Application starts
      ↓
Load trained model
      ↓
Make prediction
```

The model is trained once and reused.

---

# 9. Important: Save Preprocessing Too

One important deployment concept is that preprocessing must match training.

Suppose training used:

```text
StandardScaler
      ↓
LogisticRegression
```

I should not deploy only the Logistic Regression model.

I need:

```text
Input
 ↓
StandardScaler
 ↓
LogisticRegression
 ↓
Prediction
```

Otherwise the model may receive incorrectly processed data.

---

# 10. Use a Pipeline

Scikit-learn Pipeline is useful for this.

Example:

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])
```

Train:

```python
pipeline.fit(X_train, y_train)
```

Save:

```python
import joblib

joblib.dump(pipeline, "model.joblib")
```

Load:

```python
pipeline = joblib.load("model.joblib")
```

Predict:

```python
prediction = pipeline.predict(X)
```

This makes deployment safer.

---

# 11. Model Inference

Inference means using a trained model to generate predictions.

Training:

```python
model.fit(X_train, y_train)
```

Inference:

```python
model.predict(X_test)
```

Simple mental model:

```text
Training = model learns

Inference = model predicts
```

---

# 12. Batch Inference

Batch inference means making predictions for many records together.

Example:

```text
100,000 customers
        ↓
ML Model
        ↓
100,000 predictions
```

Useful for:

* daily reports
* customer scoring
* recommendation updates
* fraud analysis
* data processing

Example:

```python
predictions = model.predict(X)
```

---

# 13. Real-Time Inference

Real-time inference means the application sends a request and receives a prediction immediately.

Example:

```text
User
 ↓
API
 ↓
Model
 ↓
Prediction
 ↓
Response
```

Example:

```text
POST /predict
```

Request:

```json
{
    "age": 30,
    "income": 70000
}
```

Response:

```json
{
    "prediction": 0
}
```

---

# 14. Batch vs Real-Time

| Type      | Meaning                       | Example                |
| --------- | ----------------------------- | ---------------------- |
| Batch     | Process many records together | Daily customer scoring |
| Real-Time | Predict when request arrives  | Fraud prediction API   |

---

# 15. FastAPI

FastAPI can expose the ML model through an HTTP API.

Basic architecture:

```text
Client
  ↓
HTTP
  ↓
FastAPI
  ↓
ML Model
  ↓
Prediction
```

---

# 16. Basic FastAPI Example

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "ML API is running"}
```

Run:

```bash
uvicorn main:app --reload
```

---

# 17. Prediction Endpoint

Example:

```python
from fastapi import FastAPI
import joblib

app = FastAPI()

model = joblib.load("model.joblib")

@app.post("/predict")
def predict(data: list):
    prediction = model.predict([data])

    return {
        "prediction": int(prediction[0])
    }
```

This is a simple ML prediction API.

---

# 18. Request Validation

Real APIs should validate input.

FastAPI works well with Pydantic.

Example:

```python
from pydantic import BaseModel

class PredictionRequest(BaseModel):
    age: float
    income: float
```

Then:

```python
@app.post("/predict")
def predict(data: PredictionRequest):

    prediction = model.predict([
        [data.age, data.income]
    ])

    return {
        "prediction": int(prediction[0])
    }
```

---

# 19. Why Validation Matters

Without validation:

```text
Bad input
   ↓
Model
   ↓
Error
```

With validation:

```text
Request
   ↓
Validation
   ↓
Valid input
   ↓
Model
   ↓
Prediction
```

This makes the API safer and easier to use.

---

# 20. Docker

Docker packages the application and its dependencies.

Without Docker:

```text
Python version
Libraries
Model
FastAPI
System dependencies
```

may differ between machines.

With Docker:

```text
Docker Container
 ├── Python
 ├── Dependencies
 ├── FastAPI
 ├── Model
 └── Application
```

---

# 21. Basic Dockerfile

Example:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build:

```bash
docker build -t ml-api .
```

Run:

```bash
docker run -p 8000:8000 ml-api
```

---

# 22. Local Deployment

Before deploying to the cloud, I should be able to run the model locally.

Example:

```text
Laptop
  ↓
Docker
  ↓
FastAPI
  ↓
Model
```

Then test:

```text
http://localhost:8000
```

---

# 23. API Testing

I can test the API using:

* browser
* Swagger UI
* Postman
* curl
* frontend application

FastAPI automatically provides Swagger documentation.

Usually:

```text
/docs
```

Example:

```text
http://localhost:8000/docs
```

---

# 24. Cloud Deployment Basics

I should understand the general idea of deploying an API to the cloud.

Basic architecture:

```text
Local Application
      ↓
Docker Image
      ↓
Cloud Platform
      ↓
Running API
      ↓
Internet
      ↓
Frontend / Client
```

Possible platforms include:

* AWS
* Azure
* Google Cloud
* Render
* Railway
* similar container platforms

At this stage I only need the basic deployment concept.

I do not need deep cloud infrastructure here.

---

# 25. Environment Variables

Secrets should not be hardcoded.

Bad:

```python
API_KEY = "my-secret-key"
```

Better:

```text
.env
```

Example:

```text
API_KEY=secret
DATABASE_URL=...
```

Then read them through environment variables.

---

# 26. Production Basics

Even a simple ML API should consider:

* input validation
* error handling
* logging
* environment variables
* model version
* dependency versions
* resource usage
* latency
* monitoring

These are basic production concepts.

---

# 27. Model Versioning

Suppose I have:

```text
model_v1
model_v2
model_v3
```

I should know which model is currently deployed.

Example:

```text
models/
├── model_v1.joblib
├── model_v2.joblib
└── model_v3.joblib
```

Later MLflow and MLOps can handle this more professionally.

---

# 28. Model Deployment and MLOps

Model deployment is only one part of MLOps.

```text
Data
 ↓
Training
 ↓
Experiment Tracking
 ↓
Model Registry
 ↓
Deployment
 ↓
Monitoring
 ↓
Retraining
```

I already have basic MLOps knowledge.

Therefore, this module focuses mainly on:

```text
Model
 ↓
API
 ↓
Docker
 ↓
Deployment
```

---

# 29. What I Do NOT Need to Go Deep Into Here

I do not need to become an advanced MLOps engineer inside this module.

I don't need deep coverage of:

* Kubernetes
* Terraform
* advanced AWS architecture
* distributed training
* advanced CI/CD
* advanced monitoring
* complex infrastructure
* large-scale ML serving

Those topics can be learned later if required.

---

# 30. Why This Matters for AI Engineering

This is especially important for my long-term AI path.

I want to become a:

**Full-Stack AI Engineer**

That means I need to understand how AI models connect to applications.

For example:

```text
Frontend
   ↓
Next.js
   ↓
FastAPI
   ↓
AI Model
   ↓
Database
```

This same architecture will appear later in GenAI applications.

---

# 31. ML Model vs LLM Application

Traditional ML:

```text
Frontend
   ↓
FastAPI
   ↓
ML Model
   ↓
Prediction
```

GenAI:

```text
Frontend
   ↓
FastAPI
   ↓
LLM
   ↓
Response
```

RAG:

```text
Frontend
   ↓
API
   ↓
RAG Pipeline
   ↓
Retriever
   ↓
Vector Database
   ↓
LLM
   ↓
Response
```

Agentic AI:

```text
User
 ↓
Agent
 ↓
Reasoning / Planning
 ↓
Tools
 ↓
APIs / Database / Search
 ↓
LLM
 ↓
Response
```

Therefore, learning FastAPI, Docker, APIs, inference, and deployment here will directly help later.

---

# 32. My Practical Project

I should build one small deployment project.

Example:

## House Price Prediction API

```text
House Price Model
        ↓
Save with Joblib
        ↓
FastAPI
        ↓
POST /predict
        ↓
Docker
        ↓
Local Deployment
```

Request:

```json
{
    "area": 1500,
    "bedrooms": 3,
    "bathrooms": 2
}
```

Response:

```json
{
    "predicted_price": 250000
}
```

---

# 33. Suggested Project Structure

```text
16-Model-Deployment/
│
├── README.md
│
├── 01-Save-and-Load-Models/
│   ├── notebook.ipynb
│   └── README.md
│
├── 02-Model-Inference/
│   ├── notebook.ipynb
│   └── README.md
│
├── 03-FastAPI-Model-API/
│   ├── main.py
│   ├── model.joblib
│   ├── requirements.txt
│   └── README.md
│
├── 04-Request-Validation/
│   ├── main.py
│   └── README.md
│
├── 05-Docker-Model-API/
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
│
├── 06-Local-Deployment/
│   └── README.md
│
├── 07-Cloud-Deployment-Basics/
│   └── README.md
│
└── 08-Batch-vs-Realtime-Inference/
    └── README.md
```

---

# 34. What I Should Be Able to Do After This Module

I should be able to:

* save an ML model
* load an ML model
* understand inference
* create a prediction function
* create a FastAPI endpoint
* validate requests
* return JSON predictions
* test an API
* Dockerize an ML API
* run it locally
* understand basic cloud deployment
* understand batch inference
* understand real-time inference
* understand basic production concerns

---

# 35. Interview Questions

### What is model deployment?

Making a trained ML model available for real-world prediction.

### What is inference?

Using a trained model to generate predictions.

### Why save a model?

So the trained model can be reused without retraining.

### Why use FastAPI?

To expose the model through an HTTP API.

### Why use Docker?

To package the application and its dependencies consistently.

### What is batch inference?

Generating predictions for many records together.

### What is real-time inference?

Generating a prediction when an application request arrives.

### Why save preprocessing with the model?

Because production input must be transformed the same way as training data.

### What is the difference between training and inference?

Training learns model parameters from data.

Inference uses the learned parameters to make predictions.

---

# 36. Final Mental Model

Remember this:

```text
DATA
 ↓
TRAIN
 ↓
EVALUATE
 ↓
SAVE MODEL
 ↓
LOAD MODEL
 ↓
INFERENCE
 ↓
FASTAPI
 ↓
DOCKER
 ↓
DEPLOY
```

Then my AI Engineering journey continues:

```text
ML
 ↓
Deep Learning
 ↓
GenAI
 ↓
LLMs
 ↓
Embeddings
 ↓
RAG
 ↓
Tools
 ↓
Agents
 ↓
Agentic AI
 ↓
Production AI Systems
```

---

# 37. Final Checklist

* [ ] Understand model deployment
* [ ] Understand inference
* [ ] Save model with Joblib
* [ ] Load model
* [ ] Save preprocessing with Pipeline
* [ ] Build FastAPI API
* [ ] Validate requests with Pydantic
* [ ] Test prediction endpoint
* [ ] Understand Swagger
* [ ] Dockerize API
* [ ] Run Docker locally
* [ ] Understand batch inference
* [ ] Understand real-time inference
* [ ] Understand basic cloud deployment
* [ ] Understand environment variables
* [ ] Understand basic model versioning
* [ ] Build one small deployment project

---

# 🎯 Main Goal

I am not trying to become an MLOps specialist here.

I am building the deployment foundation required for my bigger goal:

**Full-Stack AI Engineer → GenAI Engineer → Agentic AI Engineer**

The important skills are:

**Python + APIs + FastAPI + Docker + model inference + deployment basics**

These skills will be reused later when building:

**LLM APIs → RAG systems → AI assistants → AI agents → Agentic AI applications.**