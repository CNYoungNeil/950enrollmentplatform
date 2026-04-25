from .auth_schema import AuthResp
from .course_schema import CourseCreateReq, CourseUpdateReq
from .login_req import LoginReq
from .register_req import RegisterReq
from .section_schema import AssignmentCreateReq, AssignmentUpdateReq, SectionCreateReq, SectionUpdateReq
from .submission_schema import GradeReq

__all__ = [
    "AuthResp",
    "LoginReq",
    "RegisterReq",
    "CourseCreateReq",
    "CourseUpdateReq",
    "SectionCreateReq",
    "SectionUpdateReq",
    "AssignmentCreateReq",
    "AssignmentUpdateReq",
    "GradeReq",
]
