from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..core.deps import CurrentUser, get_current_user, require_instructor
from ..schema.section_schema import FileUpdateReq, SectionCreateReq, SectionUpdateReq
from ..service.material_service import MaterialService

router = APIRouter(prefix="/api/courses/{course_id}/sections", tags=["materials"])


@router.get("")
def list_sections(
    course_id: int,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List material sections of a course.
    Instructor sees all sections; student sees only published ones and must be enrolled.
    """
    return MaterialService.list_sections(db, course_id, user.user_id, user.role)


@router.post("")
def create_section(
    course_id: int,
    req: SectionCreateReq,
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: create a new material section (type 1–4)."""
    return MaterialService.create_section(db, course_id, user.user_id, req)


@router.put("/{section_id}")
def update_section(
    course_id: int,
    section_id: int,
    req: SectionUpdateReq,
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: update a material section's metadata."""
    return MaterialService.update_section(db, section_id, user.user_id, req)


@router.delete("/{section_id}")
def delete_section(
    course_id: int,
    section_id: int,
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: delete a material section and all its files."""
    MaterialService.delete_section(db, section_id, user.user_id)
    return {}


@router.post("/{section_id}/files")
def upload_file(
    course_id: int,
    section_id: int,
    file: UploadFile = File(...),
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: upload a file to a material section."""
    return MaterialService.upload_file(db, section_id, user.user_id, file)


@router.put("/{section_id}/files/{file_id}")
def update_file(
    course_id: int,
    section_id: int,
    file_id: int,
    req: FileUpdateReq,
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: update file metadata (e.g. display_order for reordering)."""
    return MaterialService.update_file(db, section_id, file_id, user.user_id, req)


@router.delete("/{section_id}/files/{file_id}")
def delete_file(
    course_id: int,
    section_id: int,
    file_id: int,
    user: CurrentUser = Depends(require_instructor),
    db: Session = Depends(get_db),
):
    """Instructor: delete a file from a material section."""
    MaterialService.delete_file(db, section_id, file_id, user.user_id)
    return {}
