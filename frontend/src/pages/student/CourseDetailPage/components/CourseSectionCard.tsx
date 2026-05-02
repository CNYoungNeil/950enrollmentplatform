import React from 'react';
import { Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { CourseSection } from '@/features/courses/types';
import { SECTION_TYPE } from '@/features/courses/types';
import { SECTION_ICON_CONFIG } from '@/features/courses/constants/courseUIConfig';
import { CourseFileList } from '@/features/courses/components/CourseFileList';
import { AssignmentSubmissionPanel } from './AssignmentSubmissionPanel';

const { Title, Text, Paragraph } = Typography;

interface CourseSectionCardProps {
  courseId: number;
  section: CourseSection;
  isExpanded: boolean;
  onToggle: () => void;
  isCollapsible: boolean;
}

export const CourseSectionCard: React.FC<CourseSectionCardProps> = ({
  courseId,
  section,
  isExpanded,
  onToggle,
  isCollapsible,
}) => {
  const typeConfig = SECTION_ICON_CONFIG[section.section_type] || SECTION_ICON_CONFIG[1];

  return (
    <div
      id={`section-${section.id}`}
      className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80 scroll-mt-32 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]"
    >
      {/* Section Header */}
      <div
        className={`p-10 flex items-center justify-between text-left ${
          isCollapsible ? 'cursor-pointer hover:bg-gray-50/50' : ''
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-inner"
            style={{ backgroundColor: typeConfig.bg, color: typeConfig.color }}
          >
            {typeConfig.icon}
          </div>
          <div>
            <Title level={3} className="!m-0">
              {typeConfig.label}
            </Title>
          </div>
        </div>

        {isCollapsible && (
          <div
            className={`text-gray-400 transition-transform duration-300 ${
              isExpanded ? 'rotate-0' : '-rotate-90'
            }`}
          >
            <DownOutlined style={{ fontSize: '20px' }} />
          </div>
        )}
      </div>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100 p-10 pt-0' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {section.description_text && (
          <Paragraph className="text-gray-600 text-base mb-8 whitespace-pre-wrap leading-relaxed text-left">
            {section.description_text}
          </Paragraph>
        )}

        {/* Resource Files List */}
        {section.files && section.files.length > 0 && <CourseFileList files={section.files} />}

        {!section.description_text && (!section.files || section.files.length === 0) && (
          <div className="py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Text type="secondary">Assignment instructions or files will appear here</Text>
          </div>
        )}

        {/* Assignment Submission Panel */}
        {section.section_type === SECTION_TYPE.ASSIGNMENT && (
          <div className="mt-6">
            <AssignmentSubmissionPanel courseId={courseId} section={section} />
          </div>
        )}
      </div>
    </div>
  );
};
