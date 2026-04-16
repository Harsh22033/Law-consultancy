import logging
from fastapi import APIRouter, HTTPException, status, Depends

from backend.models.task import TaskCreate, TaskOut
from backend.models.user import UserOut
from backend.store.tasks import create, get_all, get_by_id
from backend.auth.deps import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskOut])
async def list_tasks(current_user: UserOut = Depends(get_current_user)):
    """
    Get all tasks assigned to the current user.
    
    Only employees can access tasks.
    """
    if current_user.role != "employee":
        logger.warning(f"Non-employee user {current_user.id} attempted to access tasks")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employees can access tasks",
        )
    
    all_tasks = get_all()
    return [t for t in all_tasks if t.assigned_to == current_user.id]


@router.post("", status_code=status.HTTP_201_CREATED, response_model=TaskOut)
async def create_task(
    task_create: TaskCreate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Create a new task.
    
    Only employees can create tasks.
    """
    if current_user.role != "employee":
        logger.warning(f"Non-employee user {current_user.id} attempted to create task")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employees can create tasks",
        )
    
    task = create(task_create)
    logger.info(f"Task created: {task.id} by employee {current_user.id}")
    return task
