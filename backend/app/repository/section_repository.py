from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..model import CourseSection, CourseSectionFile


class SectionRepository:
    @staticmethod
    def get_by_id(db: Session, section_id: int) -> CourseSection | None:
        return db.execute(
            select(CourseSection).where(CourseSection.id == section_id)
        ).scalar_one_or_none()

    @staticmethod
    def get_by_course(
        db: Session, course_id: int, section_type: int | None = None
    ) -> list[CourseSection]:
        q = select(CourseSection).where(CourseSection.course_id == course_id)
        if section_type is not None:
            q = q.where(CourseSection.section_type == section_type)
        q = q.order_by(CourseSection.display_order)
        return list(db.execute(q).scalars().all())

    @staticmethod
    def get_by_course_types(
        db: Session, course_id: int, types: list[int]
    ) -> list[CourseSection]:
        q = (
            select(CourseSection)
            .where(CourseSection.course_id == course_id, CourseSection.section_type.in_(types))
            .order_by(CourseSection.display_order)
        )
        return list(db.execute(q).scalars().all())

    @staticmethod
    def create(
        db: Session,
        *,
        course_id: int,
        creator_id: int,
        title: str,
        section_type: int,
        description_text: str | None = None,
        due_at: datetime | None = None,
        display_order: int = 0,
        is_published: int = 1,
    ) -> CourseSection:
        section = CourseSection(
            course_id=course_id,
            creator_id=creator_id,
            title=title,
            section_type=section_type,
            description_text=description_text,
            due_at=due_at,
            display_order=display_order,
            is_published=is_published,
        )
        db.add(section)
        db.commit()
        db.refresh(section)
        return section

    @staticmethod
    def update(db: Session, section: CourseSection, **kwargs) -> CourseSection:
        for key, value in kwargs.items():
            setattr(section, key, value)
        db.commit()
        db.refresh(section)
        return section

    @staticmethod
    def delete(db: Session, section: CourseSection) -> None:
        db.delete(section)
        db.commit()

    @staticmethod
    def add_file(
        db: Session,
        *,
        section_id: int,
        file_name: str,
        file_url: str,
        file_type: int,
        display_order: int = 0,
    ) -> CourseSectionFile:
        f = CourseSectionFile(
            section_id=section_id,
            file_name=file_name,
            file_url=file_url,
            file_type=file_type,
            display_order=display_order,
        )
        db.add(f)
        db.commit()
        db.refresh(f)
        return f

    @staticmethod
    def get_file_by_id(db: Session, file_id: int) -> CourseSectionFile | None:
        return db.execute(
            select(CourseSectionFile).where(CourseSectionFile.id == file_id)
        ).scalar_one_or_none()

    @staticmethod
    def update_file(db: Session, file: CourseSectionFile, **kwargs) -> CourseSectionFile:
        for key, value in kwargs.items():
            setattr(file, key, value)
        db.commit()
        db.refresh(file)
        return file

    @staticmethod
    def delete_file(db: Session, file: CourseSectionFile) -> None:
        db.delete(file)
        db.commit()
