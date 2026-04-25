import os

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from ..core.config import settings
from ..model import CourseSection, CourseSectionFile
from ..repository.course_repository import CourseRepository, EnrollmentRepository
from ..repository.section_repository import SectionRepository
from ..schema.section_schema import SectionCreateReq, SectionUpdateReq
from ..utils.file_util import save_upload

# section_type values that are "materials" (not assignments)
_MATERIAL_TYPES = [1, 2, 3, 4]


class MaterialService:
    @staticmethod
    def _file_to_dict(f: CourseSectionFile) -> dict:
        return {
            "id": int(f.id),
            "section_id": int(f.section_id),
            "file_name": f.file_name,
            "file_url": f.file_url,
            "file_type": f.file_type,
            "display_order": f.display_order,
            "created_at": f.created_at.isoformat(sep=" ") if f.created_at else None,
        }

    @staticmethod
    def _section_to_dict(section: CourseSection) -> dict:
        return {
            "id": int(section.id),
            "course_id": int(section.course_id),
            "title": section.title,
            "section_type": section.section_type,
            "description_text": section.description_text,
            "due_at": section.due_at.isoformat(sep=" ") if section.due_at else None,
            "display_order": section.display_order,
            "is_published": section.is_published,
            "files": [MaterialService._file_to_dict(f) for f in section.files],
            "created_at": section.created_at.isoformat(sep=" ") if section.created_at else None,
            "updated_at": section.updated_at.isoformat(sep=" ") if section.updated_at else None,
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
    def list_sections(db: Session, course_id: int, user_id: int, role: int) -> list[dict]:
        course = CourseRepository.get_by_id(db, course_id)
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

        if role == 2:  # instructor: must own the course
            if int(course.instructor_id) != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this course"
                )
            sections = SectionRepository.get_by_course_types(db, course_id, _MATERIAL_TYPES)
        else:  # student: must be enrolled, only published sections
            enrollment = EnrollmentRepository.get_by_course_student(db, course_id, user_id)
            if enrollment is None or enrollment.status != 1:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You are not enrolled in this course",
                )
            sections = [
                s
                for s in SectionRepository.get_by_course_types(db, course_id, _MATERIAL_TYPES)
                if s.is_published == 1
            ]

        return [MaterialService._section_to_dict(s) for s in sections]

    @staticmethod
    def create_section(
        db: Session, course_id: int, instructor_id: int, req: SectionCreateReq
    ) -> dict:
        MaterialService._assert_instructor_owns_course(db, course_id, instructor_id)
        if req.section_type not in _MATERIAL_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="section_type must be 1–4 for material sections",
            )
        section = SectionRepository.create(
            db,
            course_id=course_id,
            creator_id=instructor_id,
            title=req.title,
            section_type=req.section_type,
            description_text=req.description_text,
            display_order=req.display_order,
            is_published=req.is_published,
        )
        return MaterialService._section_to_dict(section)

    @staticmethod
    def update_section(
        db: Session, section_id: int, instructor_id: int, req: SectionUpdateReq
    ) -> dict:
        section = SectionRepository.get_by_id(db, section_id)
        if section is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
        MaterialService._assert_instructor_owns_course(db, int(section.course_id), instructor_id)
        updates = req.model_dump(exclude_none=True)
        section = SectionRepository.update(db, section, **updates)
        return MaterialService._section_to_dict(section)

    @staticmethod
    def upload_file(
        db: Session, section_id: int, instructor_id: int, upload: UploadFile
    ) -> dict:
        section = SectionRepository.get_by_id(db, section_id)
        if section is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
        MaterialService._assert_instructor_owns_course(db, int(section.course_id), instructor_id)

        dest_dir = os.path.join(settings.UPLOAD_DIR, "materials", str(section_id))
        file_url, file_type = save_upload(upload, dest_dir)
        display_order = len(section.files)

        file_record = SectionRepository.add_file(
            db,
            section_id=section_id,
            file_name=upload.filename or "unnamed",
            file_url=file_url,
            file_type=file_type,
            display_order=display_order,
        )
        return MaterialService._file_to_dict(file_record)
