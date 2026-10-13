# 🔄 14 — ML Pipelines

> **Start Date:** March 1, 2026
> **Module:** 14 — ML Pipelines
> **Level:** Beginner → Intermediate
> **Focus:** Building clean, reusable, reproducible end-to-end Machine Learning workflows

---

## 📌 Overview

An **ML Pipeline** is a sequence of Machine Learning steps connected together into one reusable workflow.

Instead of manually performing preprocessing, feature transformation, training, and prediction separately, we can organize them into a single pipeline.

A typical ML workflow looks like:

```text
Raw Data
   ↓
Data Cleaning
   ↓
Feature Engineering
   ↓
Preprocessing
   ↓
Feature Selection
   ↓
Model Training
   ↓
Evaluation
   ↓
Prediction
```

With a pipeline:

```text
Raw Data
   ↓
Preprocessing
   ↓
Feature Transformation
   ↓
ML Model
   ↓
Prediction
```

The goal is to make Machine Learning workflows:

* Reusable
* Consistent
* Reproducible
* Easier to test
* Easier to maintain
* Safer from data leakage
* Easier to tune
* Easier to deploy

---

# 🎯 Why ML Pipelines Matter

A beginner ML project might look simple:

```python
scaler.fit_transform(X_train)

scaler.transform(X_test)

model.fit(X_train, y_train)

predictions = model.predict(X_test)
```

But real projects can contain many preprocessing steps:

```text
Missing Values
      ↓
Encoding
      ↓
Scaling
      ↓
Feature Selection
      ↓
Dimensionality Reduction
      ↓
Model
```

Managing all these steps manually can lead to:

* Repeated code
* Incorrect preprocessing
* Data leakage
* Different preprocessing during training and testing
* Difficult deployment
* Difficult cross-validation
* Difficult hyperparameter tuning

A pipeline puts these operations into one structured workflow.

---

# 🧠 Core Mental Model

Think of an ML pipeline like an assembly line.

```text
Raw Material
     ↓
Machine 1
     ↓
Machine 2
     ↓
Machine 3
     ↓
Final Product
```

Machine Learning:

```text
Raw Data
     ↓
Imputation
     ↓
Encoding
     ↓
Scaling
     ↓
Model
     ↓
Prediction
```

Each step receives the output of the previous step.

---

# 📚 What You Will Learn

In this module you will learn:

1. What ML pipelines are
2. Why pipelines are important
3. Manual ML workflows
4. Scikit-learn `Pipeline`
5. Transformers
6. Estimators
7. `fit()`
8. `transform()`
9. `fit_transform()`
10. Pipeline ordering
11. Numerical preprocessing
12. Categorical preprocessing
13. `ColumnTransformer`
14. Mixed data preprocessing
15. Classification pipelines
16. Regression pipelines
17. Cross-validation with pipelines
18. Hyperparameter tuning with pipelines
19. Preventing data leakage
20. Feature selection in pipelines
21. PCA in pipelines
22. Saving pipelines
23. Loading pipelines
24. Deployment usage
25. Common mistakes
26. End-to-end pipeline projects

---

# 1. What Is an ML Pipeline?

A Machine Learning pipeline is a collection of sequential steps that process data and eventually produce predictions.

For example:

```text
Data
 ↓
Missing Value Handling
 ↓
Scaling
 ↓
Model
 ↓
Prediction
```

In scikit-learn:

```python
from sklearn.pipeline import Pipeline
```

Example:

```python
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])
```

Now we can train:

```python
pipeline.fit(X_train, y_train)
```

and predict:

```python
predictions = pipeline.predict(X_test)
```

---

# 2. Manual Workflow vs Pipeline

## Manual Workflow

```python
scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)

X_test_scaled = scaler.transform(X_test)

model = LogisticRegression()

model.fit(X_train_scaled, y_train)

predictions = model.predict(X_test_scaled)
```

This works.

But now imagine:

```text
Imputation
Encoding
Scaling
Feature Selection
PCA
Model
```

The code becomes much harder to manage.

---

## Pipeline Workflow

```python
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)
```

Much cleaner.

---

# 3. Scikit-Learn Pipeline

Basic syntax:

```python
Pipeline([
    ("step_name", transformer),
    ("step_name", transformer),
    ("model", estimator)
])
```

Example:

```python
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])
```

There are two important parts:

```text
Step Name
    +
Object
```

For example:

```python
("scaler", StandardScaler())
```

