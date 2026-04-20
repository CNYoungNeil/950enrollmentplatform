import { useNavigate } from 'react-router-dom';
import type { UserRole } from '@/types/user';
import { ROUTES } from '@/router/routes';

export const useAuthNavigation = () => {
  const navigate = useNavigate();

  const navigateByRole = (_role: UserRole) => {
    navigate(ROUTES.DASHBOARD);
  };

  return { navigateByRole };
};
