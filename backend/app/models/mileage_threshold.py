from sqlalchemy import Column, Integer, Float
from app.core.database import Base


class MileageThreshold(Base):
    __tablename__ = "mileage_thresholds"

    id = Column(Integer, primary_key=True, index=True)
    km = Column(Float, nullable=False)
    amount = Column(Float, nullable=False)
