import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Typography } from 'antd';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardDispatcher from '@/layouts/DashboardDispatcher';
import CoursesPage from '@/pages/instructor/CoursesPage';
import CourseConfigPage from '@/pages/instructor/CourseConfigPage';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ROUTES } from './routes';

const DashboardIndex: React.FC = () => {
  const { isInstructor } = useCurrentUser();
  if (isInstructor) {
    return <Navigate to={ROUTES.INSTRUCTOR_COURSES} replace />;
  }
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Typography.Text type="secondary">Student dashboard coming soon...</Typography.Text>
    </div>
  );
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
    ],
  },
]);

export { router };
