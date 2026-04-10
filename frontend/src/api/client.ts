import { config } from '@/config';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
});

apiClient.interceptors.request.use((requestConfig) => {
  const raw = localStorage.getItem('auth');
  if (raw) {
    const { token } = JSON.parse(raw) as { token: string };
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

export { apiClient };
