import os
from datetime import datetime, timezone

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from ..core.config import settings
from ..model import CourseSection, SectionSubmission
from ..repository.course_repository import CourseRepository, EnrollmentRepository
from ..repository.section_repository import SectionRepository
from ..repository.submission_repository import SubmissionRepository
from ..schema.section_schema import AssignmentCreateReq, AssignmentUpdateReq
from ..schema.submission_schema import GradeReq
from ..utils.file_util import save_upload


class AssignmentService:
    @staticmethod
    def _assignment_to_dict(section: CourseSection) -> dict:
        return {
            "id": int(section.id),
            "course_id": int(section.course_id),
            "title": section.title,
            "section_type": section.section_type,
            "description_text": section.description_text,
            "due_at": section.due_at.isoformat(sep=" ") if section.due_at else None,
            "display_order": section.display_order,
            "is_published": section.is_published,
            "created_at": section.created_at.isoformat(sep=" ") if section.created_at else None,
            "updated_at": section.updated_at.isoformat(sep=" ") if section.updated_at else None,
        }

    @staticmethod
    def _submission_to_dict(sub: SectionSubmission) -> dict:
        return {
            "id": int(sub.id),
            "section_id": int(sub.section_id),
            "student_id": int(sub.student_id),
            "student_name": sub.student.name if sub.student else None,
            "file_name": sub.file_name,
            "file_url": sub.file_url,
            "status": sub.status,
            "submitted_at": sub.submitted_at.isoformat(sep=" ") if sub.submitted_at else None,
            "score": float(sub.score) if sub.score is not None else None,
            "feedback": sub.feedback,
            "graded_by": int(sub.graded_by) if sub.graded_by else None,
            "graded_at": sub.graded_at.isoformat(sep=" ") if sub.graded_at else None,
            "updated_at": sub.updated_at.isoformat(sep=" ") if sub.updated_at else None,
        }

    @staticmethod
    def _assert_instructor_owns_course(db: Session, course_id: int, instructor_id: int):
        course = CourseRepository.get_by_id(db, course_id)
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        if int(course.instructor_id) != instructor_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this course"
            )

    @staticmethod
    def _get_assignment_or_404(db: Session, section_id: int) -> CourseSection:
        section = SectionRepository.get_by_id(db, section_id)
        if section is None or section.section_type != 5:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found"
            )
        return section

    # ── Instructor: create / update / list assignments ──────────────────────

    @staticmethod
    def list_assignments(db: Session, course_id: int) -> list[dict]:
        if CourseRepository.get_by_id(db, course_id) is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        sections = SectionRepository.get_by_course(db, course_id, section_type=5)
        return [AssignmentService._assignment_to_dict(s) for s in sections]

    @staticmethod
    def get_assignment(db: Session, section_id: int) -> dict:
        section = AssignmentService._get_assignment_or_404(db, section_id)
        return AssignmentService._assignment_to_dict(section)

    @staticmethod
    def create_assignment(
        db: Session, course_id: int, instructor_id: int, req: AssignmentCreateReq
    ) -> dict:
        AssignmentService._assert_instructor_owns_course(db, course_id, instructor_id)
        section = SectionRepository.create(
            db,
            course_id=course_id,
            creator_id=instructor_id,
            title=req.title,
            section_type=5,
            description_text=req.description_text,
            due_at=req.due_at,
            display_order=req.display_order,
            is_published=req.is_published,
        )
        return AssignmentService._assignment_to_dict(section)

    @staticmethod
    def update_assignment(
        db: Session, section_id: int, instructor_id: int, req: AssignmentUpdateReq
    ) -> dict:
        section = AssignmentService._get_assignment_or_404(db, section_id)
        AssignmentService._assert_instructor_owns_course(db, int(section.course_id), instructor_id)
        updates = req.model_dump(exclude_none=True)
        section = SectionRepository.update(db, section, **updates)
        return AssignmentService._assignment_to_dict(section)

    @staticmethod
    def delete_assignment(db: Session, section_id: int, instructor_id: int) -> None:
        section = AssignmentService._get_assignment_or_404(db, section_id)
        AssignmentService._assert_instructor_owns_course(db, int(section.course_id), instructor_id)
        SectionRepository.delete(db, section)

    # ── Instructor: view & grade submissions ────────────────────────────────

    @staticmethod
    def list_submissions(db: Session, section_id: int, instructor_id: int) -> list[dict]:
        section = AssignmentService._get_assignment_or_404(db, section_id)
        AssignmentService._assert_instructor_owns_course(db, int(section.course_id), instructor_id)
        submissions = SubmissionRepository.get_by_section(db, section_id)
        return [AssignmentService._submission_to_dict(s) for s in submissions]

    @staticmethod
    def grade_submission(
        db: Session, submission_id: int, instructor_id: int, req: GradeReq
    ) -> dict:
        sub = SubmissionRepository.get_by_id(db, submission_id)
        if sub is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found"
            )
        section = SectionRepository.get_by_id(db, int(sub.section_id))
        if section is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
        AssignmentService._assert_instructor_owns_course(db, int(section.course_id), instructor_id)
        sub = SubmissionRepository.update(
            db,
            sub,
            score=req.score,
            feedback=req.feedback,
            status=3,  # graded
            graded_by=instructor_id,
            graded_at=datetime.now(timezone.utc),
        )
        return AssignmentService._submission_to_dict(sub)

    # ── Student: submit / resubmit / view own submission ───────────────────

    @staticmethod
    def submit_assignment(
        db: Session, section_id: int, student_id: int, upload: UploadFile
    ) -> dict:
        section = AssignmentService._get_assignment_or_404(db, section_id)

        enrollment = EnrollmentRepository.get_by_course_student(
            db, int(section.course_id), student_id
        )
        if enrollment is None or enrollment.status != 1:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not enrolled in this course",
            )

        # Determine status: submitted (1) or late (2)
        now = datetime.now(timezone.utc)
        sub_status = 1
        if section.due_at is not None:
            due = section.due_at.replace(tzinfo=timezone.utc)
            if now > due:
                sub_status = 2  # late

        dest_dir = os.path.join(
            settings.UPLOAD_DIR, "submissions", str(section_id), str(student_id)
        )
        file_url, _ = save_upload(upload, dest_dir)

        existing = SubmissionRepository.get_by_section_student(db, section_id, student_id)
        if existing is None:
            sub = SubmissionRepository.create(
                db,
                section_id=section_id,
                student_id=student_id,
                file_name=upload.filename or "unnamed",
                file_url=file_url,
                status=sub_status,
            )
        else:
            if existing.status in (3, 4):  # graded or returned
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Assignment has already been graded and cannot be resubmitted",
                )
            sub = SubmissionRepository.update(
                db,
                existing,
                file_name=upload.filename or "unnamed",
                file_url=file_url,
                status=sub_status,
            )
        return AssignmentService._submission_to_dict(sub)

    @staticmethod
    def get_my_submission(db: Session, section_id: int, student_id: int) -> dict:
        AssignmentService._get_assignment_or_404(db, section_id)
        sub = SubmissionRepository.get_by_section_student(db, section_id, student_id)
        if sub is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No submission found"
            )
        return AssignmentService._submission_to_dict(sub)
