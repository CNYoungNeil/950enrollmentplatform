import React from 'react';
import { Tag } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  SUBMISSION_STATUS,
  SUBMISSION_STATUS_LABELS,
  SUBMISSION_STATUS_COLORS,
} from '@/features/courses/types';

interface SubmissionStatusProps {
  submission: any;
  isOverdue: boolean;
  isLoading: boolean;
}

export const SubmissionStatus: React.FC<SubmissionStatusProps> = ({
  submission,
  isOverdue,
  isLoading,
}) => {
  if (isLoading) return <Tag icon={<ClockCircleOutlined spin />}>Checking status...</Tag>;
  if (!submission) {
    return isOverdue ? (
      <Tag color="error" icon={<ExclamationCircleOutlined />}>Not Submitted (Overdue)</Tag>
    ) : (
      <Tag color="default" icon={<ClockCircleOutlined />}>Not Submitted</Tag>
    );
  }

  const status = submission.status;
  return (
    <Tag
      color={SUBMISSION_STATUS_COLORS[status]}
      icon={status === SUBMISSION_STATUS.SUBMITTED ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
    >
      {SUBMISSION_STATUS_LABELS[status]}
    </Tag>
  );
};
