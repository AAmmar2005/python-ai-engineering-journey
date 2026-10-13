# 📊 15 — MLflow and Experiment Tracking

> **Start Date:** March 2, 2026
> **Module:** 15 — MLflow and Experiment Tracking
> **Level:** Beginner → Intermediate
> **Focus:** Tracking ML experiments, parameters, metrics, models, and artifacts

---

# 📌 Overview

Building a Machine Learning model is not just about training one model and getting one accuracy score.

During a real ML project, you may train many versions:

```text
Model 1 → Logistic Regression → Accuracy 82%
Model 2 → Logistic Regression → Accuracy 85%
Model 3 → Random Forest → Accuracy 87%
Model 4 → XGBoost → Accuracy 89%
Model 5 → Tuned XGBoost → Accuracy 91%
```

Now imagine running 50 or 100 experiments.

You need to remember:

* Which model was used?
* Which parameters were used?
* Which dataset version was used?
* What preprocessing was applied?
* What metrics were achieved?
* Which model file belongs to which experiment?
* Which experiment was better according to the selected evaluation metric?

This is where **ML experiment tracking** becomes important.

MLflow provides tools for tracking and organizing these experiments.

---

# 🎯 What You Will Learn

In this module:

1. What experiment tracking means
2. Why experiment tracking matters
3. MLflow overview
4. MLflow architecture
5. Experiments
6. Runs
7. Parameters
8. Metrics
9. Tags
10. Artifacts
11. Models
12. MLflow Tracking
13. Installing MLflow
14. Starting MLflow UI
15. Logging parameters
16. Logging metrics
17. Logging artifacts
18. Logging models
19. Viewing experiments
20. Comparing runs
21. Autologging
22. MLflow with scikit-learn
23. MLflow with pipelines
24. MLflow with hyperparameter tuning
25. MLflow Model Registry overview
26. Model versions
27. Model stages/lifecycle concepts
28. Loading MLflow models
29. Reproducibility
30. Practical project structure
31. Common mistakes
32. End-to-end MLflow example

---

# 1. What Is Experiment Tracking?

Experiment tracking means recording information about every ML experiment.

For example:

```text
Experiment
    ↓
Model
    ↓
Parameters
    ↓
Metrics
    ↓
Artifacts
    ↓
Results
```

Instead of manually writing:

```text
Model: Random Forest
n_estimators: 200
max_depth: 10
accuracy: 0.91
```

we can automatically record this information.

---

# 2. Why Experiment Tracking Matters

Suppose you run:

```text
Experiment 1
Experiment 2
Experiment 3
...
Experiment 50
```

Without tracking, you may end up with:

```text
model_final.pkl
model_final2.pkl
model_final_new.pkl
model_final_best.pkl
model_final_best_v2.pkl
```

You may not remember what changed.

With experiment tracking:

```text
Run 1
Run 2
Run 3
Run 4
...
```

Each run can contain:

```text
Parameters
Metrics
Artifacts
Model
Tags
```

This makes experiments easier to understand and reproduce.

---

# 3. What Is MLflow?

**MLflow** is an open-source platform for managing the Machine Learning lifecycle.

It provides several capabilities, including:

```text
Tracking
Projects / Packaging
Models
Model Registry
```

For this module, the most important part is:

```text
MLflow Tracking
```

because we are learning how to track ML experiments.

---

# 4. MLflow Mental Model

The easiest way to understand MLflow is:

```text
Experiment
    ↓
Runs
    ↓
Parameters
Metrics
Artifacts
Models
```

For example:

```text
Experiment: Customer Churn
       │
       ├── Run 1
       │    ├── Parameters
       │    ├── Metrics
       │    └── Model
       │
       ├── Run 2
       │    ├── Parameters
       │    ├── Metrics
       │    └── Model
       │
       └── Run 3
            ├── Parameters
            ├── Metrics
            └── Model
```

---

# 5. Experiment

An **experiment** is a logical container for related ML runs.

Example:

```text
Experiment:
Customer Churn Prediction
```

Inside it:

```text
Run 1 → Logistic Regression
Run 2 → Random Forest
Run 3 → XGBoost
Run 4 → Tuned XGBoost
```

