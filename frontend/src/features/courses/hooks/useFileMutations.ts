import { useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorApi } from '../api/instructorApi';
import { COURSE_SECTIONS_QUERY_KEY } from './useCourseDetail';
import type { UpdateSectionFileParams } from '../types';

export function useUploadSectionFile(courseId: number, sectionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => instructorApi.uploadSectionFile(courseId, sectionId, file),
    onSuccess: () => {
      // Files are embedded in section response — re-fetch sections to refresh the list.
      queryClient.invalidateQueries({ queryKey: COURSE_SECTIONS_QUERY_KEY(courseId) });
    },
  });
}

export function useDeleteSectionFile(courseId: number, sectionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: number) => instructorApi.deleteSectionFile(courseId, sectionId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_SECTIONS_QUERY_KEY(courseId) });
    },
  });
}

export function useUpdateSectionFile(courseId: number, sectionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, params }: { fileId: number; params: UpdateSectionFileParams }) =>
      instructorApi.updateSectionFile(courseId, sectionId, fileId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_SECTIONS_QUERY_KEY(courseId) });
    },
  });
}
