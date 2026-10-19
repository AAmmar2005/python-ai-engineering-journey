
# AI Study Planner Agent

A beginner-friendly Python project that organizes study tasks
according to their deadlines and available study time.

## Overview

The Study Planner Agent helps students prioritize assignments,
exams, and other study tasks. It calculates deadline urgency,
sorts tasks, and allocates the available study hours.

## Features

- Add study tasks with deadlines
- Estimate the hours needed for each task
- Identify overdue and urgent tasks
- Prioritize tasks by deadline urgency
- Allocate available daily study time
- Display remaining work and unused study time

## How It Works

1. The user enters available study hours.
2. The user enters task names, deadlines, and estimated hours.
3. The program calculates the urgency of each deadline.
4. Tasks are sorted by urgency and deadline.
5. Available study time is allocated to prioritized tasks.
6. The program displays the generated study plan.

## Tech Stack

- Python
- datetime
- date

## Project Structure

study-planner-agent/
├── main.py
├── README.md
├── requirements.txt
└── .gitignore

## Installation and Usage

Install Python 3 if it is not already installed.

Clone or download this project and open a terminal
inside the project folder.

Run:

python main.py

No external Python packages or API keys are required.

## Example

Input:
- Task: Mathematics Assignment
- Deadline: 2026-10-20
- Estimated hours: 3
- Available study hours: 2

The program displays the task's urgency and allocates
up to two study hours to it, depending on its priority.

Note: The urgency and deadline status depend on the
date when the program is executed.

## Limitations

- Tasks are not saved after the program closes.
- The program does not use an LLM or external AI API.
- The schedule allocates time for today only.
- The program does not automatically create reminders.

## Future Improvements

- Save tasks in a database or JSON file.
- Add a graphical user interface.
- Generate multi-day study schedules.
- Integrate an LLM for personalized study suggestions.

## Developer

Add your name, GitHub profile, LinkedIn profile,
and your role in building this project before submitting.

## License

Follow the parent repository's license and contribution
guidelines. Do not add a separate license without checking
compatibility.
