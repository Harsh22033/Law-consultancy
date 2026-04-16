import logging
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel

from backend.models.case import CaseCreate, CaseOut
from backend.models.user import UserOut
from backend.store.cases import create, get_all, get_by_id, update_status
from backend.auth.deps import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/cases", tags=["cases"])


class CaseStatusUpdate(BaseModel):
    """Request model for updating case status."""
    status: str


@router.get("", response_model=list[CaseOut])
async def list_cases(current_user: UserOut = Depends(get_current_user)):
    """
    Get all cases filtered by role.
    
    - Lawyer: sees cases where lawyer_id matches
    - Client: sees cases where client_id matches
    """
    all_cases = get_all()
    
    if current_user.role == "lawyer":
        return [c for c in all_cases if c.lawyer_id == current_user.id]
    elif current_user.role == "client":
        return [c for c in all_cases if c.client_id == current_user.id]
    else:
        # Employee role cannot view cases
        return []


@router.post("", status_code=status.HTTP_201_CREATED, response_model=CaseOut)
async def create_case(
    case_create: CaseCreate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Create a new case.
    
    Only lawyers can create cases.
    """
    if current_user.role != "lawyer":
        logger.warning(f"Non-lawyer user {current_user.id} attempted to create case")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only lawyers can create cases",
        )
    
    case = create(case_create, lawyer_id=current_user.id)
    logger.info(f"Case created: {case.id} by lawyer {current_user.id}")
    return case


@router.put("/{case_id}", response_model=CaseOut)
async def update_case_status(
    case_id: str,
    update: CaseStatusUpdate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Update case status.
    
    Only lawyers can update cases.
    """
    if current_user.role != "lawyer":
        logger.warning(f"Non-lawyer user {current_user.id} attempted to update case")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only lawyers can update cases",
        )
    
    case = get_by_id(case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found",
        )
    
    # Verify the lawyer owns this case
    if case.lawyer_id != current_user.id:
        logger.warning(f"Lawyer {current_user.id} attempted to update case {case_id} they don't own")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own cases",
        )
    
    updated_case = update_status(case_id, update.status)
    logger.info(f"Case {case_id} status updated to {update.status}")
    return updated_case
