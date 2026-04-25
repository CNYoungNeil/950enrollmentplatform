from pydantic import BaseModel


class CourseCreateReq(BaseModel):
    course_code: str
    title: str
    description: str | None = None
    semester: str | None = None


class CourseUpdateReq(BaseModel):
    title: str | None = None
    description: str | None = None
    semester: str | None = None
    # 1=draft, 2=published, 3=archived
    status: int | None = None