All these experiments are related to the same ML problem.

---

# 6. Run

A **run** represents one execution of an ML experiment.

For example:

```text
Run 001
Model: Logistic Regression
C: 1.0
Accuracy: 0.84
F1: 0.82
```

Another:

```text
Run 002
Model: Logistic Regression
C: 10
Accuracy: 0.87
F1: 0.85
```

Each run records what happened during that particular experiment.

---

# 7. Parameters

Parameters are configuration values used by the model or training process.

Examples:

```text
learning_rate
max_depth
n_estimators
C
batch_size
epochs
```

For Random Forest:

```text
n_estimators = 200
max_depth = 10
```

For Logistic Regression:

```text
C = 1.0
max_iter = 1000
```

These values can be logged to MLflow.

---

# 8. Metrics

Metrics measure model performance.

Examples:

```text
Accuracy
Precision
Recall
F1 Score
ROC-AUC
MAE
MSE
RMSE
R²
```

For classification:

```text
accuracy = 0.91
f1 = 0.89
```

For regression:

```text
RMSE = 4210
R² = 0.87
```

Metrics can be compared across runs.

---

# 9. Parameters vs Metrics

This distinction is important.

| Type      | Meaning                                | Example        |
| --------- | -------------------------------------- | -------------- |
| Parameter | Configuration used for training        | `max_depth=10` |
| Metric    | Result produced by training/evaluation | `F1=0.91`      |

Simple mental model:

```text
Parameters
    ↓
What did I use?

Metrics
    ↓
What did I get?
```

---

# 10. Tags

Tags are additional metadata about a run.

Examples:

```text
model_type = "random_forest"
dataset = "customer_churn_v2"
environment = "development"
developer = "waleed"
```

Tags help organize and identify experiments.

---

# 11. Artifacts

Artifacts are files generated during an ML run.

Examples:

```text
model.pkl
confusion_matrix.png
feature_importance.csv
classification_report.txt
dataset_sample.csv
plots
```

For example:

```text
Run
 ├── Parameters
 ├── Metrics
 └── Artifacts
      ├── model
      ├── plot
      └── report
```

---

# 12. Model

A trained model can also be logged to MLflow.

For example:

```text
Random Forest
```

can be saved as an MLflow model.

This makes it easier to:

* store models
* load models
* compare models
* deploy models
* manage model versions

---

# 13. Complete MLflow Mental Model

Remember:

```text
Experiment
     ↓
   Run
     ↓
 ┌───┼────────┐
 ↓   ↓        ↓
Params Metrics Artifacts
              ↓
            Model
```

This is the core concept of MLflow Tracking.

---

# 14. Installing MLflow

Install using pip:

```bash
pip install mlflow
```

Verify:

```bash
mlflow --version
```

You can also install it inside your project environment:

```bash
pip install mlflow scikit-learn pandas
```

---

# 15. Starting MLflow UI

MLflow provides a web interface.

Run:

```bash
mlflow ui
```

By default, MLflow commonly starts a local server that can be accessed through:

```text
http://127.0.0.1:5000
```

The UI allows you to inspect:

* experiments
* runs
* parameters
* metrics
* artifacts
* models

---

# 16. Basic MLflow Tracking

Import MLflow:

```python
import mlflow
```

Start a run:

```python
with mlflow.start_run():

    mlflow.log_param(
        "model",
        "LogisticRegression"
    )

    mlflow.log_metric(
        "accuracy",
        0.87
    )
```

The run automatically records these values.

---

# 17. Logging Parameters

Use:

```python
mlflow.log_param(
    "parameter_name",
    value
)
```

Example:

```python
mlflow.log_param(
    "learning_rate",
    0.01
)

mlflow.log_param(
    "max_depth",
    10
)
```

Multiple parameters can also be logged:

```python
mlflow.log_params({
    "learning_rate": 0.01,
    "max_depth": 10,
    "n_estimators": 200
})
```

---

# 18. Logging Metrics

Use:

```python
mlflow.log_metric(
    "metric_name",
    value
)
```

Example:

