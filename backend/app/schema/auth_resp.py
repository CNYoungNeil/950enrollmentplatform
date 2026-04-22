from typing import Any

from pydantic import BaseModel


class AuthResp(BaseModel):
    token: str | None = None
    user: dict[str, Any] | None = None
    msg: str | None = None
