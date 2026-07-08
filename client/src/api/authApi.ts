import { fetcher } from '@/api/apiClient';

export const authApi = {
  getCurrentUser: () => fetcher('/api/v1/auth/current-user'),
  logout: () => fetcher('/api/v1/auth/logout'),
};
