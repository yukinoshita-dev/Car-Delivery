from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.car import Car
from app.models.reservation import Reservation, ReservationStatus
from app.schemas import car as car_schema
import datetime

router = APIRouter()


@router.get("/available", response_model=List[car_schema.CarOut])
def list_available_cars(
    start: datetime.datetime = Query(...),
    end: datetime.datetime = Query(...),
    db: Session = Depends(get_db),
):
    conflicting_car_ids = (
        db.query(Reservation.car_id)
        .filter(
            Reservation.status.in_([
                ReservationStatus.pending,
                ReservationStatus.approved,
                ReservationStatus.in_progress,
            ]),
            Reservation.start_datetime < end,
            Reservation.end_datetime > start,
        )
        .subquery()
    )
    return (
        db.query(Car)
        .filter(Car.id.notin_(conflicting_car_ids))
        .all()
    )


@router.get("/", response_model=List[car_schema.CarOut])
def list_cars(db: Session = Depends(get_db)):
    return db.query(Car).all()


@router.get("/{car_id}", response_model=car_schema.CarOut)
def get_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car


@router.post("/", response_model=car_schema.CarOut, status_code=201)
def create_car(car_in: car_schema.CarCreate, db: Session = Depends(get_db)):
    existing = db.query(Car).filter(Car.plate_number == car_in.plate_number).first()
    if existing:
        raise HTTPException(status_code=409, detail="このナンバーは既に登録されています")
    car = Car(**car_in.model_dump())
    db.add(car)
    db.commit()
    db.refresh(car)
    return car


@router.put("/{car_id}", response_model=car_schema.CarOut)
def update_car(car_id: int, car_in: car_schema.CarUpdate, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    for field, value in car_in.model_dump(exclude_unset=True).items():
        setattr(car, field, value)
    db.commit()
    db.refresh(car)
    return car


@router.delete("/{car_id}", status_code=204)
def delete_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    db.delete(car)
    db.commit()
