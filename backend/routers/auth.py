import logging
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel

from backend.models.user import UserCreate, UserOut
from backend.store.users import find_by_email, create_user, verify_password, get_by_id
from backend.auth.jwt import create_access_token, create_refresh_token, verify_token
from backend.auth.deps import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


# Response schemas
class TokenResponse(BaseModel):
    """Response containing access and refresh tokens."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


class LoginRequest(BaseModel):
    """Request to log in."""
    email: str
    password: str


class RefreshRequest(BaseModel):
    """Request to refresh an access token."""
    refresh_token: str


# Rate limiting decorator (will be applied in main.py)
# @router.post("/signup", status_code=status.HTTP_201_CREATED)
# @limiter.limit("10/minute")
@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=TokenResponse)
async def signup(user_create: UserCreate):
    """
    Create a new user account.
    
    - **name**: User's full name (min 2 chars)
    - **email**: Unique email address
    - **password**: Password (min 8 chars)
    - **role**: One of 'lawyer', 'client', 'employee'
    
    Returns access and refresh tokens on success.
    """
    # Check if email already exists
    existing_user = find_by_email(user_create.email)
    if existing_user:
        logger.warning(f"Signup attempt with existing email: {user_create.email}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    
    # Create the user
    user_in_db = create_user(user_create)
    
    # Generate tokens
    access_token = create_access_token(sub=user_in_db.id, role=user_in_db.role)
    refresh_token = create_refresh_token(sub=user_in_db.id)
    
    logger.info(f"User signed up: {user_in_db.email}")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserOut(
            id=user_in_db.id,
            name=user_in_db.name,
            email=user_in_db.email,
            role=user_in_db.role,
        ),
    )


@router.post("/login", response_model=TokenResponse)
async def login(login_request: LoginRequest):
    """
    Log in with email and password.
    
    Returns access and refresh tokens on success.
    """
    # Find user by email
    user_in_db = find_by_email(login_request.email)
    if not user_in_db:
        logger.warning(f"Login attempt with non-existent email: {login_request.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    # Verify password
    if not verify_password(login_request.password, user_in_db.hashed_password):
        logger.warning(f"Login attempt with wrong password for: {login_request.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    # Generate tokens
    access_token = create_access_token(sub=user_in_db.id, role=user_in_db.role)
    refresh_token = create_refresh_token(sub=user_in_db.id)
    
    logger.info(f"User logged in: {user_in_db.email}")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserOut(
            id=user_in_db.id,
            name=user_in_db.name,
            email=user_in_db.email,
            role=user_in_db.role,
        ),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: RefreshRequest):
    """
    Refresh an access token using a refresh token.
    
    Returns a new access token and refresh token.
    """
    # Verify refresh token
    payload = verify_token(request.refresh_token, token_type="refresh")
    if payload is None:
        logger.warning("Refresh attempt with invalid or expired refresh token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    
    user_id: str = payload.get("sub")
    
    # Get user from store
    user_in_db = get_by_id(user_id)
    if not user_in_db:
        logger.warning(f"Refresh attempt for non-existent user: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    # Generate new tokens
    access_token = create_access_token(sub=user_in_db.id, role=user_in_db.role)
    refresh_token = create_refresh_token(sub=user_in_db.id)
    
    logger.info(f"Token refreshed for user: {user_in_db.email}")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserOut(
            id=user_in_db.id,
            name=user_in_db.name,
            email=user_in_db.email,
            role=user_in_db.role,
        ),
    )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(current_user: UserOut = Depends(get_current_user)):
    """
    Log out the current user.
    
    This is a stateless endpoint — the frontend should delete the session cookie.
    """
    logger.info(f"User logged out: {current_user.email}")
    return {"message": "Logged out successfully"}
