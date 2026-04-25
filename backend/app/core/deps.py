from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ..utils.token_util import TokenUtil

bearer = HTTPBearer()


@dataclass
class CurrentUser:
    user_id: int
    role: int
    email: str


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
) -> CurrentUser:
    try:
        payload = TokenUtil.decode_token(credentials.credentials)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    return CurrentUser(
        user_id=int(payload["user_id"]),
        role=int(payload["role"]),
        email=str(payload["email"]),
    )


def require_instructor(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if user.role != 2:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Instructor access required",
        )
    return user


def require_student(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if user.role != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required",
        )
    return user
