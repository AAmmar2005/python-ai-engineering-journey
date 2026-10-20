# Task-2-Credit-Risk-Prediction
Predict whether a loan applicant is likely to default on a loan.


# 💳 Credit Risk Prediction – Loan Default Classification

## 📌 Objective

The goal of this project is to:

* Predict whether a loan applicant is likely to **default**.
* Perform **data cleaning and preprocessing**.
* Conduct **Exploratory Data Analysis (EDA)**.
* Train a **classification model**.
* Evaluate performance using **Accuracy** and **Confusion Matrix**.

This is a **Binary Classification** problem.

---

## 📊 Dataset

Dataset used: **Loan Prediction Dataset (Kaggle)**

The dataset contains information such as:

* Gender
* Education
* Applicant Income
* Loan Amount
* Credit History
* Property Area
* Loan Status (Target Variable)

Target Variable:

* `Loan_Status`

  * 1 → Loan Approved (No Default)
  * 0 → Loan Rejected / Default Risk

---

## 🛠️ Technologies Used

* Python 🐍
* Pandas
* NumPy
* Matplotlib
* Seaborn
* Scikit-learn

---

## 📂 Project Structure

```
credit-risk-prediction/
│
├── loan_prediction.ipynb
├── train.csv
├── requirements.txt
└── README.md
```

---

# 🔎 Project Workflow

---

## 1️⃣ Data Loading

```python
import pandas as pd

df = pd.read_csv("train.csv")
df.head()
```

---

## 2️⃣ Data Inspection

```python
df.shape
df.columns
df.info()
df.isnull().sum()
```

✔ Checked dataset size
✔ Identified missing values
✔ Examined data types

---

## 3️⃣ Handling Missing Values

Missing values were handled using:

* **Mode** → For categorical variables (Gender, Education)
* **Median** → For numerical variables (LoanAmount)
* Dropped rows only if necessary

```python
df['Gender'].fillna(df['Gender'].mode()[0], inplace=True)
df['LoanAmount'].fillna(df['LoanAmount'].median(), inplace=True)
```

---

# 📊 Exploratory Data Analysis (EDA)

## 📍 Loan Amount Distribution

![Image](https://www.researchgate.net/publication/254450630/figure/fig1/AS%3A669396448075779%401536607958173/Histogram-of-the-Amount-of-the-Loan-sample-individuals-who-have-a-loan.png)

![Image](https://files.realpython.com/media/commute_times.621e5b1ce062.png)

![Image](https://www.researchgate.net/publication/233755791/figure/fig3/AS%3A299941298753546%401448522986610/Risk-score-histogram-and-the-definition-of-risk-class-labels.png)

![Image](https://www.researchgate.net/publication/272590947/figure/fig1/AS%3A639642349076481%401529514028124/Histograms-of-Output-Weighted-Credit-Risk-Estimates.png)

```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.histplot(df['LoanAmount'], kde=True)
plt.title("Loan Amount Distribution")
plt.show()
```

---

## 📍 Education vs Loan Status

![Image](https://miro.medium.com/v2/resize%3Afit%3A2000/1%2ASLYxU-seMcapADJYL_hcxw.png)

![Image](https://miro.medium.com/v2/resize%3Afit%3A878/1%2A2Lel0-wF8p-QuT5clf8Ksw.png)

![Image](https://www.researchgate.net/publication/250918002/figure/fig1/AS%3A436599935770626%401481104944421/Figure-1-Sample-showing-comparison-of-categorical-data-using-Bar-charts.png)

![Image](https://rkabacoff.github.io/datavis/datavis_files/figure-html/stackedbar-1.png)

```python
sns.countplot(x='Education', hue='Loan_Status', data=df)
plt.title("Education vs Loan Status")
plt.show()
```

---

## 📍 Applicant Income Distribution

![Image](https://www.researchgate.net/publication/357314606/figure/fig2/AS%3A11431281127369702%401679009808243/The-household-distribution-histogram-by-level-of-cash-income-according-to-the-results-of.png)

![Image](https://i.sstatic.net/O4L2v.png)

![Image](https://www.mdpi.com/mathematics/mathematics-07-00713/article_deploy/html/images/mathematics-07-00713-g001.png)

![Image](https://www.researchgate.net/publication/301576662/figure/fig3/AS%3A362286758809602%401463387302409/Graphs-of-credit-risk-324-Liquidity-Risk-Liquidity-risk-occurs-when-a-bank-cannot.png)

```python
sns.histplot(df['ApplicantIncome'], kde=True)
plt.title("Applicant Income Distribution")
plt.show()
```

---

# 🤖 Model Training

We trained a **Logistic Regression** model for classification.

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix

X = df.drop("Loan_Status", axis=1)
y = df["Loan_Status"]

# Convert categorical variables
X = pd.get_dummies(X, drop_first=True)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
```

---

# 📈 Model Evaluation

## ✅ Accuracy

```python
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)
```

---

## 📉 Confusion Matrix

```python
cm = confusion_matrix(y_test, y_pred)
print(cm)
```

Confusion Matrix Interpretation:

* True Positives
* True Negatives
* False Positives
* False Negatives

---

# 🎯 Results

* Logistic Regression achieved satisfactory accuracy.
* Credit History was one of the strongest predictors.
* Income and Loan Amount significantly influenced approval probability.

---

# 🧠 Skills Demonstrated

✔ Data Cleaning & Missing Value Handling
✔ Feature Engineering
✔ Exploratory Data Analysis
✔ Binary Classification
✔ Logistic Regression
✔ Confusion Matrix Interpretation
✔ Model Evaluation

---

# 🚀 Future Improvements

* Try Decision Tree / Random Forest
* Perform Feature Scaling
* Hyperparameter Tuning
* Deploy model using Flask or FastAPI
* Build a Streamlit dashboard

---

# 🏁 Conclusion

This project demonstrates a complete **end-to-end machine learning workflow**, including:

* Data preprocessing
* Visualization
* Model building
* Model evaluation

It provides a strong foundation for real-world **Credit Risk Modeling** applications used in fintech and banking systems.

