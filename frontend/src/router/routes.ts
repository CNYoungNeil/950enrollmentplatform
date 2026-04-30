export const ROUTES = {
  // Auth
  LOGIN: '/',
  REGISTER: '/register',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Instructor
  INSTRUCTOR_COURSES: '/dashboard/instructor/courses',
  INSTRUCTOR_COURSE_DETAIL: '/dashboard/instructor/courses/:courseId',
} as const;

export const buildRoute = {
  instructorCourseDetail: (courseId: number) =>
    `/dashboard/instructor/courses/${courseId}`,
};
