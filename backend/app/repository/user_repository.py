from sqlalchemy import select
from sqlalchemy.orm import Session

from ..model import User


class UserRepository:
    @staticmethod
    def get_by_email(db: Session, email: str) -> User | None:
        # 根据邮箱查询单个用户。
        return db.execute(select(User).where(User.email == email)).scalar_one_or_none()

    @staticmethod
    def create(
        db: Session,
        *,
        name: str,
        email: str,
        password_hash: str,
        role: int,
        status: int = 1,
    ) -> User:
        # 创建用户并立即刷新，确保能拿到数据库生成的主键和时间字段。
        user = User(
            name=name,
            email=email,
            password_hash=password_hash,
            role=role,
            status=status,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
