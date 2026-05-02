import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi } from '../api/courseApi';
import { message } from 'antd';

export const MY_SUBMISSION_QUERY_KEY = (courseId: number, assignmentId: number) =>
  ['my-submission', courseId, assignmentId] as const;

/** fetch user's submission for a specific assignment. */
export function useMySubmission(courseId: number, assignmentId: number) {
  return useQuery({
    queryKey: MY_SUBMISSION_QUERY_KEY(courseId, assignmentId),
    queryFn: () => courseApi.getMySubmission(courseId, assignmentId),
    enabled: !!courseId && !!assignmentId,
    retry: false, // Don't retry on 404 (means no submission yet)
  });
}

/** submit or resubmit an assignment file. */
export function useSubmitAssignment(courseId: number, assignmentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => courseApi.submitAssignment(courseId, assignmentId, file),
    onSuccess: () => {
      message.success('Assignment submitted successfully!');
      // Invalidate the query to fetch the updated status
      queryClient.invalidateQueries({
        queryKey: MY_SUBMISSION_QUERY_KEY(courseId, assignmentId),
      });
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.detail || 'Failed to submit assignment.';
      message.error(errorMsg);
    },
  });
}
