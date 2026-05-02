export const ROUTES = {
  // Auth
  LOGIN: '/',
  REGISTER: '/register',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Instructor
  INSTRUCTOR_COURSES: '/dashboard/instructor/courses',
  INSTRUCTOR_COURSE_DETAIL: '/dashboard/instructor/courses/:courseId',

  // Student
  STUDENT_COURSES: '/dashboard/student/courses',
  COURSE_DETAIL: '/dashboard/student/courses/:courseId',

  // Enrollment list
  COURSE_SELECTION: '/dashboard/student/catalog',
} as const;

export const buildRoute = {
  instructorCourseDetail: (courseId: number) => `/dashboard/instructor/courses/${courseId}`,
  studentCourseDetail: (courseId: number) => `/dashboard/student/courses/${courseId}`,
};
