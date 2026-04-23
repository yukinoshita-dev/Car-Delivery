from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from app.core.database import get_db
from app.models.reservation import Reservation, ReservationStatus
from app.schemas import reservation as reservation_schema
import datetime

router = APIRouter()


def _has_overlap(db: Session, car_id: int, start: datetime.datetime, end: datetime.datetime, exclude_id: Optional[int] = None):
    query = db.query(Reservation).filter(
        Reservation.car_id == car_id,
        Reservation.status.in_([ReservationStatus.pending, ReservationStatus.approved, ReservationStatus.in_progress]),
        Reservation.start_datetime < end,
        Reservation.end_datetime > start,
    )
    if exclude_id:
        query = query.filter(Reservation.id != exclude_id)
    return query.first() is not None


@router.get("/", response_model=List[reservation_schema.ReservationOut])
def list_reservations(
    status: Optional[ReservationStatus] = Query(None),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Reservation)
    if status:
        query = query.filter(Reservation.status == status)
    if user_id:
        query = query.filter(Reservation.user_id == user_id)
    return query.order_by(Reservation.start_datetime.desc()).all()


@router.get("/{reservation_id}", response_model=reservation_schema.ReservationOut)
def get_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation


@router.post("/", response_model=reservation_schema.ReservationOut, status_code=201)
def create_reservation(reservation_in: reservation_schema.ReservationCreate, db: Session = Depends(get_db)):
    if reservation_in.end_datetime <= reservation_in.start_datetime:
        raise HTTPException(status_code=400, detail="end_datetime must be after start_datetime")
    if _has_overlap(db, reservation_in.car_id, reservation_in.start_datetime, reservation_in.end_datetime):
        raise HTTPException(status_code=409, detail="The car is already reserved for this time slot")
    reservation = Reservation(**reservation_in.model_dump())
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


@router.put("/{reservation_id}", response_model=reservation_schema.ReservationOut)
def update_reservation(reservation_id: int, reservation_in: reservation_schema.ReservationUpdate, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    update_data = reservation_in.model_dump(exclude_unset=True)
    start = update_data.get("start_datetime", reservation.start_datetime)
    end = update_data.get("end_datetime", reservation.end_datetime)
    if "start_datetime" in update_data or "end_datetime" in update_data:
        if end <= start:
            raise HTTPException(status_code=400, detail="end_datetime must be after start_datetime")
        if _has_overlap(db, reservation.car_id, start, end, exclude_id=reservation_id):
            raise HTTPException(status_code=409, detail="The car is already reserved for this time slot")
    for field, value in update_data.items():
        setattr(reservation, field, value)
    db.commit()
    db.refresh(reservation)
    return reservation


@router.delete("/{reservation_id}", status_code=204)
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    db.delete(reservation)
    db.commit()