```python
mlflow.log_metric(
    "accuracy",
    0.91
)

mlflow.log_metric(
    "f1_score",
    0.89
)
```

Multiple metrics:

```python
mlflow.log_metrics({
    "accuracy": 0.91,
    "precision": 0.90,
    "recall": 0.88,
    "f1": 0.89
})
```

---

# 19. Logging Artifacts

Suppose we create:

```text
confusion_matrix.png
```

We can log it:

```python
mlflow.log_artifact(
    "confusion_matrix.png"
)
```

For a directory:

```python
mlflow.log_artifacts(
    "artifacts/"
)
```

This allows experiment outputs to stay associated with the run.

---

# 20. Logging Tags

Example:

```python
mlflow.set_tag(
    "model_type",
    "logistic_regression"
)
```

Multiple tags:

```python
mlflow.set_tags({
    "model_type": "logistic_regression",
    "dataset": "customer_churn",
    "environment": "development"
})
```

---

# 21. Setting an Experiment

You can create or select an experiment:

```python
mlflow.set_experiment(
    "Customer Churn Prediction"
)
```

Then:

```python
with mlflow.start_run():
    ...
```

The run belongs to that experiment.

---

# 22. Complete Basic Example

```python
import mlflow

mlflow.set_experiment(
    "Customer Churn Prediction"
)

with mlflow.start_run():

    mlflow.log_params({
        "model": "LogisticRegression",
        "C": 1.0,
        "max_iter": 1000
    })

    mlflow.log_metrics({
        "accuracy": 0.87,
        "f1": 0.85
    })

    mlflow.set_tag(
        "dataset",
        "customer_churn_v1"
    )
```

Now MLflow has a run containing:

```text
Experiment
   ↓
Run
 ├── Parameters
 ├── Metrics
 └── Tags
```

---

# 23. MLflow with Scikit-Learn

Now connect MLflow to an actual ML workflow.

Example:

```python
import mlflow
import mlflow.sklearn

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
```

Load data:

```python
data = load_iris()

X = data.data
y = data.target
```

Split:

```python
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
```

Create model:

```python
model = LogisticRegression(
    max_iter=1000
)
```

---

# 24. Training with MLflow

```python
mlflow.set_experiment(
    "Iris Classification"
)

with mlflow.start_run():

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    mlflow.log_param(
        "max_iter",
        1000
    )

    mlflow.log_metric(
        "accuracy",
        accuracy
    )
```

Now each training execution becomes a tracked run.

---

# 25. Logging the Model

MLflow can log the trained scikit-learn model.

```python
mlflow.sklearn.log_model(
    model,
    "model"
)
```

A run now contains:

```text
Run
 ├── Parameters
 ├── Metrics
 └── Model
```

---

# 26. Complete Scikit-Learn Example

```python
import mlflow
import mlflow.sklearn

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    f1_score
)

data = load_iris()

X = data.data
y = data.target

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

mlflow.set_experiment(
    "Iris Classification"
)

with mlflow.start_run():

    model = LogisticRegression(
        max_iter=1000
    )

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    f1 = f1_score(
        y_test,
        predictions,
        average="weighted"
    )

    mlflow.log_params({
        "model": "LogisticRegression",
        "max_iter": 1000
    })

    mlflow.log_metrics({
        "accuracy": accuracy,
        "f1": f1
    })

    mlflow.sklearn.log_model(
        model,
        "model"
    )
```

---

# 27. Experiment Comparison

Suppose we train:

```text
Run 1 → Logistic Regression
Run 2 → Random Forest
Run 3 → SVM
Run 4 → XGBoost
```

Each run can contain:

| Run | Model               | Accuracy |   F1 |
| --- | ------------------- | -------: | ---: |
| 1   | Logistic Regression |     0.84 | 0.82 |
| 2   | Random Forest       |     0.88 | 0.87 |
| 3   | SVM                 |     0.86 | 0.85 |
| 4   | XGBoost             |     0.90 | 0.89 |

The important point is that MLflow allows you to **inspect and compare the runs** rather than manually maintaining a spreadsheet.

The choice of which metric matters depends on the ML problem.

---

