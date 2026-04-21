export const USER_ROLES = {
  STUDENT: 1,
  INSTRUCTOR: 2,
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: number;
  created_at: string;
  updated_at: string;
}