Here:

```text
scaler
   ↓
step name

StandardScaler()
   ↓
transformer
```

---

# 4. Pipeline Steps

A pipeline usually contains:

```text
Preprocessing
      ↓
Feature Transformation
      ↓
Model
```

Example:

```python
pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])
```

The flow becomes:

```text
Missing Values
      ↓
Imputer
      ↓
Scaler
      ↓
Logistic Regression
```

---

# 5. Transformers

A transformer changes or transforms data.

Common transformers include:

```text
SimpleImputer
StandardScaler
MinMaxScaler
RobustScaler
OneHotEncoder
PolynomialFeatures
PCA
SelectKBest
```

Transformers commonly provide:

```python
fit()
```

and:

```python
transform()
```

Many also provide:

```python
fit_transform()
```

---

# 6. `fit()`

`fit()` learns information from data.

For example:

```python
scaler.fit(X_train)
```

A `StandardScaler` learns statistics such as:

```text
Mean
Standard Deviation
```

It learns from the training data.

---

# 7. `transform()`

`transform()` applies the learned transformation.

Example:

```python
scaler.transform(X_test)
```

The scaler uses what it learned from:

```text
X_train
```

and applies the same transformation to:

```text
X_test
```

---

# 8. `fit_transform()`

`fit_transform()` performs both:

```text
fit()
  ↓
learn
  ↓
transform()
```

Example:

```python
X_train_scaled = scaler.fit_transform(X_train)
```

For training data:

```python
fit_transform()
```

For test data:

```python
transform()
```

This distinction is extremely important.

---

# 9. Why We Do Not Fit on Test Data

Incorrect:

```python
scaler.fit_transform(X_test)
```

Why?

Because the scaler would learn information from the test data.

Correct:

```python
scaler.fit_transform(X_train)

scaler.transform(X_test)
```

The model should not learn anything from the test set.

---

# 10. Estimators

An estimator is an object that learns from data.

Examples:

```text
LinearRegression
LogisticRegression
DecisionTreeClassifier
RandomForestClassifier
SVC
KNeighborsClassifier
RandomForestRegressor
```

A model normally provides:

```python
fit()
```

and:

```python
predict()
```

Example:

```python
model.fit(X_train, y_train)

predictions = model.predict(X_test)
```

---

# 11. Transformer vs Estimator

| Component   | Purpose                        |
| ----------- | ------------------------------ |
| Transformer | Changes/transforms data        |
| Estimator   | Learns the prediction task     |
| Pipeline    | Connects the complete workflow |

Example:

```text
SimpleImputer
      ↓
Transformer

StandardScaler
      ↓
Transformer

LogisticRegression
      ↓
Estimator
```

---

# 12. Basic Pipeline Example

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)
```

The pipeline performs:

```text
X_train
   ↓
StandardScaler
   ↓
LogisticRegression
```

---

# 13. Pipeline for Regression

Pipelines are also used for regression.

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LinearRegression())
])

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)
```

The concept remains the same:

```text
Preprocessing
     ↓
Regression Model
```

---

# 14. Handling Missing Values

Real-world datasets commonly contain missing values.

Example:

```text
Age
----
25
30
NaN
40
NaN
```

We can use:

```python
SimpleImputer
```

Example:

```python
from sklearn.impute import SimpleImputer

imputer = SimpleImputer(strategy="median")
```

Pipeline:

```python
pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])
```

Flow:

```text
Missing Values
      ↓
Median Imputation
      ↓
Scaling
      ↓
Model
```

---

# 15. Numerical Features

Suppose we have:

```text
age
salary
experience
```

These are numerical features.

A common workflow is:

```text
Numerical Data
      ↓
Missing Value Imputation
      ↓
Scaling
```

Pipeline:

```python
numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])
```

---

# 16. Categorical Features

Suppose we have:

```text
city
department
gender
```

These are categorical features.

Machine Learning models generally require numerical representations.

We can use:

```python
OneHotEncoder
```

Example:

```python
from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(
    handle_unknown="ignore"
)
```

---

# 17. Why `handle_unknown="ignore"`?

Imagine training data contains:

```text
Islamabad
Rawalpindi
Lahore
```

But production data contains:

```text
Karachi
```

The model did not see Karachi during training.

Using:

```python
OneHotEncoder(handle_unknown="ignore")
```

allows the encoder to handle unseen categories without crashing.

This is especially useful in production systems.

---

