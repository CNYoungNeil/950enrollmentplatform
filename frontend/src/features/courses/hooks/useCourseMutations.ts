import { useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorApi } from '../api/instructorApi';
import { COURSES_QUERY_KEY } from './useInstructorCourses';
import {
  COURSE_DETAIL_QUERY_KEY,
  COURSE_SECTIONS_QUERY_KEY,
  COURSE_ASSIGNMENTS_QUERY_KEY,
  ASSIGNMENT_SUBMISSIONS_QUERY_KEY,
} from './useCourseDetail';
import type {
  CreateCourseParams,
  UpdateCourseParams,
  CreateSectionParams,
  UpdateSectionParams,
  CreateAssignmentParams,
  UpdateAssignmentParams,
  GradeSubmissionParams,
} from '../types';

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateCourseParams) => instructorApi.createCourse(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY });
    },
  });
}

export function useUpdateCourse(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdateCourseParams) =>
      instructorApi.updateCourse(courseId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COURSE_DETAIL_QUERY_KEY(courseId) });
    },
  });
}

export function useCreateSection(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateSectionParams) =>
      instructorApi.createSection(courseId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_SECTIONS_QUERY_KEY(courseId) });
    },
  });
}

export function useUpdateSection(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, params }: { sectionId: number; params: UpdateSectionParams }) =>
      instructorApi.updateSection(courseId, sectionId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_SECTIONS_QUERY_KEY(courseId) });
    },
  });
}

export function useDeleteSection(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: number) => instructorApi.deleteSection(courseId, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_SECTIONS_QUERY_KEY(courseId) });
    },
  });
}

export function useDeleteAssignment(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: number) => instructorApi.deleteAssignment(courseId, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_ASSIGNMENTS_QUERY_KEY(courseId) });
    },
  });
}

export function useCreateAssignment(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateAssignmentParams) =>
      instructorApi.createAssignment(courseId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_ASSIGNMENTS_QUERY_KEY(courseId) });
    },
  });
}

export function useUpdateAssignment(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sectionId,
      params,
    }: {
      sectionId: number;
      params: UpdateAssignmentParams;
    }) => instructorApi.updateAssignment(courseId, sectionId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_ASSIGNMENTS_QUERY_KEY(courseId) });
    },
  });
}

export function useGradeSubmission(sectionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      submissionId,
      params,
    }: {
      courseId: number;
      submissionId: number;
      params: GradeSubmissionParams;
    }) => instructorApi.gradeSubmission(courseId, sectionId, submissionId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_SUBMISSIONS_QUERY_KEY(sectionId) });
    },
  });
}
