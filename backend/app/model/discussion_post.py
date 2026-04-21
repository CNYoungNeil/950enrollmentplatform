from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.orm import relationship

from ..core.database import Base


class DiscussionPost(Base):
    __tablename__ = "discussion_posts"

    id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True)
    course_id = Column(BIGINT(unsigned=True), ForeignKey("courses.id"), nullable=False, index=True)
    author_id = Column(BIGINT(unsigned=True), ForeignKey("users.id"), nullable=False, index=True)
    parent_id = Column(BIGINT(unsigned=True), ForeignKey("discussion_posts.id"), nullable=True, index=True)
    title = Column(String(200), nullable=True)
    content = Column(Text, nullable=False)
    status = Column(Integer, nullable=False, default=1, server_default="1")
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    course = relationship("Course", back_populates="discussion_posts")
    author = relationship("User", back_populates="discussion_posts", foreign_keys=[author_id])
    parent = relationship("DiscussionPost", remote_side=[id], back_populates="children")
    children = relationship("DiscussionPost", back_populates="parent")
