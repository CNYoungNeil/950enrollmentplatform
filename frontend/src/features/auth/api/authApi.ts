import { apiClient } from '@/api/client';
import type { AuthResponse, LoginParams, RegisterParams } from '../types';

const authApi = {
  login: async (params: LoginParams): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/login', params);
    return response.data;
  },

  register: async (params: RegisterParams): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/register', params);
    return response.data;
  },
};

export { authApi };
