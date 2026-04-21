from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..schema import LoginReq, RegisterReq
from ..service.auth_service import AuthService


router = APIRouter(prefix="/api", tags=["auth"])


@router.post("/login")
def login(req: LoginReq, db: Session = Depends(get_db)):
    # 接收登录请求并交给业务层处理。
    return AuthService.login(db, req)


@router.post("/register")
def register(req: RegisterReq, db: Session = Depends(get_db)):
    # 接收注册请求并交给业务层处理。
    return AuthService.register(db, req)
