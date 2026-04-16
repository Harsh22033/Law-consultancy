import logging
from passlib.context import CryptContext
from backend.models.user import UserCreate, UserInDB
from backend.utils.id import generate_id

logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory user store
users_db: dict[str, UserInDB] = {}


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def find_by_email(email: str) -> UserInDB | None:
    """Find a user by email address."""
    for user in users_db.values():
        if user.email == email:
            return user
    return None


def create_user(user_create: UserCreate) -> UserInDB:
    """Create a new user and store it."""
    user_id = generate_id()
    hashed_password = hash_password(user_create.password)
    
    user_in_db = UserInDB(
        id=user_id,
        name=user_create.name,
        email=user_create.email,
        hashed_password=hashed_password,
        role=user_create.role,
    )
    
    users_db[user_id] = user_in_db
    logger.info(f"User created: {user_in_db.email} (ID: {user_id})")
    return user_in_db


def get_by_id(user_id: str) -> UserInDB | None:
    """Get a user by ID."""
    return users_db.get(user_id)
