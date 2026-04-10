import { createBrowserRouter } from 'react-router-dom';
import { StudentLayout } from '@/layouts/StudentLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Login Page</h1>,
  },
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      {
        path: 'home',
        element: <h1>Home Page</h1>,
      },
    ],
  },
]);

export { router };
