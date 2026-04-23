from pydantic import BaseModel
from typing import Optional
from app.models.reservation import ReservationStatus
import datetime


class ReservationCreate(BaseModel):
    user_id: int
    car_id: int
    destination: str
    purpose: Optional[str] = None
    start_datetime: datetime.datetime
    end_datetime: datetime.datetime
    note: Optional[str] = None


class ReservationUpdate(BaseModel):
    destination: Optional[str] = None
    purpose: Optional[str] = None
    start_datetime: Optional[datetime.datetime] = None
    end_datetime: Optional[datetime.datetime] = None
    status: Optional[ReservationStatus] = None
    mileage_used: Optional[float] = None
    note: Optional[str] = None


class ReservationOut(BaseModel):
    id: int
    user_id: int
    car_id: int
    destination: str
    purpose: Optional[str]
    start_datetime: datetime.datetime
    end_datetime: datetime.datetime
    status: ReservationStatus
    mileage_used: float
    note: Optional[str]
    created_at: datetime.datetime

    model_config = {"from_attributes": True}
