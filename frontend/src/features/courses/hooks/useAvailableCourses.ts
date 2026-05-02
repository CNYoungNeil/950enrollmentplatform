import { useQuery } from '@tanstack/react-query';
import { courseApi } from '../api/courseApi';

export const AVAILABLE_COURSES_KEY = ['available-courses'] as const;

export function useAvailableCourses() {
  return useQuery({
    queryKey: AVAILABLE_COURSES_KEY,
    queryFn: courseApi.listCourses,
  });
}
