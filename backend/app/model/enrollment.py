from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.orm import relationship

from ..core.database import Base


class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (UniqueConstraint("course_id", "student_id", name="uk_enrollments_course_student"),)

    id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True)
    course_id = Column(BIGINT(unsigned=True), ForeignKey("courses.id"), nullable=False, index=True)
    student_id = Column(BIGINT(unsigned=True), ForeignKey("users.id"), nullable=False, index=True)
    status = Column(Integer, nullable=False, default=1, server_default="1")
    enrolled_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    course = relationship("Course", back_populates="enrollments")
    student = relationship("User", back_populates="enrollments", foreign_keys=[student_id])
