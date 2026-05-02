import { BookOutlined, SearchOutlined, HomeOutlined } from '@ant-design/icons';
import { USER_ROLES } from '@/types/user';
import type { UserRole } from '@/types/user';
import { ROUTES } from '@/router/routes';

export interface MenuItem {
  key: string;
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

export interface DashboardConfig {
  title: string;
  welcomeDescription: string;
  menuItems: MenuItem[];
}

export const DASHBOARD_CONFIG: Record<UserRole, DashboardConfig> = {
  [USER_ROLES.STUDENT]: {
    title: 'Student Platform',
    welcomeDescription: 'You are currently logged in as a Student.',
    menuItems: [
      {
        key: 'dashboard',
        icon: HomeOutlined,
        label: 'Dashboard',
        path: ROUTES.DASHBOARD,
      },
      {
        key: 'selection',
        icon: SearchOutlined,
        label: 'Enroll Courses',
        path: ROUTES.COURSE_SELECTION,
      },
      {
        key: 'my-courses',
        icon: BookOutlined,
        label: 'My Courses',
        path: ROUTES.STUDENT_COURSES,
      },
    ],
  },
  [USER_ROLES.INSTRUCTOR]: {
    title: 'Instructor Platform',
    welcomeDescription: 'You are currently logged in as an Instructor.',
    menuItems: [
      {
        key: 'dashboard',
        icon: HomeOutlined,
        label: 'Dashboard',
        path: ROUTES.DASHBOARD,
      },
      {
        key: 'courses',
        icon: BookOutlined,
        label: 'My Courses',
        path: ROUTES.INSTRUCTOR_COURSES,
      },
    ],
  },
};
