from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime
import enum


class ReservationStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=False)
    destination = Column(String, nullable=False)
    purpose = Column(String)
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    status = Column(Enum(ReservationStatus), default=ReservationStatus.pending)
    mileage_used = Column(Float, default=0.0)
    note = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reservations")
    car = relationship("Car", back_populates="reservations")
