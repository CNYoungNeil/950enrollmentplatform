import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { Course } from '../types';

export const MY_COURSES_KEY = ['my-courses'] as const;

// Hook to fetch courses the current student is already enrolled in.
export function useMyCourses() {
  return useQuery({
    queryKey: MY_COURSES_KEY,
    queryFn: () => apiClient.get<Course[]>('/api/courses/my').then((r) => r.data),
  });
}