# 28. MLflow UI

After running:

```bash
mlflow ui
```

you can inspect your experiments through the MLflow interface.

You can see information such as:

```text
Experiment
Run
Parameters
Metrics
Tags
Artifacts
Model
```

This provides a visual way to analyze experiments.

---

# 29. Why Experiment Comparison Matters

Imagine:

```text
Run 1:
C = 0.1
F1 = 0.81

Run 2:
C = 1
F1 = 0.85

Run 3:
C = 10
F1 = 0.88
```

Without tracking, you might forget which configuration produced which result.

With tracking:

```text
Parameter
    ↓
Experiment
    ↓
Metric
```

the relationship remains recorded.

---

# 30. MLflow with Pipelines

MLflow works well with the ML pipelines learned in Module 14.

Pipeline:

```text
Preprocessing
      ↓
Model
```

MLflow:

```text
Experiment
      ↓
Run
      ↓
Pipeline
      ↓
Metrics + Parameters + Model
```

Example:

```python
with mlflow.start_run():

    pipeline.fit(
        X_train,
        y_train
    )

    predictions = pipeline.predict(
        X_test
    )

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    mlflow.log_metric(
        "accuracy",
        accuracy
    )

    mlflow.sklearn.log_model(
        pipeline,
        "pipeline"
    )
```

This is an important practical combination.

---

# 31. MLflow with Hyperparameter Tuning

Suppose we run different values:

```text
C = 0.01
C = 0.1
C = 1
C = 10
```

Each configuration can be tracked.

Conceptually:

```text
Experiment
    │
    ├── Run 1 → C=0.01
    ├── Run 2 → C=0.1
    ├── Run 3 → C=1
    └── Run 4 → C=10
```

Each run can record:

```text
C
Accuracy
F1
Model
```

This makes hyperparameter experiments easier to analyze.

---

# 32. Manual Experiment Loop

Example:

```python
for c in [0.01, 0.1, 1, 10]:

    with mlflow.start_run():

        model = LogisticRegression(
            C=c,
            max_iter=1000
        )

        model.fit(
            X_train,
            y_train
        )

        predictions = model.predict(
            X_test
        )

        accuracy = accuracy_score(
            y_test,
            predictions
        )

        mlflow.log_param(
            "C",
            c
        )

        mlflow.log_metric(
            "accuracy",
            accuracy
        )

        mlflow.sklearn.log_model(
            model,
            "model"
        )
```

Now every `C` value becomes a separate run.

---

# 33. Autologging

MLflow also provides automatic logging for supported ML libraries.

For scikit-learn:

```python
mlflow.sklearn.autolog()
```

Example:

```python
import mlflow
import mlflow.sklearn

mlflow.sklearn.autolog()

with mlflow.start_run():

    model.fit(
        X_train,
        y_train
    )
```

Depending on the library and configuration, MLflow can automatically record information such as:

* parameters
* metrics
* model
* training information

Autologging reduces manual tracking code.

---

# 34. Manual Logging vs Autologging

| Manual Logging                    | Autologging                                     |
| --------------------------------- | ----------------------------------------------- |
| You explicitly choose what to log | MLflow logs supported information automatically |
| More control                      | Less code                                       |
| Good for custom metrics           | Convenient for experiments                      |
| More code                         | Faster setup                                    |

Both approaches are useful.

For learning MLflow fundamentals, understand manual logging first.

---

# 35. Logging Custom Metrics

Sometimes standard metrics are not enough.

Example:

```python
business_score = 0.76
```

You can log it:

```python
mlflow.log_metric(
    "business_score",
    business_score
)
```

You can also log custom measurements such as:

```text
inference_time
training_time
memory_usage
false_positive_rate
false_negative_rate
```

The useful metrics depend on the problem.

---

# 36. Logging Plots

Suppose you create:

```text
confusion_matrix.png
```

Save it locally:

```python
plt.savefig(
    "confusion_matrix.png"
)
```

Then:

```python
mlflow.log_artifact(
    "confusion_matrix.png"
)
```

Now the visualization is attached to the run.

This is useful for later error analysis.

---

# 37. Logging Reports

