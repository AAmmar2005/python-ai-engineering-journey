# 09 — NLP Evaluation

## 📌 Overview

Building an NLP model is only one part of the problem.

After training a model, we need to answer:

> **How well does the model actually perform on unseen text?**

This is the purpose of **NLP evaluation**.

For example, suppose we build a sentiment classifier:

```text
Input:
"I really love this product"

Prediction:
Positive
```

One correct prediction does not tell us whether the model is reliable.

We need to evaluate it on many unseen examples.

A typical NLP workflow is:

```text
Dataset
   ↓
Train / Validation / Test
   ↓
Preprocessing
   ↓
Feature Representation
   ↓
Model
   ↓
Predictions
   ↓
Evaluation
   ↓
Error Analysis
   ↓
Improvement
```

---

# 1. Why Evaluation Matters

A model can appear accurate while still performing poorly in important cases.

For example:

```text
Positive = 95%
Negative = 5%
```

A model that predicts `Positive` for every example gets:

```text
95% accuracy
```

But it completely fails to identify negative examples.

Therefore:

> **Never judge an NLP model using only one metric.**

The correct evaluation depends on:

* Dataset
* Task
* Class distribution
* Business requirement
* Cost of different errors

---

# 2. Train, Validation, and Test Sets

A common dataset split is:

```text
Dataset
   ↓
Training Set
Validation Set
Test Set
```

### Training Set

Used to train the model.

```text
Model learns from training data
```

### Validation Set

Used during development for:

* Model selection
* Hyperparameter tuning
* Comparing approaches

### Test Set

Used for final evaluation on unseen data.

```text
Training → Learn
Validation → Develop
Test → Final evaluation
```

The test set should not repeatedly influence model decisions.

---

# 3. Train/Test Split

A simple split can be created with scikit-learn:

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
```

Here:

```text
80% → Training
20% → Testing
```

`stratify=y` helps preserve the class distribution.

---

# 4. Accuracy

Accuracy measures the percentage of predictions that are correct.

Formula:

```text
Accuracy =
Correct Predictions
-------------------
Total Predictions
```

Example:

```text
100 predictions
90 correct

Accuracy = 90%
```

In classification:

```python
from sklearn.metrics import accuracy_score

accuracy = accuracy_score(y_test, predictions)
print(accuracy)
```

Accuracy is useful when classes are reasonably balanced.

---

# 5. Confusion Matrix

A confusion matrix shows how predictions are distributed across classes.

For binary classification:

```text
                    Predicted
                  Positive Negative

Actual Positive      TP       FN
Actual Negative      FP       TN
```

Where:

* **TP** = True Positive
* **TN** = True Negative
* **FP** = False Positive
* **FN** = False Negative

Example:

```text
                    Predicted
                  Pos      Neg

Actual Pos        80       10
Actual Neg         5        105
```

This tells us more than accuracy alone.

---

# 6. Precision

Precision answers:

> **When the model predicts positive, how often is it correct?**

Formula:

```text
Precision =
TP
---------
TP + FP
```

Example:

```text
Model predicted 100 positive examples.

90 were actually positive.

Precision = 90%
```

High precision means fewer false positives.

Precision can be important when false positive predictions are costly.

---

# 7. Recall

Recall answers:

> **Of all the actual positive examples, how many did the model find?**

Formula:

```text
Recall =
TP
---------
TP + FN
```

Example:

```text
100 actual positive examples

Model found 90

Recall = 90%
```

High recall means fewer false negatives.

Recall becomes especially important when missing a positive case is costly.

---

# 8. F1-Score

F1-score combines precision and recall.

Formula:

```text
F1 =
2 × Precision × Recall
-----------------------
Precision + Recall
```

F1 is useful when we want a balance between precision and recall.

In scikit-learn:

```python
from sklearn.metrics import f1_score

score = f1_score(
    y_test,
    predictions,
    average="binary"
)

