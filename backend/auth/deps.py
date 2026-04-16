import logging
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from starlette.requests import Request
from backend.auth.jwt import verify_token
from backend.store.users import get_by_id
from backend.models.user import UserOut

logger = logging.getLogger(__name__)

security = HTTPBearer()


async def get_current_user(request: Request) -> UserOut:
    """
    Dependency to extract and verify the current user from the Authorization header.
    
    Raises:
        HTTPException(401): If token is missing, invalid, or expired.
    """
    # Get the token from the Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        logger.warning("Missing or invalid Authorization header")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_header.split(" ")[1]
    
    # Verify the token
    payload = verify_token(token, token_type="access")
    if payload is None:
        logger.warning("Invalid or expired access token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id: str = payload.get("sub")
    role: str = payload.get("role")
    
    # Get user from store
    user_in_db = get_by_id(user_id)
    if user_in_db is None:
        logger.warning(f"User not found: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return UserOut(
        id=user_in_db.id,
        name=user_in_db.name,
        email=user_in_db.email,
        role=user_in_db.role,
    )
