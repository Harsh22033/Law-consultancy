from backend.models.task import TaskCreate, TaskOut
from backend.utils.id import generate_id

# In-memory store for tasks
tasks_db: dict[str, TaskOut] = {}


def create(task_create: TaskCreate) -> TaskOut:
    """Create a new task."""
    task_id = generate_id()
    task = TaskOut(
        id=task_id,
        title=task_create.title,
        status=task_create.status,
        assigned_to=task_create.assigned_to,
    )
    tasks_db[task_id] = task
    return task


def get_all() -> list[TaskOut]:
    """Get all tasks."""
    return list(tasks_db.values())


def get_by_id(task_id: str) -> TaskOut | None:
    """Get a task by ID."""
    return tasks_db.get(task_id)
