export const COURSE_STATUS = {
  DRAFT: 1,
  PUBLISHED: 2,
  ARCHIVED: 3,
} as const;

export type CourseStatus = (typeof COURSE_STATUS)[keyof typeof COURSE_STATUS];

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  [COURSE_STATUS.DRAFT]: 'Draft',
  [COURSE_STATUS.PUBLISHED]: 'Published',
  [COURSE_STATUS.ARCHIVED]: 'Archived',
};

export const SECTION_TYPE = {
  MATERIALS: 1,
  ANNOUNCEMENT: 2,
  ARTICLE: 3,
  LECTURE_PRESENTATION: 4,
  ASSIGNMENT: 5,
} as const;

export type SectionType = (typeof SECTION_TYPE)[keyof typeof SECTION_TYPE];

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  [SECTION_TYPE.MATERIALS]: 'Materials',
  [SECTION_TYPE.ANNOUNCEMENT]: 'Announcement',
  [SECTION_TYPE.ARTICLE]: 'Article',
  [SECTION_TYPE.LECTURE_PRESENTATION]: 'Lecture / Presentation',
  [SECTION_TYPE.ASSIGNMENT]: 'Assignment',
};

export interface Course {
  id: number;
  course_code: string;
  title: string;
  description: string;
  semester: string;
  instructor_id: number;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

export interface CourseSection {
  id: number;
  course_id: number;
  title: string;
  section_type: SectionType;
  description_text: string | null;
  due_at: string | null;
  display_order: number;
  is_published: number; // 1=published, 2=hidden
  files?: CourseSectionFile[]; // present on material sections (type 1-4), absent on assignments
  created_at: string;
  updated_at: string;
}

export const FILE_TYPE = {
  PDF: 1,
  DOC: 2,
  DOCX: 3,
  PPT: 4,
  PPTX: 5,
  ZIP: 6,
  IMAGE: 7,
  VIDEO: 8,
  OTHER: 9,
} as const;

export type FileType = (typeof FILE_TYPE)[keyof typeof FILE_TYPE];

export const FILE_TYPE_LABELS: Record<FileType, string> = {
  [FILE_TYPE.PDF]: 'PDF',
  [FILE_TYPE.DOC]: 'Word',
  [FILE_TYPE.DOCX]: 'Word',
  [FILE_TYPE.PPT]: 'PowerPoint',
  [FILE_TYPE.PPTX]: 'PowerPoint',
  [FILE_TYPE.ZIP]: 'Archive',
  [FILE_TYPE.IMAGE]: 'Image',
  [FILE_TYPE.VIDEO]: 'Video',
  [FILE_TYPE.OTHER]: 'File',
};

export function detectFileType(fileName: string): FileType {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, FileType> = {
    pdf: FILE_TYPE.PDF,
    doc: FILE_TYPE.DOC,
    docx: FILE_TYPE.DOCX,
    ppt: FILE_TYPE.PPT,
    pptx: FILE_TYPE.PPTX,
    zip: FILE_TYPE.ZIP,
    jpg: FILE_TYPE.IMAGE,
    jpeg: FILE_TYPE.IMAGE,
    png: FILE_TYPE.IMAGE,
    gif: FILE_TYPE.IMAGE,
    webp: FILE_TYPE.IMAGE,
    mp4: FILE_TYPE.VIDEO,
    avi: FILE_TYPE.VIDEO,
    mov: FILE_TYPE.VIDEO,
    mkv: FILE_TYPE.VIDEO,
  };
  return map[ext] ?? FILE_TYPE.OTHER;
}

export interface CourseSectionFile {
  id: number;
  section_id: number;
  file_name: string;
  file_url: string;
  file_type: FileType;
  display_order: number;
  created_at: string;
}

export interface UpdateSectionFileParams {
  display_order?: number;
}

export interface CreateCourseParams {
  course_code: string;
  title: string;
  description: string;
  semester: string;
}

export interface UpdateCourseParams {
  course_code?: string;
  title?: string;
  description?: string;
  semester?: string;
  status?: CourseStatus;
}

export interface CreateSectionParams {
  title: string;
  section_type: SectionType;
  description_text?: string;
}

export interface UpdateSectionParams {
  title?: string;
  description_text?: string;
  is_published?: number;
  display_order?: number;
}

export interface CreateAssignmentParams {
  title: string;
  description_text?: string;
  due_at?: string;
}

export interface UpdateAssignmentParams {
  title?: string;
  description_text?: string;
  due_at?: string;
  is_published?: number;
  display_order?: number;
}

// ── Submissions ───────────────────────────────────────────────────────────────

export const SUBMISSION_STATUS = {
  SUBMITTED: 1,
  LATE: 2,
  GRADED: 3,
  RETURNED: 4,
} as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  [SUBMISSION_STATUS.SUBMITTED]: 'Submitted',
  [SUBMISSION_STATUS.LATE]: 'Late',
  [SUBMISSION_STATUS.GRADED]: 'Graded',
  [SUBMISSION_STATUS.RETURNED]: 'Returned',
};

export const SUBMISSION_STATUS_COLORS: Record<SubmissionStatus, string> = {
  [SUBMISSION_STATUS.SUBMITTED]: 'blue',
  [SUBMISSION_STATUS.LATE]: 'orange',
  [SUBMISSION_STATUS.GRADED]: 'green',
  [SUBMISSION_STATUS.RETURNED]: 'purple',
};

export interface Submission {
  id: number;
  section_id: number;
  student_id: number;
  student_name: string | null;
  file_name: string;
  file_url: string;
  status: SubmissionStatus;
  submitted_at: string | null;
  score: number | null;
  feedback: string | null;
  graded_by: number | null;
  graded_at: string | null;
  updated_at: string | null;
}

export interface GradeSubmissionParams {
  score: number;
  feedback?: string;
}
