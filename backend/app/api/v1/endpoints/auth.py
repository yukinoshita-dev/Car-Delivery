from fastapi import APIRouter
from app.services.auth_service import create_access_token
from app.schemas.user import LoginRequest, LoginResponse

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest):
    token = create_access_token({"sub": body.email, "role": body.role})
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        role=body.role,
        email=body.email,
    )
