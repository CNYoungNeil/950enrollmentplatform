import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import {
  useCourseDetail,
  useCourseSections,
  useCourseAssignments,
} from '@/features/courses/hooks/useCourseDetail';
import { LoadingCenter } from '@/components/ui';
import { SECTION_TYPE } from '@/features/courses/types';

// Sub-components
import { CourseDetailHeader } from './components/CourseDetailHeader';
import { CourseNavigationDrawer } from './components/CourseNavigationDrawer';
import { CourseSectionCard } from './components/CourseSectionCard';

const { Title, Paragraph } = Typography;

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  const { data: course, isLoading: isCourseLoading } = useCourseDetail(Number(id));
  const { data: sections, isLoading: isSectionsLoading } = useCourseSections(Number(id));
  const { data: assignments, isLoading: isAssignmentsLoading } = useCourseAssignments(Number(id));

  const isLoading = isCourseLoading || isSectionsLoading || isAssignmentsLoading;

  if (isLoading) return <LoadingCenter />;
  if (!course) return <div>Course not found</div>;

  // Filter and Merge Sections
  const allSections = [...(sections ?? []), ...(assignments ?? [])]
    .filter((s) => s.title && s.title.trim() !== '' && s.is_published === 1)
    .sort((a, b) => a.display_order - b.display_order);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar Navigation Drawer */}
      <CourseNavigationDrawer
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        sections={allSections}
        onScrollTo={scrollToSection}
      />

      {/* Sticky Contextual Header */}
      <div className="px-8 mt-8">
        <CourseDetailHeader course={course} onMenuClick={() => setIsIndexOpen(true)} />
      </div>

      {/* Main Content */}
      <div className="px-8 py-10">
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          {/* General Section */}
          <div
            id="general"
            className="bg-white rounded-[2rem] p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 scroll-mt-32 relative overflow-hidden"
          >
            <Title level={3} className="!mb-6 flex items-center gap-3 !text-gray-800">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <HomeOutlined className="text-blue-600 text-lg" />
              </div>
              General Information
            </Title>
            <Paragraph className="text-xl text-gray-500 font-medium leading-relaxed mb-0 text-left">
              {course.description ||
                'Welcome to your learning dashboard. Use the course navigation on the left to browse materials and assignments.'}
            </Paragraph>
          </div>

          {/* Dynamic Sections */}
          {allSections?.map((section) => {
            const isCollapsible = (
              [
                SECTION_TYPE.MATERIALS,
                SECTION_TYPE.ARTICLE,
                SECTION_TYPE.LECTURE_PRESENTATION,
              ] as number[]
            ).includes(section.section_type);

            return (
              <CourseSectionCard
                key={section.id}
                section={section}
                isCollapsible={isCollapsible}
                isExpanded={expandedSections[section.id] !== false}
                onToggle={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    [section.id]: expandedSections[section.id] === false,
                  }))
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
