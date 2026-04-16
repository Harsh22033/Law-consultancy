from pydantic import BaseModel, Field
from typing import Literal


class TaskCreate(BaseModel):
    """Request model for creating a task."""
    title: str = Field(..., min_length=1)
    status: Literal["pending", "completed"] = "pending"
    assigned_to: str = Field(..., min_length=1)


class TaskOut(BaseModel):
    """Response model for a task."""
    id: str
    title: str
    status: Literal["pending", "completed"]
    assigned_to: str
