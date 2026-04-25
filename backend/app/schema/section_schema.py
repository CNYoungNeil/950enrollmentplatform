from datetime import datetime

from pydantic import BaseModel


class SectionCreateReq(BaseModel):
    title: str
    # 1=materials, 2=announcement, 3=article, 4=lecture_presentation
    section_type: int
    description_text: str | None = None
    display_order: int = 0
    # 1=published, 2=hidden
    is_published: int = 1


class SectionUpdateReq(BaseModel):
    title: str | None = None
    description_text: str | None = None
    display_order: int | None = None
    is_published: int | None = None


class AssignmentCreateReq(BaseModel):
    title: str
    description_text: str | None = None
    due_at: datetime | None = None
    display_order: int = 0
    is_published: int = 1


class AssignmentUpdateReq(BaseModel):
    title: str | None = None
    description_text: str | None = None
    due_at: datetime | None = None
    display_order: int | None = None
    is_published: int | None = None
