from sqlalchemy import select
from sqlalchemy.orm import Session

from ..model import Course, Enrollment


class CourseRepository:
    @staticmethod
    def get_by_id(db: Session, course_id: int) -> Course | None:
        return db.execute(select(Course).where(Course.id == course_id)).scalar_one_or_none()

    @staticmethod
    def get_all_published(db: Session) -> list[Course]:
        return list(db.execute(select(Course).where(Course.status == 2)).scalars().all())

    @staticmethod
    def get_by_instructor(db: Session, instructor_id: int) -> list[Course]:
        return list(
            db.execute(select(Course).where(Course.instructor_id == instructor_id)).scalars().all()
        )

    @staticmethod
    def create(
        db: Session,
        *,
        course_code: str,
        title: str,
        description: str | None,
        semester: str | None,
        instructor_id: int,
    ) -> Course:
        course = Course(
            course_code=course_code,
            title=title,
            description=description,
            semester=semester,
            instructor_id=instructor_id,
            status=1,  # draft by default
        )
        db.add(course)
        db.commit()
        db.refresh(course)
        return course

    @staticmethod
    def update(db: Session, course: Course, **kwargs) -> Course:
        for key, value in kwargs.items():
            setattr(course, key, value)
        db.commit()
        db.refresh(course)
        return course


class EnrollmentRepository:
    @staticmethod
    def get_by_course_student(db: Session, course_id: int, student_id: int) -> Enrollment | None:
        return db.execute(
            select(Enrollment).where(
                Enrollment.course_id == course_id,
                Enrollment.student_id == student_id,
            )
        ).scalar_one_or_none()

    @staticmethod
    def get_by_student(db: Session, student_id: int) -> list[Enrollment]:
        return list(
            db.execute(select(Enrollment).where(Enrollment.student_id == student_id)).scalars().all()
        )

    @staticmethod
    def create(db: Session, *, course_id: int, student_id: int) -> Enrollment:
        enrollment = Enrollment(course_id=course_id, student_id=student_id, status=1)
        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)
        return enrollment

    @staticmethod
    def update_status(db: Session, enrollment: Enrollment, new_status: int) -> Enrollment:
        enrollment.status = new_status
        db.commit()
        db.refresh(enrollment)
        return enrollment
