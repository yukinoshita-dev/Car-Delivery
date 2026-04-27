from pydantic import BaseModel
from typing import Optional
from app.models.reservation import ReservationStatus
import datetime


class ReservationCreate(BaseModel):
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
    not_used: Optional[bool] = None
    note: Optional[str] = None
    rejection_reason: Optional[str] = None


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
    not_used: bool = False
    note: Optional[str]
    rejection_reason: Optional[str]
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


class TodayReservationOut(BaseModel):
    id: int
    car_id: int
    car_name: str
    user_id: int
    user_name: str
    user_email: str
    destination: str
    purpose: Optional[str]
    start_datetime: datetime.datetime
    end_datetime: datetime.datetime
    status: ReservationStatus


class ReservationDetail(BaseModel):
    id: int
    user_id: int
    car_id: int
    car_name: str
    car_total_mileage: int
    user_name: str
    user_email: str
    destination: str
    purpose: Optional[str]
    start_datetime: datetime.datetime
    end_datetime: datetime.datetime
    status: ReservationStatus
    mileage_used: float
    not_used: bool = False
    note: Optional[str]
    rejection_reason: Optional[str]
    created_at: datetime.datetime
