"""
Neon DB に清算担当デモユーザーを追加するスクリプト。
既に存在する場合はスキップ。
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal
from app.models.user import User, UserRole
from app.models.car import Car          # noqa: F401 (relationship解決のため)
from app.models.reservation import Reservation  # noqa: F401
from app.services.auth_service import hash_password

def main():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "manager@demo.com").first()
        if existing:
            print("[SKIP] manager@demo.com は既に存在します")
            return
        manager = User(
            name="清算担当デモ",
            email="manager@demo.com",
            hashed_password=hash_password("demo"),
            role=UserRole.manager,
            is_active=True,
        )
        db.add(manager)
        db.commit()
        print("[OK] manager@demo.com を追加しました（パスワード: demo）")
    finally:
        db.close()

if __name__ == "__main__":
    main()
