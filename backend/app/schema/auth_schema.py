from typing import Any

from pydantic import BaseModel

class AuthResp(BaseModel):
    token: str
    user: dict[str, Any]
