import { useQuery } from '@tanstack/react-query';
import { courseApi } from '../api/courseApi';
import { instructorApi } from '../api/instructorApi';

export const COURSE_DETAIL_QUERY_KEY = (courseId: number) =>
  ['course-detail', courseId] as const;

export const COURSE_SECTIONS_QUERY_KEY = (courseId: number) =>
  ['course-sections', courseId] as const;

export const COURSE_ASSIGNMENTS_QUERY_KEY = (courseId: number) =>
  ['course-assignments', courseId] as const;

export function useCourseDetail(courseId: number) {
  return useQuery({
    queryKey: COURSE_DETAIL_QUERY_KEY(courseId),
    queryFn: () => courseApi.getCourseDetail(courseId),
    enabled: !!courseId,
  });
}

export function useCourseSections(courseId: number) {
  return useQuery({
    queryKey: COURSE_SECTIONS_QUERY_KEY(courseId),
    queryFn: () => courseApi.getCourseSections(courseId),
    enabled: !!courseId,
  });
}

export function useCourseAssignments(courseId: number) {
  return useQuery({
    queryKey: COURSE_ASSIGNMENTS_QUERY_KEY(courseId),
    queryFn: () => courseApi.getCourseAssignments(courseId),
    enabled: !!courseId,
  });
}

export const ASSIGNMENT_SUBMISSIONS_QUERY_KEY = (sectionId: number) =>
  ['assignment-submissions', sectionId] as const;

/** Instructor-only: fetch all student submissions for one assignment section. */
export function useAssignmentSubmissions(courseId: number, sectionId: number | null) {
  return useQuery({
    queryKey: ASSIGNMENT_SUBMISSIONS_QUERY_KEY(sectionId ?? 0),
    queryFn: () => instructorApi.getAssignmentSubmissions(courseId, sectionId!),
    enabled: !!sectionId,
  });
}

/** Instructor-only: merges material sections (1-4) + assignment sections (5) sorted by display_order. */
export function useInstructorSections(courseId: number) {
  const sections = useCourseSections(courseId);
  const assignments = useCourseAssignments(courseId);
  const data = [...(sections.data ?? []), ...(assignments.data ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  return {
    data,
    isLoading: sections.isLoading || assignments.isLoading,
  };
}
