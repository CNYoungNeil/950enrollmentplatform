from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.orm import relationship

from ..core.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True)
    course_code = Column(String(50), nullable=False, unique=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    semester = Column(String(50), nullable=True)
    instructor_id = Column(BIGINT(unsigned=True), ForeignKey("users.id"), nullable=False, index=True)
    status = Column(Integer, nullable=False, default=1, server_default="1")
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    instructor = relationship("User", back_populates="instructed_courses", foreign_keys=[instructor_id])
    enrollments = relationship("Enrollment", back_populates="course")
    sections = relationship("CourseSection", back_populates="course")
    discussion_posts = relationship("DiscussionPost", back_populates="course")