print(score)
```

For multiclass problems, different averaging methods can be used.

---

# 9. Precision, Recall, and F1 Example

Suppose:

```text
Precision = 0.80
Recall = 0.60
```

The F1-score combines both.

A model with:

```text
Precision = 0.95
Recall = 0.20
```

may look excellent from precision alone but misses many positive examples.

Another model might have:

```text
Precision = 0.75
Recall = 0.75
```

The correct choice depends on the task requirements.

---

# 10. Classification Report

Scikit-learn provides a useful summary:

```python
from sklearn.metrics import classification_report

print(
    classification_report(
        y_test,
        predictions
    )
)
```

Example:

```text
              precision    recall    f1-score

negative         0.84       0.80       0.82
positive         0.87       0.90       0.88

accuracy                              0.86
```

This gives class-level performance instead of only one overall number.

---

# 11. Macro, Micro, and Weighted Average

For multiclass classification, F1 and other metrics can be averaged in different ways.

### Macro Average

Calculates the metric for every class and gives each class equal importance.

```text
Class 1 → metric
Class 2 → metric
Class 3 → metric

Average them equally
```

Useful when every class matters equally.

### Weighted Average

Weights each class according to its number of examples.

Large classes have more influence.

### Micro Average

Aggregates predictions across all classes before calculating the metric.

The appropriate averaging method depends on the task and class distribution.

---

# 12. Class Imbalance

NLP datasets can be highly imbalanced.

Example:

```text
Positive → 9000
Negative → 1000
```

A model can get high accuracy while performing poorly on the minority class.

Therefore, inspect:

```text
Class distribution
Confusion matrix
Precision
Recall
F1-score
```

For imbalanced datasets, **macro metrics** can be useful because they prevent large classes from completely dominating the average.

---

# 13. Cross-Validation

Instead of evaluating using only one train/test split, we can use cross-validation.

Example:

```text
Dataset
 ↓
Fold 1
Fold 2
Fold 3
Fold 4
Fold 5
```

With 5-fold cross-validation:

```text
Fold 1 → validation
Fold 2 → validation
...
Fold 5 → validation
```

Each fold gets a turn as the validation set.

The results can then be averaged.

Example:

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(
    model,
    X,
    y,
    cv=5,
    scoring="f1_macro"
)

print(scores)
print(scores.mean())
```

Cross-validation gives a more stable estimate than relying on one split.

---

# 14. Stratified Cross-Validation

For classification problems, **StratifiedKFold** can preserve class proportions across folds.

```python
from sklearn.model_selection import StratifiedKFold

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)
```

This is especially useful when the dataset has multiple classes or some class imbalance.

---

# 15. ROC-AUC

ROC-AUC evaluates how well a classifier separates classes across different decision thresholds.

The ROC curve compares:

```text
True Positive Rate
vs
False Positive Rate
```

AUC means:

```text
Area Under the Curve
```

Example:

```python
from sklearn.metrics import roc_auc_score

score = roc_auc_score(
    y_test,
    probabilities
)

print(score)
```

ROC-AUC is mainly useful for suitable classification settings where model scores or probabilities are available.

For heavily imbalanced classification, **Precision-Recall curves and PR-AUC** can sometimes provide more informative insight.

---

# 16. Precision-Recall Curve

A Precision-Recall curve shows the relationship between:

```text
Precision
     vs
Recall
```

It can be especially useful when the positive class is rare.

Example use cases include:

* Spam detection
* Fraud-like text detection
* Rare intent detection
* Toxic content detection

The key idea is:

> Different classification thresholds can produce different precision and recall values.

---

# 17. NLP-Specific Evaluation

Different NLP tasks require different evaluation methods.

### Text Classification

Common metrics:

```text
Accuracy
Precision
Recall
F1
Confusion Matrix
```

### Sentiment Analysis

Common metrics:

```text
Accuracy
Macro F1
Weighted F1
Confusion Matrix
```

### Similarity

Common measurements:

```text
Cosine Similarity
Correlation
Ranking metrics
```

### Information Retrieval

Common metrics include:

```text
Precision@K
Recall@K
MRR
MAP
NDCG
```

### Sequence Tasks

Depending on the task:

```text
Token-level accuracy
Precision
Recall
F1
```

Evaluation should always match the NLP task.

---

# 18. Error Analysis

Metrics tell us **how much** the model fails.

