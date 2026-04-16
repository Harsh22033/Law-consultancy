from pydantic import BaseModel, Field
from typing import Literal


class CaseCreate(BaseModel):
    """Request model for creating a case."""
    title: str = Field(..., min_length=1)
    status: Literal["open", "closed", "pending"] = "open"
    client_id: str = Field(..., min_length=1)


class CaseOut(BaseModel):
    """Response model for a case."""
    id: str
    title: str
    status: Literal["open", "closed", "pending"]
    lawyer_id: str
    client_id: str
