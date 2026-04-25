from pydantic import BaseModel


class GradeReq(BaseModel):
    score: float
    feedback: str | None = None
