import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { courseApi } from '../api/courseApi';
import { AVAILABLE_COURSES_KEY } from './useAvailableCourses';

export function useEnrollmentAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => courseApi.enroll(courseId),
    onSuccess: () => {
      message.success('Successfully enrolled in the course!');
      // Invalidate the available courses list to refresh enrollment status
      queryClient.invalidateQueries({ queryKey: AVAILABLE_COURSES_KEY });
      // Invalidate my courses so the student dashboard is updated
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    },
    onError: (error: any) => {
      const detail = error.response?.data?.detail || 'Failed to enroll';
      message.error(detail);
    },
  });
}
