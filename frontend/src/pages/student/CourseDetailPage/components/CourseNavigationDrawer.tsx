import React from 'react';
import { Typography, Drawer, Button } from 'antd';
import { CompassOutlined, CloseOutlined } from '@ant-design/icons';
import type { CourseSection } from '@/features/courses/types';
import { SECTION_ICON_CONFIG } from '@/features/courses/constants/courseUIConfig';

const { Title, Text } = Typography;

interface CourseNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sections: CourseSection[];
  onScrollTo: (id: string) => void;
  mask?: boolean;
}

export const CourseNavigationDrawer: React.FC<CourseNavigationDrawerProps> = ({
  isOpen,
  onClose,
  sections,
  onScrollTo,
  mask = true,
}) => {
  return (
    <Drawer
      placement="left"
      onClose={onClose}
      open={isOpen}
      width={260}
      mask={mask}
      closable={false}
      styles={{ body: { padding: 0 } }}
      className="course-index-drawer"
    >
      <div className="h-full flex flex-col bg-white">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <Title level={5} className="!mb-0 flex items-center gap-2 text-gray-700">
            <CompassOutlined className="text-blue-600" /> Navigation
          </Title>
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {sections.map((section) => {
            const config = SECTION_ICON_CONFIG[section.section_type] || SECTION_ICON_CONFIG[1];
            return (
              <div
                key={section.id}
                onClick={() => onScrollTo(`section-${section.id}`)}
                className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all mb-2 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  {config.icon}
                </div>
                <div className="flex flex-col">
                  <Text className="font-medium group-hover:text-blue-600 transition-colors leading-tight">
                    {config.label}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
};
