import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardDispatcher from '@/layouts/DashboardDispatcher';
import CoursesPage from '@/pages/instructor/CoursesPage';
import CourseConfigPage from '@/pages/instructor/CourseConfigPage';
import CourseCatalogPage from '@/pages/student/CourseCatalogPage';
import EnrolledCoursesPage from '@/pages/student/EnrolledCoursesPage';
import StudentDashboardHome from '@/pages/student/StudentDashboardHome';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ROUTES } from './routes';

const DashboardIndex: React.FC = () => {
  const { isInstructor } = useCurrentUser();
  if (isInstructor) {
    return <Navigate to={ROUTES.INSTRUCTOR_COURSES} replace />;
  }
  return <StudentDashboardHome />;
};

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardDispatcher />,
    children: [
      { index: true, element: <DashboardIndex /> },
      { path: 'instructor/courses', element: <CoursesPage /> },
      { path: 'instructor/courses/:courseId', element: <CourseConfigPage /> },
      { path: 'student/catalog', element: <CourseCatalogPage /> },
      { path: 'student/courses', element: <EnrolledCoursesPage /> },
    ],
  },
]);

export { router };
