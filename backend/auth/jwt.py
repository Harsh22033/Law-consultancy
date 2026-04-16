import logging
import os
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from typing import Literal

logger = logging.getLogger(__name__)

# Load JWT configuration from environment
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise ValueError("JWT_SECRET environment variable is required")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# Token expiry times
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


def create_access_token(sub: str, role: str) -> str:
    """Create a short-lived access token (15 minutes)."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": sub,
        "role": role,
        "type": "access",
        "exp": expire,
    }
    encoded_jwt = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    logger.info(f"Access token created for user: {sub}")
    return encoded_jwt


def create_refresh_token(sub: str) -> str:
    """Create a long-lived refresh token (7 days)."""
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": sub,
        "type": "refresh",
        "exp": expire,
    }
    encoded_jwt = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    logger.info(f"Refresh token created for user: {sub}")
    return encoded_jwt


def verify_token(token: str, token_type: Literal["access", "refresh"] = "access") -> dict | None:
    """Verify a token and return its payload."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        
        # Check token type
        if payload.get("type") != token_type:
            logger.warning(f"Token type mismatch: expected {token_type}, got {payload.get('type')}")
            return None
        
        sub: str = payload.get("sub")
        if sub is None:
            logger.warning("Token missing 'sub' claim")
            return None
        
        return payload
    except JWTError as e:
        logger.warning(f"Token verification failed: {e}")
        return None