# 18. Numerical + Categorical Features

Most real-world tabular datasets contain both.

Example:

```text
Age          → numerical
Salary       → numerical
Experience   → numerical

City         → categorical
Department   → categorical
```

Different columns need different preprocessing.

```text
                 Data
                  │
          ┌───────┴───────┐
          ↓               ↓
     Numerical        Categorical
          ↓               ↓
      Imputation       Imputation
          ↓               ↓
       Scaling         Encoding
          └───────┬───────┘
                  ↓
                Model
```

This is where `ColumnTransformer` is useful.

---

# 19. ColumnTransformer

Import:

```python
from sklearn.compose import ColumnTransformer
```

It allows different transformations to be applied to different columns.

Example:

```python
numeric_features = [
    "age",
    "salary",
    "experience"
]

categorical_features = [
    "city",
    "department"
]
```

Numerical pipeline:

```python
numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])
```

Categorical pipeline:

```python
categorical_pipeline = Pipeline([
    (
        "imputer",
        SimpleImputer(strategy="most_frequent")
    ),
    (
        "encoder",
        OneHotEncoder(handle_unknown="ignore")
    )
])
```

---

# 20. Combining Them

```python
preprocessor = ColumnTransformer([
    (
        "num",
        numeric_pipeline,
        numeric_features
    ),
    (
        "cat",
        categorical_pipeline,
        categorical_features
    )
])
```

Now the preprocessor knows:

```text
Numerical columns
    ↓
Numerical pipeline

Categorical columns
    ↓
Categorical pipeline
```

---

# 21. Complete Pipeline

Now combine the preprocessor with the model:

```python
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", LogisticRegression(max_iter=1000))
])
```

Train:

```python
pipeline.fit(X_train, y_train)
```

Predict:

```python
predictions = pipeline.predict(X_test)
```

The complete architecture:

```text
                  Raw Data
                     ↓
             ColumnTransformer
                     ↓
        ┌────────────┴────────────┐
        ↓                         ↓
   Numerical                 Categorical
        ↓                         ↓
   Imputation                Imputation
        ↓                         ↓
     Scaling                  Encoding
        └────────────┬────────────┘
                     ↓
                  Model
                     ↓
                Prediction
```

---

# 22. Why ColumnTransformer Matters

Without `ColumnTransformer`, we may manually preprocess every feature group.

This creates:

* more code
* more repetition
* more opportunities for mistakes
* harder deployment
* harder cross-validation

`ColumnTransformer` gives us a structured way to handle mixed data.

---

# 23. Pipeline + ColumnTransformer

These two tools solve different problems.

### Pipeline

Connects sequential steps:

```text
Imputer
   ↓
Scaler
   ↓
Model
```

### ColumnTransformer

Applies different workflows to different columns:

```text
Numerical → Imputer → Scaler

Categorical → Imputer → Encoder
```

They are commonly combined:

```python
Pipeline([
    ("preprocessor", ColumnTransformer(...)),
    ("model", LogisticRegression())
])
```

---

# 24. Data Leakage

Data leakage happens when information that should not be available during training influences the model.

A common example is preprocessing the entire dataset before splitting.

Incorrect:

```python
X_scaled = scaler.fit_transform(X)

X_train, X_test = train_test_split(
    X_scaled,
    y
)
```

The scaler has already learned from:

```text
Training Data
+
Test Data
```

This can make evaluation unreliable.

---

# 25. Correct Workflow

Correct:

```text
Raw Data
    ↓
Train/Test Split
    ↓
Training Data
    ↓
Fit Preprocessing
    ↓
Transform Training Data
    ↓
Transform Test Data
    ↓
Train Model
    ↓
Evaluate
```

With a pipeline:

```text
Train/Test Split
       ↓
Pipeline
       ↓
Preprocessing
       ↓
Model
```

The pipeline helps keep preprocessing inside the proper training workflow.

---

# 26. Pipelines and Cross-Validation

Cross-validation repeatedly creates training and validation folds.

Preprocessing must be fitted separately within each training fold.

A pipeline handles this correctly.

Example:

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(
    pipeline,
    X,
    y,
    cv=5,
    scoring="accuracy"
)

print(scores)
```

Conceptually:

```text
Fold 1
Train → Fit Preprocessing → Validate

Fold 2
Train → Fit Preprocessing → Validate

