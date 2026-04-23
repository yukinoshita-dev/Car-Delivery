from pydantic import BaseModel
from typing import Optional
import datetime


class CarBase(BaseModel):
    name: str
    plate_number: str
    model: Optional[str] = None
    capacity: int = 5


class CarCreate(CarBase):
    pass


class CarUpdate(BaseModel):
    name: Optional[str] = None
    model: Optional[str] = None
    capacity: Optional[int] = None
    is_available: Optional[bool] = None
    total_mileage: Optional[int] = None


class CarOut(CarBase):
    id: int
    is_available: bool
    total_mileage: int
    created_at: datetime.datetime

    model_config = {"from_attributes": True}