Suppose you create:

```text
classification_report.txt
```

You can log it:

```python
mlflow.log_artifact(
    "classification_report.txt"
)
```

This allows the experiment to keep related outputs together.

---

# 38. MLflow Model

An MLflow Model is a standardized way of packaging a trained model.

Instead of thinking only:

```text
model.pkl
```

you can think:

```text
MLflow Model
```

which can include:

```text
Model
Dependencies
Model Flavor
Metadata
```

This becomes useful when moving models between training and deployment systems.

---

# 39. Model Registry

MLflow also provides a **Model Registry** concept.

The registry helps manage models after they have been trained.

A simplified lifecycle:

```text
Experiment
    ↓
Run
    ↓
Trained Model
    ↓
Registered Model
    ↓
Model Version
    ↓
Deployment
```

The registry is different from basic experiment tracking.

Tracking answers:

> What happened during training?

Registry answers:

> Which model versions are being managed for use?

---

# 40. Model Versions

Suppose we have:

```text
CustomerChurnModel
```

It can have:

```text
Version 1
Version 2
Version 3
```

Each version can correspond to a different trained model.

For example:

```text
Version 1 → Initial model
Version 2 → Improved preprocessing
Version 3 → New dataset
```

This gives us a history of model development.

---

# 41. Model Lifecycle

A practical lifecycle can be:

```text
Experiment
     ↓
Training
     ↓
Evaluation
     ↓
Register Model
     ↓
Validate
     ↓
Deploy
     ↓
Monitor
```

MLflow can support several parts of this lifecycle.

---

# 42. Tracking vs Registry

These concepts should not be confused.

| MLflow Tracking      | Model Registry                 |
| -------------------- | ------------------------------ |
| Tracks experiments   | Manages models                 |
| Tracks runs          | Tracks model versions          |
| Parameters           | Registered model               |
| Metrics              | Model lifecycle                |
| Artifacts            | Version history                |
| Training information | Deployment-oriented management |

Simple mental model:

```text
Tracking
   ↓
What happened?

Registry
   ↓
Which model are we managing?
```

---

# 43. Reproducibility

A major purpose of experiment tracking is reproducibility.

Suppose you find an experiment that performed well.

You want to know:

```text
Dataset
+
Preprocessing
+
Parameters
+
Model
+
Code
+
Environment
```

This allows you to reproduce the result more reliably.

MLflow can record much of this information, although complete reproducibility still depends on how your project is designed.

---

# 44. Reproducible Experiment

A well-tracked experiment should record important information such as:

```text
Model
Parameters
Metrics
Dataset Version
Code Version
Environment
Random Seed
Artifacts
```

Example:

```text
Model:
RandomForest

Parameters:
n_estimators=200
max_depth=10

Metrics:
F1=0.89

Dataset:
customer_churn_v2

Git Commit:
abc123
```

This makes the experiment much easier to understand later.

---

# 45. MLflow and Git

MLflow tracks ML experiments.

Git tracks code versions.

They solve different problems.

```text
Git
 ↓
Code Version
```

```text
MLflow
 ↓
Experiment Version
```

Together:

```text
Git
+
MLflow
```

can provide a stronger reproducibility workflow.

---

# 46. MLflow and Data Versioning

MLflow can record which dataset version was used, but MLflow is not a complete replacement for dedicated data versioning tools.

For example:

```text
Dataset
    ↓
Version
    ↓
Experiment
```

You can log the dataset version:

```python
mlflow.set_tag(
    "dataset_version",
    "v2"
)
```

For more advanced data versioning, tools such as DVC can later be introduced in an MLOps-focused curriculum.

---

# 47. Project Structure

A simple MLflow project can look like:

```text
ml-project/
│
├── data/
│   └── dataset.csv
│
├── notebooks/
│   └── experiments.ipynb
│
├── src/
│   ├── train.py
│   ├── evaluate.py
│   └── predict.py
│
├── models/
│
├── artifacts/
│
├── mlruns/
│
├── requirements.txt
│
└── README.md
```

The `mlruns/` directory may be created when using MLflow's local tracking setup.

---

# 48. Local MLflow Tracking

