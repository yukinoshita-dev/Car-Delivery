from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.reservation import Reservation, ReservationStatus
from app.models.car import Car
import datetime

router = APIRouter()


@router.get("/today")
def get_today_schedule(db: Session = Depends(get_db)):
    today = datetime.date.today()
    start = datetime.datetime.combine(today, datetime.time.min)
    end = datetime.datetime.combine(today, datetime.time.max)

    reservations = (
        db.query(Reservation)
        .filter(
            Reservation.start_datetime <= end,
            Reservation.end_datetime >= start,
            Reservation.status.in_([
                ReservationStatus.approved,
                ReservationStatus.in_progress,
            ]),
        )
        .all()
    )

    return [
        {
            "id": r.id,
            "user_id": r.user_id,
            "car_id": r.car_id,
            "destination": r.destination,
            "purpose": r.purpose,
            "start_datetime": r.start_datetime,
            "end_datetime": r.end_datetime,
            "status": r.status,
        }
        for r in reservations
    ]


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_cars = db.query(Car).count()
    available_cars = db.query(Car).filter(Car.is_available == True).count()

    today = datetime.date.today()
    month_start = today.replace(day=1)
    month_end = (month_start.replace(month=month_start.month % 12 + 1, day=1)
                 if month_start.month < 12
                 else month_start.replace(year=month_start.year + 1, month=1, day=1))

    completed_this_month = db.query(Reservation).filter(
        Reservation.status == ReservationStatus.completed,
        Reservation.start_datetime >= datetime.datetime.combine(month_start, datetime.time.min),
        Reservation.start_datetime < datetime.datetime.combine(month_end, datetime.time.min),
    ).count()

    pending_count = db.query(Reservation).filter(
        Reservation.status == ReservationStatus.pending
    ).count()

    return {
        "total_cars": total_cars,
        "available_cars": available_cars,
        "in_use_cars": total_cars - available_cars,
        "completed_reservations_this_month": completed_this_month,
        "pending_approvals": pending_count,
    }
