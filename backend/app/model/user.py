from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.orm import relationship

from ..core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Integer, nullable=False)
    status = Column(Integer, nullable=False, default=1, server_default="1")
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    instructed_courses = relationship("Course", back_populates="instructor", foreign_keys="Course.instructor_id")
    enrollments = relationship("Enrollment", back_populates="student", foreign_keys="Enrollment.student_id")
    created_sections = relationship("CourseSection", back_populates="creator", foreign_keys="CourseSection.creator_id")
    discussion_posts = relationship("DiscussionPost", back_populates="author", foreign_keys="DiscussionPost.author_id")
    submissions = relationship("SectionSubmission", back_populates="student", foreign_keys="SectionSubmission.student_id")
    graded_submissions = relationship(
        "SectionSubmission",
        back_populates="grader",
        foreign_keys="SectionSubmission.graded_by",
    )