For learning and local experimentation, you can start with local tracking.

Run:

```bash
mlflow ui
```

Your local experiments can then be viewed through the MLflow UI.

This is enough to learn the fundamental concepts before moving to remote tracking infrastructure.

---

# 49. End-to-End Example

A practical ML workflow can look like:

```python
import mlflow
import mlflow.sklearn
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
```

Set experiment:

```python
mlflow.set_experiment(
    "Customer Classification"
)
```

Start run:

```python
with mlflow.start_run():

    model = LogisticRegression(
        C=1.0,
        max_iter=1000
    )

    model.fit(
        X_train,
        y_train
    )
```

Predict:

```python
    predictions = model.predict(
        X_test
    )
```

Calculate metric:

```python
    accuracy = accuracy_score(
        y_test,
        predictions
    )
```

Log parameters:

```python
    mlflow.log_params({
        "model": "LogisticRegression",
        "C": 1.0,
        "max_iter": 1000
    })
```

Log metric:

```python
    mlflow.log_metric(
        "accuracy",
        accuracy
    )
```

Log model:

```python
    mlflow.sklearn.log_model(
        model,
        "model"
    )
```

Complete flow:

```text
Dataset
   ↓
Train/Test Split
   ↓
Model
   ↓
Prediction
   ↓
Metric
   ↓
MLflow Run
   ├── Parameters
   ├── Metrics
   └── Model
```

---

# 50. MLflow with the Previous Module

Module 14 taught:

```text
ML Pipeline
    ↓
Preprocessing
    ↓
Model
```

Module 15 adds:

```text
ML Pipeline
    ↓
Experiment Tracking
    ↓
Parameters
    ↓
Metrics
    ↓
Artifacts
    ↓
Model
```

Together:

```text
Raw Data
   ↓
Pipeline
   ↓
Model
   ↓
Evaluation
   ↓
MLflow Tracking
```

This is an important step toward production ML workflows.

---

# 51. Practical Workflow

A good workflow for your projects:

```text
1. Load Dataset
        ↓
2. Split Dataset
        ↓
3. Build Pipeline
        ↓
4. Train Model
        ↓
5. Evaluate Model
        ↓
6. Start MLflow Run
        ↓
7. Log Parameters
        ↓
8. Log Metrics
        ↓
9. Log Artifacts
        ↓
10. Log Model
        ↓
11. Compare Runs
        ↓
12. Select a model based on the project's evaluation criteria
        ↓
13. Save/Register Model
```

The model selection step should be based on the actual requirements and evaluation criteria of the project rather than simply assuming that one metric is always sufficient.

---

# 52. Common Mistakes

## Mistake 1 — Tracking only accuracy

Accuracy is not always enough.

For classification, also consider:

```text
Precision
Recall
F1
ROC-AUC
PR-AUC
```

depending on the problem.

---

## Mistake 2 — Not logging parameters

If you only log:

```text
accuracy = 0.91
```

you don't know how the model achieved it.

Also log important parameters.

---

## Mistake 3 — Not logging the model

A run with metrics but no model artifact can make later reproduction harder.

---

## Mistake 4 — Poor experiment naming

Avoid:

```text
test
test2
final
final2
new
newfinal
```

Use descriptive names:

```text
Customer Churn Classification
Spam Detection
House Price Regression
```

---

## Mistake 5 — Not recording dataset version

Two experiments may use different datasets.

Record the dataset version:

```python
mlflow.set_tag(
    "dataset_version",
    "v2"
)
```

---

## Mistake 6 — Tracking everything without organization

More tracking is not automatically better.

Track information that helps you understand, compare, reproduce, and operate experiments.

---

# 53. Best Practices

### 1. Use meaningful experiment names

```text
Customer Churn
Spam Detection
House Price Regression
```

### 2. Log important parameters

```text
learning_rate
max_depth
n_estimators
C
```

### 3. Log relevant metrics

```text
Accuracy
F1
RMSE
R²
```

### 4. Log important artifacts

```text
Models
Plots
Reports
```

### 5. Record dataset information

```text
Dataset name
Dataset version
```

