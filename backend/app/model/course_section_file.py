from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.orm import relationship

from ..core.database import Base


class CourseSectionFile(Base):
    __tablename__ = "course_section_files"

    id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True)
    section_id = Column(BIGINT(unsigned=True), ForeignKey("course_sections.id"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_type = Column(Integer, nullable=False, default=1, server_default="1")
    display_order = Column(Integer, nullable=False, default=0, server_default="0")
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())

    section = relationship("CourseSection", back_populates="files")
