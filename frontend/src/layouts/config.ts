import { USER_ROLES } from '@/types/user';
import type { UserRole } from '@/types/user';

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
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
    menuItems: [],
  },
  [USER_ROLES.INSTRUCTOR]: {
    title: 'Instructor Platform',
    welcomeDescription: 'You are currently logged in as an Instructor.',
    menuItems: [],
  },
};
