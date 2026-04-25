from .assignment_api import router as assignment_router
from .auth_api import router as auth_router
from .course_api import router as course_router
from .material_api import router as material_router

__all__ = ["auth_router", "course_router", "material_router", "assignment_router"]
