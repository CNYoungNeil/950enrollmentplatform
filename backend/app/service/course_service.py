from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..model import Course, Enrollment
from ..repository.course_repository import CourseRepository, EnrollmentRepository
from ..schema.course_schema import CourseCreateReq, CourseUpdateReq


class CourseService:
    @staticmethod
    def _to_dict(course: Course) -> dict:
        return {
            "id": int(course.id),
            "course_code": course.course_code,
            "title": course.title,
            "description": course.description,
            "semester": course.semester,
            "status": course.status,
            "instructor_id": int(course.instructor_id),
            "instructor_name": course.instructor.name if course.instructor else None,
            "created_at": course.created_at.isoformat(sep=" ") if course.created_at else None,
            "updated_at": course.updated_at.isoformat(sep=" ") if course.updated_at else None,
        }

    @staticmethod
    def _enrollment_to_dict(enrollment: Enrollment) -> dict:
        return {
            "id": int(enrollment.id),
            "course_id": int(enrollment.course_id),
            "student_id": int(enrollment.student_id),
            "status": enrollment.status,
            "enrolled_at": enrollment.enrolled_at.isoformat(sep=" ") if enrollment.enrolled_at else None,
        }

    @staticmethod
    def list_published_courses(db: Session) -> list[dict]:
        courses = CourseRepository.get_all_published(db)
        return [CourseService._to_dict(c) for c in courses]

    @staticmethod
    def get_course(db: Session, course_id: int) -> dict:
        course = CourseRepository.get_by_id(db, course_id)
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        return CourseService._to_dict(course)

    @staticmethod
    def get_my_courses(db: Session, user_id: int, role: int) -> list[dict]:
        if role == 2:  # instructor — return courses they own
            courses = CourseRepository.get_by_instructor(db, user_id)
            return [CourseService._to_dict(c) for c in courses]
        # student — return enrolled courses with enrollment metadata
        enrollments = EnrollmentRepository.get_by_student(db, user_id)
        result = []
        for e in enrollments:
            if e.course is None:
                continue
            d = CourseService._to_dict(e.course)
            d["enrollment_status"] = e.status
            d["enrolled_at"] = e.enrolled_at.isoformat(sep=" ") if e.enrolled_at else None
            result.append(d)
        return result

    @staticmethod
    def create_course(db: Session, instructor_id: int, req: CourseCreateReq) -> dict:
        try:
            course = CourseRepository.create(
                db,
                course_code=req.course_code,
                title=req.title,
                description=req.description,
                semester=req.semester,
                instructor_id=instructor_id,
            )
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Course code '{req.course_code}' is already taken",
            )
        return CourseService._to_dict(course)

    @staticmethod
    def update_course(db: Session, course_id: int, instructor_id: int, req: CourseUpdateReq) -> dict:
        course = CourseRepository.get_by_id(db, course_id)
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        if int(course.instructor_id) != instructor_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this course"
            )
        updates = req.model_dump(exclude_none=True)
        course = CourseRepository.update(db, course, **updates)
        return CourseService._to_dict(course)

    @staticmethod
    def enroll_student(db: Session, course_id: int, student_id: int) -> dict:
        course = CourseRepository.get_by_id(db, course_id)
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        if course.status != 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Course is not open for enrollment"
            )
        existing = EnrollmentRepository.get_by_course_student(db, course_id, student_id)
        if existing is not None:
            if existing.status == 1:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT, detail="Already enrolled in this course"
                )
            # re-activate a dropped enrollment
            enrollment = EnrollmentRepository.update_status(db, existing, 1)
        else:
            enrollment = EnrollmentRepository.create(db, course_id=course_id, student_id=student_id)
        return CourseService._enrollment_to_dict(enrollment)
