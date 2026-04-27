import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal
from app.models.user import User, UserRole
from app.models.car import Car
from app.models.reservation import Reservation, ReservationStatus
from app.services.auth_service import hash_password
import datetime


def seed():
    db = SessionLocal()
    try:
        db.query(Reservation).delete()
        db.query(Car).delete()
        db.query(User).delete()
        db.commit()

        admin = User(name="管理者デモ", email="admin@demo.com",
                     hashed_password=hash_password("demo"), role=UserRole.admin, is_active=True)
        user = User(name="田中太郎", email="user@demo.com",
                    hashed_password=hash_password("demo"), role=UserRole.user, is_active=True)
        manager = User(name="清算担当デモ", email="manager@demo.com",
                       hashed_password=hash_password("demo"), role=UserRole.manager, is_active=True)
        db.add_all([admin, user, manager])
        db.flush()

        car1 = Car(name="プリウス1号", plate_number="品川300あ1234",
                   model="Toyota Prius", capacity=5, is_available=True, total_mileage=12500)
        car2 = Car(name="ノア2号", plate_number="品川300い5678",
                   model="Toyota Noah", capacity=7, is_available=False, total_mileage=8300)
        db.add_all([car1, car2])
        db.flush()

        today = datetime.date.today()
        now = datetime.datetime.now()

        reservations = [
            Reservation(
                user_id=user.id, car_id=car1.id, destination="新宿区役所", purpose="書類提出",
                start_datetime=datetime.datetime.combine(today, datetime.time(9, 0)),
                end_datetime=datetime.datetime.combine(today, datetime.time(12, 0)),
                status=ReservationStatus.approved,
            ),
            Reservation(
                user_id=admin.id, car_id=car2.id, destination="渋谷商工会議所", purpose="会議",
                start_datetime=datetime.datetime.combine(today, datetime.time(14, 0)),
                end_datetime=datetime.datetime.combine(today, datetime.time(17, 0)),
                status=ReservationStatus.in_progress,
            ),
            Reservation(
                user_id=user.id, car_id=car1.id, destination="横浜市役所", purpose="打ち合わせ",
                start_datetime=now + datetime.timedelta(days=1),
                end_datetime=now + datetime.timedelta(days=1, hours=3),
                status=ReservationStatus.pending,
            ),
            Reservation(
                user_id=user.id, car_id=car2.id, destination="埼玉県庁", purpose="視察",
                start_datetime=now + datetime.timedelta(days=2),
                end_datetime=now + datetime.timedelta(days=2, hours=4),
                status=ReservationStatus.pending,
            ),
            Reservation(
                user_id=user.id, car_id=car1.id, destination="千葉市役所", purpose="資料受け取り",
                start_datetime=now - datetime.timedelta(days=3),
                end_datetime=now - datetime.timedelta(days=3) + datetime.timedelta(hours=2),
                status=ReservationStatus.completed, mileage_used=45.2,
            ),
            Reservation(
                user_id=user.id, car_id=car2.id, destination="さいたま市", purpose="顧客訪問",
                start_datetime=now - datetime.timedelta(days=7),
                end_datetime=now - datetime.timedelta(days=7) + datetime.timedelta(hours=3),
                status=ReservationStatus.completed, mileage_used=62.0,
            ),
        ]
        db.add_all(reservations)
        db.commit()
        print("[OK] Seed data created successfully")
        print(f"   Users : admin@demo.com / user@demo.com / manager@demo.com (password: demo)")
        print(f"   Cars  : {car1.name}, {car2.name}")
        print(f"   Reservations: {len(reservations)} created")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
