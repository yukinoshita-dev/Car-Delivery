from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.core.database import get_db
from app.models.reservation import Reservation, ReservationStatus
from app.models.car import Car
from app.schemas.reservation import TodayReservationOut
import datetime
import calendar

router = APIRouter()


@router.get("/today", response_model=List[TodayReservationOut])
def get_today_schedule(db: Session = Depends(get_db)):
    today = datetime.date.today()
    start = datetime.datetime.combine(today, datetime.time.min)
    end = datetime.datetime.combine(today, datetime.time.max)

    reservations = (
        db.query(Reservation)
        .options(joinedload(Reservation.car), joinedload(Reservation.user))
        .filter(
            Reservation.start_datetime <= end,
            Reservation.end_datetime >= start,
            Reservation.status.in_([ReservationStatus.approved, ReservationStatus.in_progress]),
        )
        .all()
    )

    return [
        TodayReservationOut(
            id=r.id,
            car_id=r.car_id,
            car_name=r.car.name,
            user_id=r.user_id,
            user_name=r.user.name,
            user_email=r.user.email,
            destination=r.destination,
            purpose=r.purpose,
            start_datetime=r.start_datetime,
            end_datetime=r.end_datetime,
            status=r.status,
        )
        for r in reservations
    ]


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_cars = db.query(Car).count()
    available_cars = db.query(Car).filter(Car.is_available == True).count()

    today = datetime.date.today()
    month_start = today.replace(day=1)
    month_end = (
        month_start.replace(month=month_start.month % 12 + 1, day=1)
        if month_start.month < 12
        else month_start.replace(year=month_start.year + 1, month=1, day=1)
    )

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


@router.get("/monthly")
def get_monthly_stats(db: Session = Depends(get_db)):
    today = datetime.date.today()
    result = []
    for i in range(5, -1, -1):
        month = today.month - i
        year = today.year
        while month <= 0:
            month += 12
            year -= 1
        _, last_day = calendar.monthrange(year, month)
        start = datetime.datetime(year, month, 1)
        end = datetime.datetime(year, month, last_day, 23, 59, 59)
        count = db.query(Reservation).filter(
            Reservation.start_datetime >= start,
            Reservation.start_datetime <= end,
        ).count()
        result.append({"month": f"{year}/{month:02d}", "count": count})
    return result


@router.get("/weekly-availability")
def get_weekly_availability(db: Session = Depends(get_db)):
    total_cars = db.query(Car).filter(Car.is_available == True).count()
    today = datetime.date.today()
    result = []
    for i in range(7):
        target = today + datetime.timedelta(days=i)
        day_start = datetime.datetime.combine(target, datetime.time.min)
        day_end = datetime.datetime.combine(target, datetime.time.max)
        reserved_count = (
            db.query(Reservation.car_id)
            .filter(
                Reservation.status.in_([
                    ReservationStatus.pending,
                    ReservationStatus.approved,
                    ReservationStatus.in_progress,
                ]),
                Reservation.start_datetime <= day_end,
                Reservation.end_datetime >= day_start,
            )
            .distinct()
            .count()
        )
        result.append({
            "date": target.isoformat(),
            "total_cars": total_cars,
            "reserved_count": reserved_count,
            "available_count": max(0, total_cars - reserved_count),
        })
    return result


@router.get("/car-usage")
def get_car_usage(db: Session = Depends(get_db)):
    cars = db.query(Car).all()
    result = []
    for car in cars:
        count = db.query(Reservation).filter(
            Reservation.car_id == car.id,
            Reservation.status.in_([
                ReservationStatus.approved,
                ReservationStatus.in_progress,
                ReservationStatus.completed,
            ]),
        ).count()
        result.append({"car": car.name, "count": count})
    return sorted(result, key=lambda x: x["count"], reverse=True)