Fold 3
Train → Fit Preprocessing → Validate
```

This is much safer than preprocessing the complete dataset first.

---

# 27. Pipeline with GridSearchCV

Pipelines work directly with hyperparameter tuning.

Example:

```python
from sklearn.model_selection import GridSearchCV
```

Suppose:

```python
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])
```

We want to tune:

```text
C
```

Parameter grid:

```python
param_grid = {
    "model__C": [
        0.01,
        0.1,
        1,
        10
    ]
}
```

Then:

```python
grid_search = GridSearchCV(
    pipeline,
    param_grid,
    cv=5,
    scoring="f1"
)

grid_search.fit(X_train, y_train)
```

---

# 28. Why `model__C`?

The pipeline step is named:

```python
("model", LogisticRegression())
```

The model parameter is:

```text
C
```

Therefore:

```text
model__C
```

means:

```text
pipeline step
      ↓
    model
      ↓
parameter
      ↓
      C
```

Pipeline parameters use:

```text
step_name__parameter
```

---

# 29. Nested Pipeline Parameters

With more complex pipelines, parameters can be deeper.

For example:

```text
preprocessor
    ↓
num
    ↓
scaler
    ↓
with_mean
```

The parameter can be referenced as:

```python
"preprocessor__num__scaler__with_mean"
```

This allows GridSearchCV to tune components inside nested pipelines.

---

# 30. RandomizedSearchCV

Pipelines also work with:

```python
RandomizedSearchCV
```

Example:

```python
from sklearn.model_selection import RandomizedSearchCV

search = RandomizedSearchCV(
    pipeline,
    param_distributions=param_grid,
    n_iter=10,
    cv=5,
    random_state=42
)

search.fit(X_train, y_train)
```

---

# 31. Feature Selection in Pipelines

Feature selection can also be included.

Example:

```python
from sklearn.feature_selection import SelectKBest

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("feature_selection", SelectKBest(k=20)),
    ("model", LogisticRegression(max_iter=1000))
])
```

Flow:

```text
Raw Data
   ↓
Preprocessing
   ↓
Feature Selection
   ↓
Model
```

This is useful when the dataset contains many features.

---

# 32. PCA in a Pipeline

PCA can also be included.

```python
from sklearn.decomposition import PCA

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("pca", PCA(n_components=10)),
    ("model", LogisticRegression())
])
```

Flow:

```text
Data
 ↓
Scaling
 ↓
PCA
 ↓
Model
```

This keeps dimensionality reduction inside the same workflow.

---

# 33. Pipeline Ordering

The order of operations matters.

For example:

```text
Imputation
   ↓
Scaling
   ↓
Model
```

is different from:

```text
Scaling
   ↓
Imputation
   ↓
Model
```

You should understand what each transformer expects.

A good pipeline follows the logical data-processing order.

---

# 34. What Usually Goes Into a Pipeline?

Common components include:

```text
SimpleImputer
OneHotEncoder
StandardScaler
MinMaxScaler
RobustScaler
PolynomialFeatures
SelectKBest
PCA
ML Model
```

A possible pipeline:

```text
Imputation
    ↓
Encoding
    ↓
Scaling
    ↓
Feature Selection
    ↓
Model
```

---

# 35. What Happens Before the Pipeline?

Some basic dataset operations normally happen before the pipeline.

For example:

```text
Load Dataset
      ↓
Inspect Dataset
      ↓
Identify Target
      ↓
Train/Test Split
      ↓
Pipeline
```

You can inspect:

```python
df.head()
df.info()
df.describe()
df.isnull().sum()
```

before creating the training workflow.

---

# 36. Pipeline with Classification

Example:

```python
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)
```

Evaluation:

```python
from sklearn.metrics import classification_report

print(
    classification_report(
        y_test,
        predictions
    )
)
```

---

# 37. Pipeline with Regression

Example:

```python
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LinearRegression())
])

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)
```

Then evaluate using metrics such as:

```text
MAE
MSE
RMSE
R²
```

The pipeline structure remains the same.

---

# 38. Model Comparison

Pipelines make model comparison easier.

Suppose we want to compare:

```text
Logistic Regression
SVM
KNN
Random Forest
```

We can keep preprocessing consistent and change the final estimator.

Conceptually:

```text
             Same Preprocessing
                     ↓
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
      LR            SVM           KNN
```

This makes experiments easier to organize.

---

# 39. Saving a Pipeline

A major advantage is that we can save the entire pipeline.

Using joblib:

```python
import joblib