Error analysis helps us understand **why** it fails.

Create a table such as:

| Text                                   | Actual   | Predicted | Error Type      |
| -------------------------------------- | -------- | --------- | --------------- |
| not bad                                | Positive | Negative  | Negation        |
| amazing... broken again                | Negative | Positive  | Sarcasm         |
| phone bohat acha hai                   | Positive | Negative  | Roman Urdu      |
| battery is okay but camera is terrible | Negative | Positive  | Mixed sentiment |

This can reveal patterns that metrics cannot show.

---

# 19. Common NLP Error Categories

Useful categories include:

### Negation

```text
"not good"
```

### Sarcasm

```text
"Great, another problem."
```

### Ambiguity

```text
"This is sick."
```

### Spelling Errors

```text
"amaazing"
```

### Slang

```text
"this movie slaps"
```

### Code-Switching

```text
"ye product really acha hai"
```

### Domain-Specific Language

Technical terms may have meanings that differ from general language.

---

# 20. Data Leakage

Data leakage happens when information from outside the training process incorrectly influences the model.

Example:

```text
Entire Dataset
     ↓
Fit TF-IDF
     ↓
Train/Test Split
```

This is problematic because the TF-IDF vocabulary and statistics have already seen the test data.

Instead:

```text
Dataset
   ↓
Train/Test Split
   ↓
Fit TF-IDF on Training Data
   ↓
Transform Test Data
   ↓
Evaluate
```

Using a scikit-learn `Pipeline` helps keep this process correct.

```python
from sklearn.pipeline import Pipeline

model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression())
])
```

---

# 21. Vocabulary Leakage

Consider:

```python
vectorizer.fit(all_text)
```

before splitting the data.

The vectorizer has now seen information from the test set.

Correct approach:

```python
vectorizer.fit(X_train)

X_train_vectorized = vectorizer.transform(X_train)
X_test_vectorized = vectorizer.transform(X_test)
```

With a pipeline, this is handled automatically during fitting and prediction.

---

# 22. Baseline Comparison

Always establish a baseline.

Example:

```text
Baseline
   ↓
TF-IDF + Naive Bayes
   ↓
TF-IDF + Logistic Regression
   ↓
TF-IDF + Linear SVM
```

Then compare metrics.

Example:

| Model               | Accuracy | Macro F1 |
| ------------------- | -------: | -------: |
| Baseline            |     0.70 |     0.62 |
| Naive Bayes         |     0.81 |     0.78 |
| Logistic Regression |     0.84 |     0.82 |
| Linear SVM          |     0.85 |     0.83 |

The numbers above are only an example. Actual results depend on the dataset.

The important idea is to compare models using the same evaluation setup.

---

# 23. Model Comparison

When comparing NLP models, keep the evaluation conditions consistent.

Compare:

```text
Same dataset
Same test set
Same preprocessing rules
Same evaluation metrics
```

Example:

```text
TF-IDF + Logistic Regression
TF-IDF + Linear SVM
TF-IDF + Naive Bayes
```

Then evaluate all models on the same unseen test data.

---

# 24. Hyperparameter Tuning and Evaluation

Evaluation metrics can also be used during hyperparameter tuning.

Example:

```python
from sklearn.model_selection import GridSearchCV

grid = GridSearchCV(
    model,
    param_grid,
    cv=5,
    scoring="f1_macro"
)

grid.fit(X_train, y_train)
```

Possible parameters:

```text
ngram_range
min_df
max_df
C
class_weight
```

The validation process helps select a configuration.

The final test set should remain separate for final evaluation.

---

# 25. Evaluation Does Not Mean One Number

A complete NLP evaluation should look more like:

```text
                    Model
                      ↓
             ┌────────┴────────┐
             ↓                 ↓
          Metrics         Error Analysis
             ↓                 ↓
       F1 / Recall       Why errors happen
       Precision         Error categories
       Accuracy          Difficult examples
             └────────┬────────┘
                      ↓
                  Improve
```

A model with a slightly lower accuracy may reveal much better performance on an important minority class.

Therefore, always inspect the full evaluation picture.

---

