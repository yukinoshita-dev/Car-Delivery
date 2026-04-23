from fastapi import APIRouter
from app.api.v1.endpoints import cars, reservations, users, auth, dashboard

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(cars.router, prefix="/cars", tags=["cars"])
api_router.include_router(reservations.router, prefix="/reservations", tags=["reservations"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