joblib.dump(
    pipeline,
    "model_pipeline.pkl"
)
```

The saved artifact contains:

```text
Preprocessing
     +
Model
```

---

# 40. Loading a Pipeline

Later:

```python
pipeline = joblib.load(
    "model_pipeline.pkl"
)
```

Then:

```python
prediction = pipeline.predict(new_data)
```

We don't need to manually repeat:

```text
Imputation
Encoding
Scaling
Feature Selection
```

The saved pipeline handles the complete workflow.

---

# 41. Why Save the Pipeline Instead of Only the Model?

Suppose you only save:

```text
LogisticRegression
```

But during training the data was:

```text
Imputed
↓
Scaled
↓
Encoded
```

The production input must go through the same transformations.

If you only save the model, you must recreate preprocessing separately.

If you save the complete pipeline:

```text
Saved Pipeline
      ↓
Preprocessing
      ↓
Model
```

everything stays together.

---

# 42. Pipeline for Production

Imagine a deployed API receives:

```json
{
    "age": 25,
    "salary": 80000,
    "city": "Islamabad",
    "experience": 2
}
```

The API passes this data to the saved pipeline.

```text
API Request
     ↓
Raw Input
     ↓
Saved Pipeline
     ↓
Imputation
     ↓
Encoding
     ↓
Scaling
     ↓
Model
     ↓
Prediction
     ↓
API Response
```

This makes the production workflow consistent with training.

---

# 43. Batch Prediction

Pipelines can also process batches.

```python
new_data = pd.read_csv(
    "new_customers.csv"
)

predictions = pipeline.predict(
    new_data
)
```

The pipeline applies the same preprocessing to every record.

---

# 44. Complete Practical Example

```python
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from sklearn.impute import SimpleImputer
from sklearn.preprocessing import (
    StandardScaler,
    OneHotEncoder
)

from sklearn.linear_model import LogisticRegression

from sklearn.metrics import classification_report
```

Load the dataset:

```python
df = pd.read_csv("customers.csv")
```

Separate features and target:

```python
X = df.drop(
    "purchased",
    axis=1
)

y = df["purchased"]
```

Split the data:

```python
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
```

---

# 45. Define Feature Groups

```python
numeric_features = [
    "age",
    "salary",
    "experience"
]

categorical_features = [
    "city",
    "department"
]
```

---

# 46. Numerical Pipeline

```python
numeric_pipeline = Pipeline([
    (
        "imputer",
        SimpleImputer(
            strategy="median"
        )
    ),
    (
        "scaler",
        StandardScaler()
    )
])
```

Flow:

```text
Missing Numerical Values
        ↓
Median
        ↓
StandardScaler
```

---

# 47. Categorical Pipeline

```python
categorical_pipeline = Pipeline([
    (
        "imputer",
        SimpleImputer(
            strategy="most_frequent"
        )
    ),
    (
        "encoder",
        OneHotEncoder(
            handle_unknown="ignore"
        )
    )
])
```

Flow:

```text
Missing Categories
       ↓
Most Frequent Value
       ↓
One-Hot Encoding
```

---

# 48. Create Preprocessor

```python
preprocessor = ColumnTransformer([
    (
        "num",
        numeric_pipeline,
        numeric_features
    ),
    (
        "cat",
        categorical_pipeline,
        categorical_features
    )
])
```

Now:

```text
Numerical Columns
       ↓
Numerical Pipeline

Categorical Columns
       ↓
Categorical Pipeline
```

---

# 49. Create Final Pipeline

```python
pipeline = Pipeline([
    (
        "preprocessor",
        preprocessor
    ),
    (
        "model",
        LogisticRegression(
            max_iter=1000
        )
    )
])
```

---

# 50. Train

```python
pipeline.fit(
    X_train,
    y_train
)
```

The pipeline automatically performs:

```text
X_train
   ↓
Preprocessor
   ↓
Numerical Processing
   +
Categorical Processing
   ↓
Logistic Regression
```

---

# 51. Predict

```python
predictions = pipeline.predict(
    X_test
)
```

No manual preprocessing is required.

---

# 52. Evaluate

```python
print(
    classification_report(
        y_test,
        predictions
    )
)
```

You can also calculate:

```python
accuracy = pipeline.score(
    X_test,
    y_test
)

print(
    "Accuracy:",
    accuracy
)
```

---

# 53. Save

```python
import joblib