# 26. Reproducibility

Evaluation should be reproducible.

Use:

```python
random_state=42
```

where appropriate.

Keep track of:

* Dataset version
* Train/test split
* Preprocessing
* Features
* Model
* Hyperparameters
* Evaluation metrics

Example:

```text
Experiment
 ├── Dataset
 ├── Preprocessing
 ├── TF-IDF settings
 ├── Model
 ├── Parameters
 └── Metrics
```

This makes model comparisons more reliable.

---

# 27. Practical Evaluation Workflow

A practical classical NLP workflow:

```text
1. Load Dataset
       ↓
2. Inspect Class Distribution
       ↓
3. Split Train/Test
       ↓
4. Build Pipeline
       ↓
5. Train Baseline
       ↓
6. Generate Predictions
       ↓
7. Calculate Metrics
       ↓
8. Inspect Confusion Matrix
       ↓
9. Perform Error Analysis
       ↓
10. Tune Model
       ↓
11. Compare Models
       ↓
12. Final Test Evaluation
       ↓
13. Save Model
```

---

# 28. Example Evaluation Code

```python
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

predictions = model.predict(X_test)

print("Accuracy:")
print(accuracy_score(y_test, predictions))

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        predictions
    )
)

print("\nConfusion Matrix:")
print(
    confusion_matrix(
        y_test,
        predictions
    )
)
```

This gives a basic evaluation of a classification model.

---

# 29. What Makes an Evaluation Reliable?

A reliable NLP evaluation should have:

* Unseen test data
* No data leakage
* Appropriate metrics
* Correct train/test separation
* Representative data
* Class distribution analysis
* Error analysis
* Reproducible experiments
* Task-specific evaluation

Also remember:

> **A test score is only meaningful if the test data represents the type of text the model will encounter in the real world.**

---

# 30. Evaluation in Production

Evaluation should not stop after deployment.

Real-world data can change.

For example:

```text
Training Data
     ↓
Historical customer reviews
```

Later:

```text
Production Data
     ↓
New slang
New products
New languages
New customer behavior
```

Performance may change over time.

Therefore production systems may require:

```text
Monitoring
 ↓
Collect feedback
 ↓
Analyze errors
 ↓
Retrain
 ↓
Evaluate again
```

This connects NLP evaluation with later **MLOps and model monitoring** topics.

---

# 🧠 Mental Model

Remember NLP evaluation as:

```text
TRAIN
  ↓
VALIDATE
  ↓
TEST
  ↓
MEASURE
  ↓
UNDERSTAND ERRORS
  ↓
IMPROVE
  ↓
RE-EVALUATE
```

And remember the main metrics:

```text
Accuracy  → How many predictions were correct?

Precision → When I predict positive, how often am I right?

Recall    → How many actual positives did I find?

F1        → How well are precision and recall balanced?

Confusion Matrix → What types of mistakes are happening?
```

---

# 📌 Key Takeaways

After this topic, you should understand:

* Why NLP models need evaluation
* Train/validation/test datasets
* Train/test splitting
* Stratification
* Accuracy
* Precision
* Recall
* F1-score
* Confusion matrix
* Macro/micro/weighted averages
* Class imbalance
* Cross-validation
* Stratified cross-validation
* ROC-AUC
* Precision-Recall curves
* Data leakage
* Vocabulary leakage
* Baseline comparison
* Model comparison
* Hyperparameter evaluation
* Error analysis
* NLP-specific evaluation
* Reproducibility
* Production evaluation

The main principle is:

> **Don't just ask whether the model is accurate. Ask which examples it gets wrong, why it gets them wrong, and whether those errors matter for the real application.**

---

## 📚 Next Topic

### `10-Advanced-Classical-NLP`

Next, move into advanced classical NLP concepts such as:

* Advanced text feature engineering
* Character-level features
* Keyword extraction
* Information extraction
* Named Entity Recognition
* Topic Modeling
* Text Clustering
* Document Similarity
* Information Retrieval
* Search with TF-IDF
* Long-document handling
* Multilingual and Roman Urdu considerations
* Classical NLP project architecture
* End-to-end classical NLP workflow