### 6. Use tags for organization

```text
model_type
environment
dataset
project
```

### 7. Keep code under Git

MLflow and Git work well together.

### 8. Start simple

Learn local MLflow tracking before introducing distributed tracking infrastructure.

---

# 54. MLflow vs Manual Tracking

Without MLflow:

```text
Excel
Notes
File names
Manual logs
```

With MLflow:

```text
Experiment
   ↓
Runs
   ↓
Parameters
   ↓
Metrics
   ↓
Artifacts
   ↓
Models
```

MLflow reduces the amount of manual experiment management.

---

# 55. What MLflow Does Not Automatically Solve

MLflow is useful, but it is not the entire MLOps stack.

It does not automatically solve every problem involving:

```text
Data Versioning
CI/CD
Cloud Infrastructure
Kubernetes
Monitoring
Feature Stores
Data Pipelines
Security
Scaling
```

Those belong to broader MLOps and production engineering.

For this ML curriculum, the goal is to understand **experiment tracking and basic model lifecycle management**, not become an advanced ML platform engineer.

---

# 56. MLflow and Deployment

After training and tracking:

```text
Training
   ↓
MLflow
   ↓
Model
   ↓
Deployment
```

The next module focuses on deployment:

```text
16 — Model Deployment
```

There you will work with concepts such as:

```text
Saved Models
FastAPI
Docker
Prediction APIs
Cloud Deployment
```

---

# 57. MLflow Mental Model

Remember this simple structure:

```text
             MLFLOW
                │
                ↓
           EXPERIMENT
                │
                ↓
              RUN
                │
       ┌────────┼─────────┐
       ↓        ↓         ↓
   Parameters Metrics  Artifacts
                           │
                           ↓
                         Model
```

Or even simpler:

```text
Experiment
    ↓
Run
    ↓
What did I use?
    ↓
Parameters
    ↓
What did I get?
    ↓
Metrics
    ↓
What did I produce?
    ↓
Artifacts / Model
```

---

# 🎯 Interview Cheat Sheet

| Question                           | Answer                                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| What is MLflow?                    | An open-source platform for managing parts of the ML lifecycle, including experiment tracking. |
| What is experiment tracking?       | Recording information about ML training runs so experiments can be understood and compared.    |
| What is a run?                     | One execution of an ML experiment.                                                             |
| What is an experiment?             | A logical group of related runs.                                                               |
| What are parameters?               | Configuration values used during training.                                                     |
| What are metrics?                  | Measurements of model performance.                                                             |
| What are artifacts?                | Files produced during an experiment.                                                           |
| What are tags?                     | Metadata used to organize and identify runs.                                                   |
| Can MLflow log models?             | Yes.                                                                                           |
| Can MLflow work with scikit-learn? | Yes.                                                                                           |
| What is autologging?               | Automatic logging of supported training information.                                           |
| What is Model Registry?            | A system for managing registered model versions and their lifecycle.                           |
| Is MLflow the entire MLOps stack?  | No. It covers important parts of the lifecycle but not every MLOps concern.                    |
| Why use MLflow with Git?           | Git tracks code versions while MLflow tracks experiment information.                           |

---

# ✅ Module 15 Checklist

* [ ] Understand experiment tracking
* [ ] Understand MLflow
* [ ] Understand MLflow Tracking
* [ ] Understand experiments
* [ ] Understand runs
* [ ] Understand parameters
* [ ] Understand metrics
* [ ] Understand tags
* [ ] Understand artifacts
* [ ] Understand MLflow models
* [ ] Install MLflow
* [ ] Start MLflow UI
* [ ] Create an experiment
* [ ] Start a run
* [ ] Log parameters
* [ ] Log metrics
* [ ] Log tags
* [ ] Log artifacts
* [ ] Log models
* [ ] Use MLflow with scikit-learn
* [ ] Use MLflow with pipelines
* [ ] Track hyperparameter experiments
* [ ] Understand autologging
* [ ] Understand Model Registry
* [ ] Understand model versions
* [ ] Understand reproducibility
* [ ] Understand MLflow + Git
* [ ] Build an end-to-end tracked ML experiment

---