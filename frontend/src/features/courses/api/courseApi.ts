import { apiClient } from '@/api/client';
import type { Course, CourseSection } from '../types';

// Shared endpoints — both instructor and student roles use these.
// Instructor-only write operations live in instructorApi.ts.
export const courseApi = {
  getCourseDetail: (courseId: number) =>
    apiClient.get<Course>(`/api/courses/${courseId}`).then((r) => r.data),

  // Returns material sections (type 1-4) with embedded files[].
  getCourseSections: (courseId: number) =>
    apiClient.get<CourseSection[]>(`/api/courses/${courseId}/sections`).then((r) => r.data),

  // Returns assignment sections (type 5).
  getCourseAssignments: (courseId: number) =>
    apiClient.get<CourseSection[]>(`/api/courses/${courseId}/assignments`).then((r) => r.data),

  // Get all published courses.
  listCourses: () => apiClient.get<Course[]>('/api/courses').then((r) => r.data),

  // Student: enroll in a course.
  enroll: (courseId: number) =>
    apiClient.post(`/api/courses/${courseId}/enroll`).then((r) => r.data),

  // Student: submit assignment file.
  submitAssignment: (courseId: number, assignmentId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post(`/api/courses/${courseId}/assignments/${assignmentId}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  // Student: get current user's submission for an assignment.
  getMySubmission: (courseId: number, assignmentId: number) =>
    apiClient
      .get(`/api/courses/${courseId}/assignments/${assignmentId}/my-submission`)
      .then((r) => r.data),
};
