from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..core.deps import CurrentUser, get_current_user, require_instructor, require_student
from ..schema.section_schema import AssignmentCreateReq, AssignmentUpdateReq
from ..schema.submission_schema import GradeReq
from ..service.assignment_service import AssignmentService

router = APIRouter(prefix="/api/courses/{course_id}/assignments", tags=["assignments"])


@router.get("")
def list_assignments(
    course_id: int,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all assignment sections for a course."""
    return AssignmentService.list_assignments(db, course_id)


@router.post("")
def create_assignment(
    course_id: int,
    req: AssignmentCreateReq,
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: create an assignment with a deadline."""
    return AssignmentService.create_assignment(db, course_id, user.user_id, req)


@router.get("/{section_id}")
def get_assignment(
    course_id: int,
    section_id: int,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get assignment detail."""
    return AssignmentService.get_assignment(db, section_id)


@router.put("/{section_id}")
def update_assignment(
    course_id: int,
    section_id: int,
    req: AssignmentUpdateReq,
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: update assignment info or deadline."""
    return AssignmentService.update_assignment(db, section_id, user.user_id, req)


@router.post("/{section_id}/submit")
def submit_assignment(
    course_id: int,
    section_id: int,
    file: UploadFile = File(...),
    user: CurrentUser = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    Student: submit (or resubmit before grading) an assignment file.
    Submissions past the deadline are marked as late automatically.
    """
    return AssignmentService.submit_assignment(db, section_id, user.user_id, file)


@router.get("/{section_id}/my-submission")
def my_submission(
    course_id: int,
    section_id: int,
    user: CurrentUser = Depends(require_student),
    db: Session = Depends(get_db),
):
    """Student: view their own submission status and grade."""
    return AssignmentService.get_my_submission(db, section_id, user.user_id)


@router.get("/{section_id}/submissions")
def list_submissions(
    course_id: int,
    section_id: int,
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: list all student submissions for an assignment."""
    return AssignmentService.list_submissions(db, section_id, user.user_id)


@router.put("/{section_id}/submissions/{submission_id}/grade")
def grade_submission(
    course_id: int,
    section_id: int,
    submission_id: int,
    req: GradeReq,
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: assign score and feedback to a submission."""
    return AssignmentService.grade_submission(db, submission_id, user.user_id, req)
