from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.core.database import get_db
from app.models.reservation import Reservation, ReservationStatus
from app.models.user import User
from app.schemas import reservation as reservation_schema
from app.services.auth_service import get_current_email
import datetime

router = APIRouter()


def _has_overlap(db, car_id, start, end, exclude_id=None):
    query = db.query(Reservation).filter(
        Reservation.car_id == car_id,
        Reservation.status.in_([ReservationStatus.pending, ReservationStatus.approved, ReservationStatus.in_progress]),
        Reservation.start_datetime < end,
        Reservation.end_datetime > start,
    )
    if exclude_id:
        query = query.filter(Reservation.id != exclude_id)
    return query.first() is not None


def _to_detail(r: Reservation) -> reservation_schema.ReservationDetail:
    return reservation_schema.ReservationDetail(
        id=r.id,
        user_id=r.user_id,
        car_id=r.car_id,
        car_name=r.car.name,
        user_name=r.user.name,
        user_email=r.user.email,
        destination=r.destination,
        purpose=r.purpose,
        start_datetime=r.start_datetime,
        end_datetime=r.end_datetime,
        status=r.status,
        mileage_used=r.mileage_used,
        note=r.note,
        created_at=r.created_at,
    )


@router.get("/me", response_model=List[reservation_schema.ReservationDetail])
def get_my_reservations(
    limit: int = Query(5, ge=1, le=50),
    email: str = Depends(get_current_email),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return []
    reservations = (
        db.query(Reservation)
        .options(joinedload(Reservation.car), joinedload(Reservation.user))
        .filter(Reservation.user_id == user.id)
        .order_by(Reservation.created_at.desc())
        .limit(limit)
        .all()
    )
    return [_to_detail(r) for r in reservations]


@router.get("/", response_model=List[reservation_schema.ReservationDetail])
def list_reservations(
    status: Optional[ReservationStatus] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Reservation).options(joinedload(Reservation.car), joinedload(Reservation.user))
    if status:
        query = query.filter(Reservation.status == status)
    reservations = query.order_by(Reservation.start_datetime.desc()).all()
    return [_to_detail(r) for r in reservations]


@router.get("/{reservation_id}", response_model=reservation_schema.ReservationOut)
def get_reservation(reservation_id: int, db: Session = Depends(get_db)):
    r = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return r


@router.post("/", response_model=reservation_schema.ReservationOut, status_code=201)
def create_reservation(
    reservation_in: reservation_schema.ReservationCreate,
    email: str = Depends(get_current_email),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if reservation_in.end_datetime <= reservation_in.start_datetime:
        raise HTTPException(status_code=400, detail="end_datetime must be after start_datetime")
    if _has_overlap(db, reservation_in.car_id, reservation_in.start_datetime, reservation_in.end_datetime):
        raise HTTPException(status_code=409, detail="The car is already reserved for this time slot")
    reservation = Reservation(**reservation_in.model_dump(), user_id=user.id)
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


@router.put("/{reservation_id}", response_model=reservation_schema.ReservationOut)
def update_reservation(reservation_id: int, reservation_in: reservation_schema.ReservationUpdate, db: Session = Depends(get_db)):
    r = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reservation not found")
    update_data = reservation_in.model_dump(exclude_unset=True)
    start = update_data.get("start_datetime", r.start_datetime)
    end = update_data.get("end_datetime", r.end_datetime)
    if "start_datetime" in update_data or "end_datetime" in update_data:
        if end <= start:
            raise HTTPException(status_code=400, detail="end_datetime must be after start_datetime")
        if _has_overlap(db, r.car_id, start, end, exclude_id=reservation_id):
            raise HTTPException(status_code=409, detail="The car is already reserved for this time slot")
    for field, value in update_data.items():
        setattr(r, field, value)
    db.commit()
    db.refresh(r)
    return r


@router.delete("/{reservation_id}", status_code=204)
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    r = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reservation not found")
    db.delete(r)
    db.commit()
