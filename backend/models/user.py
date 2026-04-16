from pydantic import BaseModel, EmailStr, Field
from typing import Literal


Role = Literal["lawyer", "client", "employee"]


class UserCreate(BaseModel):
    """Schema for user creation (signup)."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: Role


class UserOut(BaseModel):
    """Schema for user output (public data)."""
    id: str
    name: str
    email: str
    role: Role


class UserInDB(BaseModel):
    """Schema for user stored in database."""
    id: str
    name: str
    email: str
    hashed_password: str
    role: Role
