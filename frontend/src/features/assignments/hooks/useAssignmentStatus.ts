import { useMemo } from 'react';
import dayjs from 'dayjs';

interface UseAssignmentStatusProps {
  dueDate?: string | null;
  submission?: any;
}

export const useAssignmentStatus = ({ dueDate, submission }: UseAssignmentStatusProps) => {
  const deadline = useMemo(() => (dueDate ? dayjs(dueDate) : null), [dueDate]);
  
  const isOverdue = useMemo(() => 
    deadline ? dayjs().isAfter(deadline) : false, 
  [deadline]);

  const isNearDeadline = useMemo(() => 
    deadline ? !isOverdue && deadline.diff(dayjs(), 'hour') < 24 : false, 
  [deadline, isOverdue]);

  const canEdit = !isOverdue;

  return {
    deadline,
    isOverdue,
    isNearDeadline,
    canEdit,
    hasSubmission: !!submission,
  };
};
