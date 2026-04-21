from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.orm import relationship

from ..core.database import Base


class SectionSubmission(Base):
    __tablename__ = "section_submissions"

    id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True)
    section_id = Column(BIGINT(unsigned=True), ForeignKey("course_sections.id"), nullable=False, index=True)
    student_id = Column(BIGINT(unsigned=True), ForeignKey("users.id"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    status = Column(Integer, nullable=False, default=1, server_default="1")
    submitted_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    score = Column(Numeric(5, 2), nullable=True)
    feedback = Column(Text, nullable=True)
    graded_by = Column(BIGINT(unsigned=True), ForeignKey("users.id"), nullable=True, index=True)
    graded_at = Column(DateTime, nullable=True)
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    section = relationship("CourseSection", back_populates="submissions")
    student = relationship("User", back_populates="submissions", foreign_keys=[student_id])
    grader = relationship("User", back_populates="graded_submissions", foreign_keys=[graded_by])
