import type { User, UserRole } from '@/types/user';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
