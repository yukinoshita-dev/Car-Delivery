from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole
import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.user


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    is_active: bool
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: UserRole = UserRole.user


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: UserRole
    email: str
