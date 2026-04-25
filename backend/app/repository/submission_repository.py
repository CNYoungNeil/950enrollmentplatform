from sqlalchemy import select
from sqlalchemy.orm import Session

from ..model import SectionSubmission


class SubmissionRepository:
    @staticmethod
    def get_by_id(db: Session, submission_id: int) -> SectionSubmission | None:
        return db.execute(
            select(SectionSubmission).where(SectionSubmission.id == submission_id)
        ).scalar_one_or_none()

    @staticmethod
    def get_by_section_student(
        db: Session, section_id: int, student_id: int
    ) -> SectionSubmission | None:
        return db.execute(
            select(SectionSubmission).where(
                SectionSubmission.section_id == section_id,
                SectionSubmission.student_id == student_id,
            )
        ).scalar_one_or_none()

    @staticmethod
    def get_by_section(db: Session, section_id: int) -> list[SectionSubmission]:
        return list(
            db.execute(
                select(SectionSubmission).where(SectionSubmission.section_id == section_id)
            ).scalars().all()
        )

    @staticmethod
    def create(
        db: Session,
        *,
        section_id: int,
        student_id: int,
        file_name: str,
        file_url: str,
        status: int = 1,
    ) -> SectionSubmission:
        sub = SectionSubmission(
            section_id=section_id,
            student_id=student_id,
            file_name=file_name,
            file_url=file_url,
            status=status,
        )
        db.add(sub)
        db.commit()
        db.refresh(sub)
        return sub

    @staticmethod
    def update(db: Session, submission: SectionSubmission, **kwargs) -> SectionSubmission:
        for key, value in kwargs.items():
            setattr(submission, key, value)
        db.commit()
        db.refresh(submission)
        return submission
