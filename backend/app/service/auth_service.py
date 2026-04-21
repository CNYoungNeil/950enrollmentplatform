import hashlib

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..model import User
from ..repository import UserRepository
from ..schema import LoginReq, RegisterReq
from ..utils import TokenUtil


class AuthService:
    @staticmethod
    def login(db: Session, req: LoginReq) -> dict:
        # 按邮箱查询用户，再校验密码是否匹配。
        user = UserRepository.get_by_email(db, req.email)
        if user is None or user.password_hash != AuthService._hash_password(req.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="email or password incorrect",
            )

        return AuthService._build_auth_response(user)

    @staticmethod
    def register(db: Session, req: RegisterReq) -> dict:
        # 注册前先检查邮箱是否已存在，避免重复注册。
        existing_user = UserRepository.get_by_email(db, req.email)
        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="email has already been registered",
            )

        user = UserRepository.create(
            db,
            name=req.name,
            email=req.email,
            password_hash=AuthService._hash_password(req.password),
            role=req.role,
            status=1,
        )

        return AuthService._build_auth_response(user)

    @staticmethod
    def _build_auth_response(user: User) -> dict:
        # 登录和注册共用同一套认证响应结构。
        token = TokenUtil.generate_token(
            subject=user.email,
            extra_claims={
                "user_id": int(user.id),
                "role": user.role,
                "email": user.email,
            },
        )
        return {
            "token": token,
            "user": {
                "id": int(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "status": user.status,
                "created_at": user.created_at.isoformat(sep=" ") if user.created_at else None,
                "updated_at": user.updated_at.isoformat(sep=" ") if user.updated_at else None,
            },
        }

    @staticmethod
    def _hash_password(password: str) -> str:
        # 当前先用 sha256 做基础处理，后续建议替换为更安全的密码哈希方案。
        return hashlib.sha256(password.encode("utf-8")).hexdigest()
