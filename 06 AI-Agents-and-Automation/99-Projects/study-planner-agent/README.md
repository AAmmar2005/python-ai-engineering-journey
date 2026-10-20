# AI Study Planner Agent

A Python-based study planning application that prioritizes academic tasks according to their deadlines and allocates available study hours to help students manage their time effectively.

## 1. Project Overview

The AI Study Planner Agent is a command-line application designed to help students organize their academic responsibilities and create a prioritized daily study plan.

Students often struggle to manage multiple assignments, quizzes, and projects with different deadlines. This application addresses that challenge by evaluating task urgency, sorting tasks by priority, and allocating available study time.

The project demonstrates how Python programming and rule-based automation can simplify everyday study planning.

## 2. Key Features

- **Task Management:** Enter task names, deadlines, and estimated completion hours.
- **Deadline Analysis:** Calculate the time remaining until each deadline.
- **Priority Classification:** Categorize tasks as OVERDUE, DUE TODAY, URGENT, UPCOMING, or LOW PRIORITY.
- **Automatic Task Sorting:** Arrange tasks according to urgency and deadline.
- **Study-Time Allocation:** Allocate available daily study hours to higher-priority tasks first.
- **Remaining Work Estimation:** Display the estimated hours remaining for each task.
- **Input Validation:** Handle invalid dates, invalid numeric values, and non-positive study-hour estimates.
- **Study Plan Generation:** Generate a structured report showing task priorities, deadlines, and allocated study time.

## 3. How It Works

The application follows a rule-based workflow implemented in Python.

1. The user enters the number of hours available for studying.
2. The application collects task names, deadlines, and estimated working hours.
3. It calculates the days remaining until each deadline.
4. Each task is assigned an urgency level and priority rank.
5. Tasks are sorted by priority rank and deadline.
6. Available study hours are allocated in priority order.
7. Remaining work is calculated for tasks that cannot be completed within the allocated time.
8. The final study plan is displayed in the terminal.

### Priority Classification

| Condition | Priority |
|---|---|
| Deadline has passed | OVERDUE |
| Deadline is today | DUE TODAY |
| Deadline is within 1–2 days | URGENT |
| Deadline is within 3–7 days | UPCOMING |
| Deadline is more than 7 days away | LOW PRIORITY |

**Technology note:** The current implementation uses Python-based rules and date calculations. It does not currently integrate an LLM, external APIs, or a database.

## 4. Technology Stack

- **Programming Language:** Python 3
- **Standard Library:** `datetime`
- **Data Structures:** Lists and dictionaries
- **Interface:** Command-line interface (CLI)
- **Version Control:** Git and GitHub

The application uses Python's standard library and does not require third-party packages.

## 5. Project Structure

```text
AI-Study-Planner-Agent/
├── main.py
├── README.md
├── LICENSE
└── screenshots/
    ├── task-input.png
    └── study-plan.png
```

- `main.py` — Contains the main application and study-planning logic.
- `README.md` — Provides project documentation and usage instructions.
- `LICENSE` — Defines the project's usage and distribution permissions, if added.
- `screenshots/` — Stores screenshots of the application in operation.

Adjust the filenames to match your actual repository. The license and screenshot files must be added separately.

## 6. Installation and Setup

### Prerequisites

- Python 3
- Git (for cloning the repository)

### Clone the Repository

```bash
git clone https://github.com/umaimaghafoor0-spec//waleedkhokar/python-ai-engineering-journey/.git
```


### Navigate to the Project Directory

```bash
cd YOUR_REPOSITORY
```

### Run the Application

**Windows:**

```bash
python main.py
```

Alternatively, use `py main.py` if Python is configured through the Windows launcher.

**macOS/Linux:**

```bash
python3 main.py
```

No dependency installation is required for the current implementation.

## 7. Usage Example

The application asks the user to enter available study hours and then collect tasks with their deadlines and estimated completion times.

### Sample Input

Assume the current date is October 19, 2026.

```text
How many hours can you study today? 3.5

Task name: Mathematics Assignment
Deadline (YYYY-MM-DD): 2026-10-19
Estimated hours needed: 2

Task name: Python Quiz Preparation
Deadline (YYYY-MM-DD): 2026-10-20
Estimated hours needed: 3

Task name:
```

### Sample Output

```text
========== YOUR STUDY PLAN ==========

1. Mathematics Assignment
   Priority: DUE TODAY
   Deadline: 2026-10-19 (Due today)
   Estimated work: 2.0 hour(s)
   Study today: 2.0 hour(s)

2. Python Quiz Preparation
   Priority: URGENT
   Deadline: 2026-10-20 (1 day(s) left)
   Estimated work: 3.0 hour(s)
   Study today: 1.5 hour(s)
   Work remaining: 1.5 hour(s)

=====================================
Unused study time: 0.0 hour(s)
Plan generated successfully!
```

The example demonstrates the program's actual allocation logic, assuming the specified date. Actual results depend on the date and tasks entered.

## 8. Screenshots and Demo

Screenshots can be added to demonstrate the application's input process and generated study plan.
study-plam.png
task-input.png


### Task Input

![Task input screenshot](/task-input.png)

### Generated Study Plan

![Generated study plan](/study-plan.png)

Replace these image references with actual screenshots saved in the `screenshots` folder. A demo video or live demonstration link can also be added when available.

## 9. Environment Variables

The application does not require API keys, external credentials, or environment variables.

A `.env` file is therefore unnecessary for the current version.

## 10. Limitations and Future Improvements

### Current Limitations

- The application operates through a command-line interface.
- Tasks are stored temporarily and are not saved after the program closes.
- Prioritization is based on deadlines rather than task difficulty or academic importance.
- Study time is allocated sequentially without scheduling breaks.
- The application does not use an LLM or provide AI-generated recommendations.

### Future Improvements

- Develop a graphical or web-based interface.
- Add permanent task storage using SQLite.
- Implement task editing and completion tracking.
- Generate weekly study schedules.
- Include study breaks and Pomodoro sessions.
- Consider task difficulty and academic importance.
- Integrate an LLM for personalized study recommendations.
- Add automated testing and enhanced input validation.

## 11. Developer Information

### Umaima Ghafoor

I am a student developing my skills in programming, generative AI, and automation. I am interested in building practical software solutions that solve everyday problems and improve productivity.

**Technical Skills and Interests**
- Python programming
- Problem-solving and programming fundamentals
- Git and GitHub
- Generative AI and AI automation

**Role in This Project**

I developed the application logic for task collection, deadline-based urgency classification, task prioritization, study-time allocation, and study plan generation.

**GitHub:** https://github.com/umaimaghafoor0-spec

**LinkedIn:** https://www.linkedin.com/in/umaima-g-358500233

## 12. License

No license has been confirmed for this repository.

Before publishing, check whether a `LICENSE` file already exists. If you want to allow others to use, modify, and distribute your original code, consider an appropriate open-source license, such as the MIT License, and add its complete text to the repository.

Do not claim a specific license until it has actually been added.

---

*Thank you for visiting the AI Study Planner Agent repository.*
Maintained by the project contributor.