joblib.dump(
    pipeline,
    "customer_prediction_pipeline.pkl"
)
```

---

# 54. Load

```python
loaded_pipeline = joblib.load(
    "customer_prediction_pipeline.pkl"
)
```

---

# 55. Predict New Data

```python
prediction = loaded_pipeline.predict(
    new_data
)
```

The complete preprocessing and model logic is already inside the saved pipeline.

---

# 56. Recommended Project Structure

A practical ML project can look like:

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
│   ├── preprocessing.py
│   ├── train.py
│   └── predict.py
│
├── models/
│   └── model_pipeline.pkl
│
├── requirements.txt
│
└── README.md
```

The important artifact is:

```text
models/
└── model_pipeline.pkl
```

---

# 57. Typical Training Workflow

A practical workflow:

```text
Load Dataset
      ↓
Understand Data
      ↓
Define X and y
      ↓
Train/Test Split
      ↓
Build Preprocessor
      ↓
Build Pipeline
      ↓
Train Model
      ↓
Cross-Validation
      ↓
Hyperparameter Tuning
      ↓
Evaluate
      ↓
Save Pipeline
```

---

# 58. Typical Prediction Workflow

After deployment:

```text
New Data
   ↓
Load Saved Pipeline
   ↓
Preprocessing
   ↓
Model
   ↓
Prediction
```

This ensures that new data follows the same transformation process used during training.

---

# 59. Common Mistakes

## Mistake 1 — Fitting on test data

Wrong:

```python
scaler.fit_transform(X_test)
```

Correct:

```python
scaler.fit_transform(X_train)

scaler.transform(X_test)
```

---

## Mistake 2 — Preprocessing before splitting

Wrong:

```python
X_processed = preprocessing.fit_transform(X)

X_train, X_test = train_test_split(
    X_processed
)
```

Better:

```text
Split
 ↓
Pipeline
```

---

## Mistake 3 — Unknown categories

Without:

```python
handle_unknown="ignore"
```

new categories can cause problems.

---

## Mistake 4 — Duplicate preprocessing

Avoid:

```python
X_scaled = scaler.fit_transform(X)

pipeline.fit(X_scaled, y)
```

when the pipeline already contains the scaler.

Keep preprocessing in one place.

---

## Mistake 5 — Incorrect GridSearchCV parameter names

Wrong:

```python
"C"
```

Correct:

```python
"model__C"
```

when the model step is named `"model"`.

---

# 60. Pipeline Best Practices

### 1. Keep preprocessing inside the pipeline

```text
Preprocessing
+
Model
```

should normally stay together.

### 2. Split before fitting

```text
Train/Test Split
      ↓
Pipeline
```

### 3. Use ColumnTransformer for mixed data

```text
Numerical
Categorical
```

can have different preprocessing.

### 4. Handle unknown categories

```python
OneHotEncoder(
    handle_unknown="ignore"
)
```

### 5. Use pipelines with cross-validation

This helps prevent preprocessing leakage between folds.

### 6. Use pipelines with hyperparameter tuning

```text
Pipeline
+
GridSearchCV
```

is a standard practical pattern.

### 7. Save the complete pipeline

```python
joblib.dump(...)
```

### 8. Keep training and prediction preprocessing identical

This is critical for production reliability.

---

# 61. Pipeline vs Manual Processing

| Manual Processing                         | Pipeline                            |
| ----------------------------------------- | ----------------------------------- |
| More repetitive code                      | Reusable workflow                   |
| Easy to forget steps                      | Steps are connected                 |
| Higher leakage risk                       | Better leakage control              |
| Harder deployment                         | Easier deployment                   |
| Harder CV                                 | Works naturally with CV             |
| Harder tuning                             | Works with GridSearchCV             |
| Preprocessing may be separated from model | Preprocessing + model stay together |

---

# 62. Pipeline vs ColumnTransformer

| Tool                | Main Purpose                                         |
| ------------------- | ---------------------------------------------------- |
| `Pipeline`          | Connect sequential steps                             |
| `ColumnTransformer` | Apply different transformations to different columns |

Example:

```text
Pipeline
   ↓
ColumnTransformer
   ↓
Model
```

This is one of the most common patterns for tabular Machine Learning.

---

# 63. Pipeline + Cross-Validation + Tuning

A mature workflow can look like:

