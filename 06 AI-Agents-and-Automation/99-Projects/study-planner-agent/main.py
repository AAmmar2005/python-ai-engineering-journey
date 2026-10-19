
from datetime import date, datetime


def get_urgency(deadline):
    """Decide how urgently a task needs attention."""
    days_left = (deadline - date.today()).days

    if days_left < 0:
        return 0, "OVERDUE"
    elif days_left == 0:
        return 1, "DUE TODAY"
    elif days_left <= 2:
        return 2, "URGENT"
    elif days_left <= 7:
        return 3, "UPCOMING"
    else:
        return 4, "LOW PRIORITY"


def get_tasks():
    """Collect tasks from the user."""
    tasks = []

    print("\nEnter your study tasks.")
    print("Leave the task name empty when finished.\n")

    while True:
        title = input("Task name: ").strip()

        if not title:
            break

        try:
            deadline_text = input(
                "Deadline (YYYY-MM-DD): "
            ).strip()
            deadline = datetime.strptime(
                deadline_text, "%Y-%m-%d"
            ).date()

            hours = float(input("Estimated hours needed: "))

            if hours <= 0:
                print("Hours must be greater than zero.")
                continue

        except ValueError:
            print("Invalid date or hours. Please try again.")
            continue

        rank, urgency = get_urgency(deadline)

        tasks.append({
            "title": title,
            "deadline": deadline,
            "hours": hours,
            "rank": rank,
            "urgency": urgency
        })

        print("Task added successfully!\n")

    return tasks


def create_study_plan(tasks, daily_hours):
    """Prioritize tasks and allocate today's study time."""
    tasks.sort(
        key=lambda task: (
            task["rank"],
            task["deadline"]
        )
    )

    print("\n========== YOUR STUDY PLAN ==========")

    if not tasks:
        print("No tasks were entered.")
        return

    available = daily_hours

    for number, task in enumerate(tasks, start=1):
        days_left = (task["deadline"] - date.today()).days

        if days_left < 0:
            deadline_status = f"{abs(days_left)} day(s) overdue"
        elif days_left == 0:
            deadline_status = "Due today"
        else:
            deadline_status = f"{days_left} day(s) left"

        print(f"\n{number}. {task['title']}")
        print(f"   Priority: {task['urgency']}")
        print(f"   Deadline: {task['deadline']} ({deadline_status})")
        print(f"   Estimated work: {task['hours']:.1f} hour(s)")

        if available > 0:
            allocated = min(task["hours"], available)
            available -= allocated

            print(f"   Study today: {allocated:.1f} hour(s)")

            remaining = task["hours"] - allocated
            if remaining > 0:
                print(f"   Work remaining: {remaining:.1f} hour(s)")
        else:
            print("   Study today: Not scheduled")

    print("\n=====================================")
    print(f"Unused study time: {available:.1f} hour(s)")
    print("Plan generated successfully!")


def main():
    print("====================================")
    print("       AI STUDY PLANNER AGENT")
    print("====================================")

    while True:
        try:
            daily_hours = float(
                input("\nHow many hours can you study today? ")
            )

            if daily_hours > 0:
                break

            print("Enter a number greater than zero.")

        except ValueError:
            print("Please enter a valid number.")

    tasks = get_tasks()
    create_study_plan(tasks, daily_hours)


if __name__ == "__main__":
    main()
