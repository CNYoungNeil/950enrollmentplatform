import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FloatButton } from 'antd';
import { MenuOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store/useAppStore';
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

const CourseDetailPage: React.FC = () => {
  const { sidebarCollapsed } = useAppStore();
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
    <div
      className="min-h-screen bg-gray-50 flex flex-col transition-all duration-300 ease-in-out"
      style={{ paddingLeft: isIndexOpen && sidebarCollapsed ? 260 : 0 }}
    >
      {/* Sidebar Navigation Drawer */}
      <CourseNavigationDrawer
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        sections={allSections}
        onScrollTo={scrollToSection}
        mask={false}
      />

      {/* Sticky Contextual Header */}
      <div className="px-8 mt-8">
        <CourseDetailHeader course={course} />
      </div>

      {/* Main Content */}
      <div className="px-8 py-10">
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          {/* Dynamic Sections */}
          {allSections?.map((section) => {
            const isCollapsible = (
              [
                SECTION_TYPE.MATERIALS,
                SECTION_TYPE.ARTICLE,
                SECTION_TYPE.LECTURE_PRESENTATION,
                SECTION_TYPE.ASSIGNMENT,
              ] as number[]
            ).includes(section.section_type);

            return (
              <CourseSectionCard
                key={section.id}
                courseId={Number(id)}
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
      {!isIndexOpen && (
        <FloatButton
          icon={<MenuOutlined style={{ fontSize: '14px', color: '#64748b' }} />}
          style={{
            left: sidebarCollapsed ? 24 : 284,
            top: 260,
            width: 38,
            height: 38,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
          tooltip="Course Index"
          onClick={() => setIsIndexOpen(true)}
        />
      )}

      <FloatButton.BackTop
        visibilityHeight={400}
        icon={<VerticalAlignTopOutlined style={{ fontSize: '14px' }} />}
        style={{ right: 48, bottom: 48, width: 38, height: 38 }}
        tooltip="Back to Top"
      />
    </div>
  );
};

export default CourseDetailPage;
