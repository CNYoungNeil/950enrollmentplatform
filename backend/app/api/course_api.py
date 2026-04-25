from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..core.deps import CurrentUser, get_current_user, require_instructor, require_student
from ..schema.course_schema import CourseCreateReq, CourseUpdateReq
from ..service.course_service import CourseService

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("")
def list_courses(db: Session = Depends(get_db)):
    """Browse all published courses (no auth required)."""
    return CourseService.list_published_courses(db)


@router.get("/my")
def my_courses(
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return courses owned by an instructor, or enrolled courses for a student."""
    return CourseService.get_my_courses(db, user.user_id, user.role)


@router.get("/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db)):
    """Get course detail by id."""
    return CourseService.get_course(db, course_id)


@router.post("")
def create_course(
    req: CourseCreateReq,
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: create a new course (status defaults to draft)."""
    return CourseService.create_course(db, user.user_id, req)


@router.put("/{course_id}")
def update_course(
    course_id: int,
    req: CourseUpdateReq,
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: update course info or publish/archive it."""
    return CourseService.update_course(db, course_id, user.user_id, req)


@router.post("/{course_id}/enroll")
def enroll(
    course_id: int,
    user: CurrentUser = Depends(require_student),
    db: Session = Depends(get_db),
):
    """Student: enroll in a published course."""
    return CourseService.enroll_student(db, course_id, user.user_id)
