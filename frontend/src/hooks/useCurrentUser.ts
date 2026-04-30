import { useAuthStore } from '@/store/useAuthStore';
import { USER_ROLES } from '@/types/user';

export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  return {
    user,
    isInstructor: user?.role === USER_ROLES.INSTRUCTOR,
    isStudent: user?.role === USER_ROLES.STUDENT,
  };
}
