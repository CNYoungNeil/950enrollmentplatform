import React from 'react';
import { Tag } from 'antd';
import { COURSE_STATUS, COURSE_STATUS_LABELS } from '../types';
import type { CourseStatus } from '../types';

const STATUS_COLOR: Record<CourseStatus, string> = {
  [COURSE_STATUS.DRAFT]: 'default',
  [COURSE_STATUS.PUBLISHED]: 'success',
  [COURSE_STATUS.ARCHIVED]: 'warning',
};

interface Props {
  status: CourseStatus;
}

const CourseStatusBadge: React.FC<Props> = ({ status }) => (
  <Tag color={STATUS_COLOR[status]}>{COURSE_STATUS_LABELS[status]}</Tag>
);

export default CourseStatusBadge;
