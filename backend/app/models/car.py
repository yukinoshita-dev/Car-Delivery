from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    plate_number = Column(String, unique=True, nullable=False)
    model = Column(String)
    capacity = Column(Integer, default=5)
    is_available = Column(Boolean, default=True)
    total_mileage = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    reservations = relationship("Reservation", back_populates="car")
