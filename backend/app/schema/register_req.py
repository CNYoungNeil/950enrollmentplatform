from pydantic import BaseModel


class RegisterReq(BaseModel):
    name: str
    email: str
    password: str
    role: int