```text
Raw Dataset
     ↓
Train/Test Split
     ↓
Pipeline
     ↓
ColumnTransformer
     ↓
Feature Processing
     ↓
Model
     ↓
Cross-Validation
     ↓
GridSearchCV / RandomizedSearchCV
     ↓
Best Pipeline
     ↓
Final Evaluation
     ↓
Save
```

This is much closer to a real ML workflow than manually transforming data in separate notebook cells.

---

# 64. When Should You Use a Pipeline?

Use a pipeline when:

* You have preprocessing steps.
* You need cross-validation.
* You need hyperparameter tuning.
* You want reproducible experiments.
* You want to save the complete workflow.
* You plan to deploy the model.
* You have multiple preprocessing stages.
* You want consistent training and inference.

For very simple experimentation, manual code can be acceptable, but pipelines become increasingly valuable as the project grows.

---

# 65. What You Should Remember

The most important pattern is:

```text
DATA
 ↓
PREPROCESSING
 ↓
MODEL
 ↓
PREDICTION
```

In scikit-learn:

```python
Pipeline([
    ("preprocessing", preprocessor),
    ("model", model)
])
```

For mixed tabular data:

```text
Pipeline
    ↓
ColumnTransformer
    ↓
Numerical Pipeline
    +
Categorical Pipeline
    ↓
Model
```

---

# 🧠 Final Mental Model

Think about an ML pipeline as **one complete ML machine**.

```text
                    ML PIPELINE
                         │
                         ↓
                    Raw Dataset
                         │
                         ↓
                  Train/Test Split
                         │
                         ↓
                ┌─────────────────┐
                │  Preprocessing  │
                └─────────────────┘
                         │
             ┌───────────┴───────────┐
             ↓                       ↓
        Numerical                Categorical
             ↓                       ↓
        Imputation                Imputation
             ↓                       ↓
         Scaling                 Encoding
             └───────────┬───────────┘
                         ↓
                  Feature Processing
                         ↓
                       Model
                         ↓
                    Prediction
                         ↓
                    Evaluation
                         ↓
                  Save Pipeline
                         ↓
                     Deployment
```

The core idea:

> **Build preprocessing and the model as one reproducible workflow instead of treating every step as separate code.**

---

# 🎯 Interview Cheat Sheet

| Question                              | Answer                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| What is an ML pipeline?               | A sequence of preprocessing and modeling steps connected into one workflow.         |
| Why use pipelines?                    | Reusability, consistency, reproducibility, leakage control, tuning, and deployment. |
| What is a transformer?                | An object that learns and applies data transformations.                             |
| What is an estimator?                 | An object that learns a prediction task.                                            |
| What does `fit()` do?                 | Learns parameters from data.                                                        |
| What does `transform()` do?           | Applies learned transformations.                                                    |
| What does `fit_transform()` do?       | Fits and transforms in one operation.                                               |
| What is ColumnTransformer?            | Applies different preprocessing to different columns.                               |
| Can pipelines contain models?         | Yes, normally the final step is a model.                                            |
| Can pipelines work with CV?           | Yes.                                                                                |
| Can pipelines work with GridSearchCV? | Yes.                                                                                |
| Why `model__C`?                       | It accesses parameter `C` inside the pipeline step named `model`.                   |
| Can pipelines be saved?               | Yes, commonly with joblib.                                                          |
| Why save the whole pipeline?          | It preserves preprocessing and model together.                                      |

---

# ✅ Module 14 Checklist

* [ ] Understand ML pipelines
* [ ] Understand why pipelines are useful
* [ ] Understand transformers
* [ ] Understand estimators
* [ ] Understand `fit()`
* [ ] Understand `transform()`
* [ ] Understand `fit_transform()`
* [ ] Build a basic `Pipeline`
* [ ] Handle missing values
* [ ] Scale numerical features
* [ ] Encode categorical features
* [ ] Understand `ColumnTransformer`
* [ ] Build numerical preprocessing
* [ ] Build categorical preprocessing
* [ ] Combine both preprocessing types
* [ ] Build classification pipelines
* [ ] Build regression pipelines
* [ ] Use pipelines with cross-validation
* [ ] Use pipelines with GridSearchCV
* [ ] Use pipelines with RandomizedSearchCV
* [ ] Understand pipeline parameter naming
* [ ] Understand data leakage prevention
* [ ] Add feature selection to pipelines
* [ ] Add PCA to pipelines
* [ ] Save pipelines with joblib
* [ ] Load pipelines
* [ ] Use saved pipelines for prediction
* [ ] Understand pipeline deployment workflow