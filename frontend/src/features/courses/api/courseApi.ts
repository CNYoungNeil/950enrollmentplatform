import { apiClient } from '@/api/client';
import type { Course, CourseSection } from '../types';

// Shared endpoints — both instructor and student roles use these.
// Instructor-only write operations live in instructorApi.ts.
export const courseApi = {
  getCourseDetail: (courseId: number) =>
    apiClient.get<Course>(`/api/courses/${courseId}`).then((r) => r.data),

  // Returns material sections (type 1-4) with embedded files[].
  getCourseSections: (courseId: number) =>
    apiClient
      .get<CourseSection[]>(`/api/courses/${courseId}/sections`)
      .then((r) => r.data),

  // Returns assignment sections (type 5).
  getCourseAssignments: (courseId: number) =>
    apiClient
      .get<CourseSection[]>(`/api/courses/${courseId}/assignments`)
      .then((r) => r.data),
};
