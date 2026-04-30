// Shared course hooks — both roles can use these read-only query hooks.
// Instructor-only mutation hooks live in useCourseMutations.ts and
// useFileMutations.ts; the instructor courses list is in useInstructorCourses.ts.
export { useCourseDetail, useCourseSections } from './useCourseDetail';
export { useSectionFiles, SECTION_FILES_QUERY_KEY } from './useSectionFiles';
