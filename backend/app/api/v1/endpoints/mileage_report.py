from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.models.reservation import Reservation, ReservationStatus
from app.models.user import User
import datetime
import calendar
import io
import csv

router = APIRouter()


def _calc_allowance(total_km: float, thresholds: List[dict]) -> float:
    """
    thresholds: [{"km": 500, "amount": 3000}, {"km": 1000, "amount": 5000}]
    最大の条件（km以上）に一致した金額を返す。
    """
    result = 0.0
    for t in sorted(thresholds, key=lambda x: x["km"]):
        if total_km >= t["km"]:
            result = t["amount"]
    return result


@router.get("/monthly")
def get_monthly_mileage_report(
    year: int = Query(...),
    month: int = Query(...),
    thresholds: Optional[str] = Query(None, description="手当しきい値 例: 500:3000,1000:5000"),
    db: Session = Depends(get_db),
):
    """
    月間ユーザー別走行距離集計と手当算出。
    thresholds: "走行距離km:金額円,..." の形式（カンマ区切り）
    """
    _, last_day = calendar.monthrange(year, month)
    start = datetime.datetime(year, month, 1)
    end = datetime.datetime(year, month, last_day, 23, 59, 59)

    rows = (
        db.query(
            Reservation.user_id,
            func.sum(Reservation.mileage_used).label("total_km"),
        )
        .filter(
            Reservation.status == ReservationStatus.completed,
            Reservation.not_used == False,
            Reservation.end_datetime >= start,
            Reservation.end_datetime <= end,
        )
        .group_by(Reservation.user_id)
        .all()
    )

    parsed_thresholds: List[dict] = []
    if thresholds:
        for t in thresholds.split(","):
            parts = t.split(":")
            if len(parts) == 2:
                try:
                    parsed_thresholds.append({"km": float(parts[0]), "amount": float(parts[1])})
                except ValueError:
                    pass

    users = {u.id: u for u in db.query(User).all()}

    result = []
    for row in rows:
        user = users.get(row.user_id)
        if not user:
            continue
        total_km = float(row.total_km or 0)
        allowance = _calc_allowance(total_km, parsed_thresholds)
        result.append({
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "total_km": total_km,
            "allowance": allowance,
        })

    result.sort(key=lambda x: x["total_km"], reverse=True)
    return {
        "year": year,
        "month": month,
        "report": result,
    }


@router.get("/monthly/csv")
def download_monthly_mileage_csv(
    year: int = Query(...),
    month: int = Query(...),
    thresholds: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    _, last_day = calendar.monthrange(year, month)
    start = datetime.datetime(year, month, 1)
    end = datetime.datetime(year, month, last_day, 23, 59, 59)

    rows = (
        db.query(
            Reservation.user_id,
            func.sum(Reservation.mileage_used).label("total_km"),
        )
        .filter(
            Reservation.status == ReservationStatus.completed,
            Reservation.not_used == False,
            Reservation.end_datetime >= start,
            Reservation.end_datetime <= end,
        )
        .group_by(Reservation.user_id)
        .all()
    )

    parsed_thresholds: List[dict] = []
    if thresholds:
        for t in thresholds.split(","):
            parts = t.split(":")
            if len(parts) == 2:
                try:
                    parsed_thresholds.append({"km": float(parts[0]), "amount": float(parts[1])})
                except ValueError:
                    pass

    users = {u.id: u for u in db.query(User).all()}

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["名前", "メールアドレス", "走行距離(km)", "手当(円)"])

    for row in sorted(rows, key=lambda x: float(x.total_km or 0), reverse=True):
        user = users.get(row.user_id)
        if not user:
            continue
        total_km = float(row.total_km or 0)
        allowance = _calc_allowance(total_km, parsed_thresholds)
        writer.writerow([user.name, user.email, f"{total_km:.1f}", f"{allowance:.0f}"])

    output.seek(0)
    filename = f"mileage_{year}{month:02d}.csv"
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8-sig")),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
