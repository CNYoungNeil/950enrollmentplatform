import React from 'react';
import { Card, Typography, Space } from 'antd';
import { CalendarOutlined, RightOutlined } from '@ant-design/icons';
import CourseStatusBadge from './CourseStatusBadge';
import type { Course } from '../types';

const { Title, Text } = Typography;

interface Props {
  course: Course;
  onClick: (course: Course) => void;
}

const CourseCard: React.FC<Props> = ({ course, onClick }) => (
  <Card
    hoverable
    onClick={() => onClick(course)}
    className="h-full transition-all duration-200 hover:-translate-y-1"
    styles={{ body: { padding: '20px', height: '100%' } }}
  >
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between gap-2">
        <CourseStatusBadge status={course.status} />
        <RightOutlined className="text-gray-400 mt-0.5 flex-shrink-0" />
      </div>

      <div>
        <Text type="secondary" className="text-xs font-mono tracking-wide">
          {course.course_code}
        </Text>
        <Title level={5} className="!mt-1 !mb-0 line-clamp-2">
          {course.title}
        </Title>
      </div>

      {course.description && (
        <Text type="secondary" className="text-sm line-clamp-2 flex-1">
          {course.description}
        </Text>
      )}

      <div className="flex items-center gap-1.5 mt-auto pt-3 border-t border-gray-100">
        <CalendarOutlined className="text-gray-400 text-xs" />
        <Text type="secondary" className="text-xs">
          {course.semester}
        </Text>
      </div>
    </div>
  </Card>
);

export default CourseCard;
