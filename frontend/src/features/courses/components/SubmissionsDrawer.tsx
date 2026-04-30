import React from 'react';
import {
  Drawer,
  List,
  Button,
  Tag,
  Typography,
  Space,
  Empty,
  Spin,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Tooltip,
} from 'antd';
import {
  TeamOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAssignmentSubmissions } from '../hooks/useCourseDetail';
import { useGradeSubmission } from '../hooks/useCourseMutations';
import {
  SUBMISSION_STATUS,
  SUBMISSION_STATUS_LABELS,
  SUBMISSION_STATUS_COLORS,
} from '../types';
import type { CourseSection, Submission } from '../types';
import { config } from '@/config';

const { Text } = Typography;

const gradeSchema = z.object({
  score: z
    .number({ invalid_type_error: 'Score is required' })
    .min(0, 'Min 0')
    .max(100, 'Max 100'),
  feedback: z.string().max(2000).optional().default(''),
});

type GradeForm = z.infer<typeof gradeSchema>;

interface GradeModalProps {
  open: boolean;
  submission: Submission | null;
  courseId: number;
  onClose: () => void;
}

const GradeModal: React.FC<GradeModalProps> = ({ open, submission, courseId, onClose }) => {
  const { mutate: gradeSubmission, isPending } = useGradeSubmission(
    submission?.section_id ?? 0,
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradeForm>({
    resolver: zodResolver(gradeSchema),
    defaultValues: { score: undefined as unknown as number, feedback: '' },
  });

  React.useEffect(() => {
    if (open && submission) {
      reset({
        score: submission.score ?? (undefined as unknown as number),
        feedback: submission.feedback ?? '',
      });
    }
  }, [open, submission, reset]);

  const onSubmit = (values: GradeForm) => {
    if (!submission) return;
    gradeSubmission(
      {
        courseId,
        submissionId: submission.id,
        params: { score: values.score, feedback: values.feedback || undefined },
      },
      {
        onSuccess: () => {
          message.success('Grade saved successfully');
          reset();
          onClose();
        },
        onError: () => message.error('Failed to save grade'),
      },
    );
  };

  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined className="text-green-500" />
          <span>Grade Submission</span>
        </Space>
      }
      open={open}
      onCancel={() => { reset(); onClose(); }}
      footer={null}
      width={480}
      destroyOnClose
    >
      {submission && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <Text type="secondary" className="text-xs block mb-1">Student</Text>
          <Text strong>{submission.student_name ?? `Student #${submission.student_id}`}</Text>
          <Text type="secondary" className="text-xs block mt-2 mb-1">Submitted file</Text>
          <Text className="text-sm">{submission.file_name}</Text>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1 pt-2">
        <Form.Item
          label="Score (0 – 100)"
          validateStatus={errors.score ? 'error' : ''}
          help={errors.score?.message}
          required
        >
          <Controller
            name="score"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                max={100}
                step={0.5}
                placeholder="e.g. 85"
                className="w-full"
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Feedback">
          <Controller
            name="feedback"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={4}
                placeholder="Optional comments for the student..."
              />
            )}
          />
        </Form.Item>

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isPending} icon={<CheckCircleOutlined />}>
            Save Grade
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ── Main Drawer ───────────────────────────────────────────────────────────────

interface Props {
  courseId: number;
  section: CourseSection | null;
  open: boolean;
  onClose: () => void;
}

const SubmissionsDrawer: React.FC<Props> = ({ courseId, section, open, onClose }) => {
  const sectionId = section?.id ?? null;
  const [gradingSubmission, setGradingSubmission] = React.useState<Submission | null>(null);

  const { data: submissions = [], isLoading } = useAssignmentSubmissions(courseId, sectionId);

  const sorted = [...submissions].sort((a, b) => {
    // Ungraded first, then by submitted_at desc
    if (a.status !== b.status) {
      const ungraded = (s: Submission) => s.status < SUBMISSION_STATUS.GRADED ? 0 : 1;
      return ungraded(a) - ungraded(b);
    }
    return (b.submitted_at ?? '').localeCompare(a.submitted_at ?? '');
  });

  const fileUrl = (url: string) =>
    url.startsWith('http') ? url : `${config.apiBaseUrl}${url}`;

  const renderItem = (sub: Submission) => {
    const isGraded = sub.status === SUBMISSION_STATUS.GRADED || sub.status === SUBMISSION_STATUS.RETURNED;
    return (
      <List.Item
        key={sub.id}
        className="!px-4 !py-3 mb-2 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
        actions={[
          <Button
            key="grade"
            type={isGraded ? 'default' : 'primary'}
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => setGradingSubmission(sub)}
          >
            {isGraded ? 'Re-grade' : 'Grade'}
          </Button>,
        ]}
      >
        <List.Item.Meta
          title={
            <Space size={8} wrap>
              <Text strong>{sub.student_name ?? `Student #${sub.student_id}`}</Text>
              <Tag color={SUBMISSION_STATUS_COLORS[sub.status]}>
                {SUBMISSION_STATUS_LABELS[sub.status]}
              </Tag>
              {isGraded && sub.score !== null && (
                <Tag color="green">{sub.score} / 100</Tag>
              )}
            </Space>
          }
          description={
            <Space size={16} className="mt-1">
              <Tooltip title="Download submission">
                <a
                  href={fileUrl(sub.file_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700"
                >
                  <FileTextOutlined />
                  {sub.file_name}
                </a>
              </Tooltip>
              {sub.submitted_at && (
                <Text type="secondary" className="text-xs">
                  {new Date(sub.submitted_at).toLocaleString()}
                </Text>
              )}
            </Space>
          }
        />
      </List.Item>
    );
  };

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <TeamOutlined />
            <span className="truncate" title={section?.title}>
              Submissions — {section?.title ?? ''}
            </span>
          </div>
        }
        open={open}
        onClose={onClose}
        width={640}
        destroyOnClose
      >
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin />
          </div>
        ) : sorted.length === 0 ? (
          <Empty
            image={<TeamOutlined className="text-5xl text-gray-300" />}
            description={
              <div className="text-center">
                <Text strong className="block mb-1">No submissions yet</Text>
                <Text type="secondary" className="text-sm">
                  Students haven't submitted anything for this assignment
                </Text>
              </div>
            }
            className="py-12"
          />
        ) : (
          <>
            <Text type="secondary" className="text-xs mb-3 block">
              {sorted.length} submission{sorted.length !== 1 ? 's' : ''}
              {' · '}
              {sorted.filter(s => s.status >= SUBMISSION_STATUS.GRADED).length} graded
            </Text>
            <List dataSource={sorted} renderItem={renderItem} />
          </>
        )}
      </Drawer>

      <GradeModal
        open={!!gradingSubmission}
        submission={gradingSubmission}
        courseId={courseId}
        onClose={() => setGradingSubmission(null)}
      />
    </>
  );
};

export default SubmissionsDrawer;
