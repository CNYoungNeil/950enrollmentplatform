from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.orm import relationship

from ..core.database import Base


class CourseSection(Base):
    __tablename__ = "course_sections"

    id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True)
    course_id = Column(BIGINT(unsigned=True), ForeignKey("courses.id"), nullable=False, index=True)
    creator_id = Column(BIGINT(unsigned=True), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    section_type = Column(Integer, nullable=False, index=True)
    description_text = Column(Text, nullable=True)
    due_at = Column(DateTime, nullable=True)
    display_order = Column(Integer, nullable=False, default=0, server_default="0")
    is_published = Column(Integer, nullable=False, default=1, server_default="1")
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    course = relationship("Course", back_populates="sections")
    creator = relationship("User", back_populates="created_sections", foreign_keys=[creator_id])
    files = relationship("CourseSectionFile", back_populates="section")
    submissions = relationship("SectionSubmission", back_populates="section")
