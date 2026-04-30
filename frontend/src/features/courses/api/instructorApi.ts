import { apiClient } from '@/api/client';
import type {
  Course,
  CourseSection,
  CourseSectionFile,
  CreateCourseParams,
  UpdateCourseParams,
  CreateSectionParams,
  UpdateSectionParams,
  UpdateSectionFileParams,
  CreateAssignmentParams,
  UpdateAssignmentParams,
  Submission,
  GradeSubmissionParams,
} from '../types';

export const instructorApi = {
  getMyCourses: () =>
    apiClient.get<Course[]>('/api/courses/my').then((r) => r.data),

  createCourse: (params: CreateCourseParams) =>
    apiClient.post<Course>('/api/courses', params).then((r) => r.data),

  updateCourse: (courseId: number, params: UpdateCourseParams) =>
    apiClient.put<Course>(`/api/courses/${courseId}`, params).then((r) => r.data),

  createSection: (courseId: number, params: CreateSectionParams) =>
    apiClient
      .post<CourseSection>(`/api/courses/${courseId}/sections`, params)
      .then((r) => r.data),

  updateSection: (courseId: number, sectionId: number, params: UpdateSectionParams) =>
    apiClient
      .put<CourseSection>(`/api/courses/${courseId}/sections/${sectionId}`, params)
      .then((r) => r.data),

  deleteSection: (courseId: number, sectionId: number) =>
    apiClient
      .delete(`/api/courses/${courseId}/sections/${sectionId}`)
      .then((r) => r.data),

  uploadSectionFile: (courseId: number, sectionId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<CourseSectionFile>(
        `/api/courses/${courseId}/sections/${sectionId}/files`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      .then((r) => r.data);
  },

  updateSectionFile: (
    courseId: number,
    sectionId: number,
    fileId: number,
    params: UpdateSectionFileParams,
  ) =>
    apiClient
      .put<CourseSectionFile>(
        `/api/courses/${courseId}/sections/${sectionId}/files/${fileId}`,
        params,
      )
      .then((r) => r.data),

  deleteSectionFile: (courseId: number, sectionId: number, fileId: number) =>
    apiClient
      .delete(`/api/courses/${courseId}/sections/${sectionId}/files/${fileId}`)
      .then((r) => r.data),

  createAssignment: (courseId: number, params: CreateAssignmentParams) =>
    apiClient
      .post<CourseSection>(`/api/courses/${courseId}/assignments`, params)
      .then((r) => r.data),

  updateAssignment: (courseId: number, sectionId: number, params: UpdateAssignmentParams) =>
    apiClient
      .put<CourseSection>(`/api/courses/${courseId}/assignments/${sectionId}`, params)
      .then((r) => r.data),

  deleteAssignment: (courseId: number, sectionId: number) =>
    apiClient
      .delete(`/api/courses/${courseId}/assignments/${sectionId}`)
      .then((r) => r.data),

  getAssignmentSubmissions: (courseId: number, sectionId: number) =>
    apiClient
      .get<Submission[]>(`/api/courses/${courseId}/assignments/${sectionId}/submissions`)
      .then((r) => r.data),

  gradeSubmission: (
    courseId: number,
    sectionId: number,
    submissionId: number,
    params: GradeSubmissionParams,
  ) =>
    apiClient
      .put<Submission>(
        `/api/courses/${courseId}/assignments/${sectionId}/submissions/${submissionId}/grade`,
        params,
      )
      .then((r) => r.data),
};
