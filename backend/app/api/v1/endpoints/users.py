from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.schemas import user as user_schema
from app.services.auth_service import hash_password
from typing import Optional

router = APIRouter()


@router.get("/", response_model=List[user_schema.UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.get("/{user_id}", response_model=user_schema.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=user_schema.UserOut, status_code=201)
def create_user(user_in: user_schema.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="このメールアドレスは既に登録されています")
    user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        role=user_in.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/{user_id}", response_model=user_schema.UserOut)
def update_user(user_id: int, user_in: user_schema.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    update_data = user_in.model_dump(exclude_unset=True)
    if "password" in update_data:
        user.hashed_password = hash_password(update_data.pop("password"))
    for field, value in update_data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user
