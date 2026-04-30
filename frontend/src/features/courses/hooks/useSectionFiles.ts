import { useCourseSections } from './useCourseDetail';

// Files are embedded in each section's response — no separate API call needed.
// Kept as a named export so callers don't need to change their import.
export const SECTION_FILES_QUERY_KEY = (sectionId: number) =>
  ['section-files', sectionId] as const;

export function useSectionFiles(courseId: number, sectionId: number | null) {
  const { data: sections = [], isLoading } = useCourseSections(courseId);
  const section = sections.find((s) => s.id === sectionId);
  return {
    data: section?.files ?? [],
    isLoading,
  };
}
