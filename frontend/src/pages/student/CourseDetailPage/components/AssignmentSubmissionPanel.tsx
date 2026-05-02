import React, { useState, useEffect } from 'react';
import { Typography, Button, Alert, Space } from 'antd';
import type { CourseSection } from '@/features/courses/types';
import { useMySubmission, useSubmitAssignment } from '@/features/courses/hooks/useSubmission';
import { useAssignmentStatus } from '@/features/assignments/hooks/useAssignmentStatus';
import { SubmissionStatus } from '@/features/assignments/components/SubmissionStatus';
import { SubmittedFileCard } from '@/features/assignments/components/SubmittedFileCard';
import { FileUploadZone } from '@/features/assignments/components/FileUploadZone';

const { Title, Text } = Typography;

interface AssignmentSubmissionPanelProps {
  courseId: number;
  section: CourseSection;
}

export const AssignmentSubmissionPanel: React.FC<AssignmentSubmissionPanelProps> = ({
  courseId,
  section,
}) => {
  const { data: submission, isLoading } = useMySubmission(courseId, section.id);
  const submitMutation = useSubmitAssignment(courseId, section.id);
  const [isEditing, setIsEditing] = useState(false);

  const { deadline, isOverdue, isNearDeadline, canEdit } = useAssignmentStatus({
    dueDate: section.due_at,
    submission,
  });

  useEffect(() => {
    if (submitMutation.isSuccess) setIsEditing(false);
  }, [submitMutation.isSuccess]);

  const showUploadArea = !submission || isEditing;

  return (
    <div className="mt-6 p-8 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-6">
      {/* Status, Deadline, Grade */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Space size="large">
          <div className="flex flex-col text-left">
            <Text type="secondary" className="text-[11px] uppercase font-bold tracking-wider mb-1">
              Submission Status
            </Text>
            <SubmissionStatus submission={submission} isOverdue={isOverdue} isLoading={isLoading} />
          </div>

          {deadline && (
            <div className="flex flex-col border-l border-gray-200 pl-6 text-left">
              <Text
                type="secondary"
                className="text-[11px] uppercase font-bold tracking-wider mb-1"
              >
                Deadline
              </Text>
              <Text
                className={`font-semibold ${isOverdue ? 'text-red-500' : isNearDeadline ? 'text-orange-500' : 'text-gray-700'}`}
              >
                {deadline.format('DD MMM YYYY, HH:mm')}
                {isOverdue && ' (Expired)'}
              </Text>
            </div>
          )}
        </Space>

        {submission && (
          <div className="flex flex-col items-end text-right">
            <Text type="secondary" className="text-[11px] uppercase font-bold tracking-wider mb-1">
              Grade
            </Text>
            <Text className="text-lg font-black text-blue-600">
              {submission.score !== null ? `${submission.score}/100` : '-- / 100'}
            </Text>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      {submission?.feedback && (
        <Alert
          message="Instructor Feedback"
          description={submission.feedback}
          type="info"
          showIcon
          className="rounded-2xl"
        />
      )}

      {/* Action Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Title level={5} className="!m-0 text-gray-700">
            {submission ? 'Your Submission' : 'Submit Work'}
          </Title>
          {submission && canEdit && (
            <Button
              type={isEditing ? 'text' : 'primary'}
              ghost={!isEditing}
              size="small"
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? 'text-gray-400' : 'rounded-lg'}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          )}
        </div>

        {submission && !isEditing && <SubmittedFileCard submission={submission} />}

        {showUploadArea && (canEdit || !submission) && (
          <FileUploadZone
            onUpload={(file) => submitMutation.mutate(file)}
            isPending={submitMutation.isPending}
          />
        )}

        {isOverdue && !submission && (
          <Alert
            message="Submission Closed"
            description="The deadline for this assignment has passed. You can no longer submit your work."
            type="error"
            showIcon
            className="rounded-2xl"
          />
        )}
      </div>
    </div>
  );
};
