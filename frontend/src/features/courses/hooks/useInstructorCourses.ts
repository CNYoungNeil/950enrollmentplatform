import { useQuery } from '@tanstack/react-query';
import { instructorApi } from '../api/instructorApi';

export const COURSES_QUERY_KEY = ['instructor-courses'] as const;

export function useInstructorCourses() {
  return useQuery({
    queryKey: COURSES_QUERY_KEY,
    queryFn: instructorApi.getMyCourses,
  });
}
