import React from 'react';
import {
  Typography,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  Breadcrumb,
  message,
  Card,
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingCenter } from '@/components/ui';
import { useCourseDetail } from '@/features/courses/hooks/useCourseDetail';
import { useUpdateCourse } from '@/features/courses/hooks/useCourseMutations';
import SectionList from '@/features/courses/components/SectionList';
import CourseStatusBadge from '@/features/courses/components/CourseStatusBadge';
import { ROUTES } from '@/router/routes';
import { COURSE_STATUS } from '@/features/courses/types';
import type { CourseStatus, UpdateCourseParams } from '@/features/courses/types';

const { Title, Text } = Typography;

const basicInfoSchema = z.object({
  course_code: z.string().min(1, 'Required').max(50),
  title: z.string().min(1, 'Required').max(200),
  description: z.string().max(2000).optional().default(''),
  semester: z.string().min(1, 'Required').max(50),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]) as z.ZodType<CourseStatus>,
});

type BasicInfoForm = z.infer<typeof basicInfoSchema>;

const STATUS_OPTIONS = [
  { value: COURSE_STATUS.DRAFT, label: 'Draft' },
  { value: COURSE_STATUS.PUBLISHED, label: 'Published' },
  { value: COURSE_STATUS.ARCHIVED, label: 'Archived' },
];

const CourseConfigPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const id = Number(courseId);

  const { data: course, isLoading } = useCourseDetail(id);
  const { mutate: updateCourse, isPending } = useUpdateCourse(id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BasicInfoForm>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      course_code: '',
      title: '',
      description: '',
      semester: '',
      status: COURSE_STATUS.DRAFT,
    },
  });

  React.useEffect(() => {
    if (course) {
      reset({
        course_code: course.course_code,
        title: course.title,
        description: course.description ?? '',
        semester: course.semester,
        status: course.status,
      });
    }
  }, [course, reset]);

  const onSave = (values: BasicInfoForm) => {
    updateCourse(values as UpdateCourseParams, {
      onSuccess: () => message.success('Course updated successfully'),
      onError: () => message.error('Failed to save changes'),
    });
  };

  if (isLoading) return <LoadingCenter />;

  if (!course) {
    return (
      <div className="p-6 text-center py-24">
        <Text type="secondary">Course not found.</Text>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'basic',
      label: 'Basic Info',
      children: (
        <Card className="shadow-sm" styles={{ body: { padding: '28px' } }}>
          <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-1 max-w-xl">
            <Form.Item
              label="Course Code"
              validateStatus={errors.course_code ? 'error' : ''}
              help={errors.course_code?.message}
              required
            >
              <Controller
                name="course_code"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="e.g. ISIT950" className="font-mono" />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Course Title"
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title?.message}
              required
            >
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>

            <Form.Item
              label="Semester"
              validateStatus={errors.semester ? 'error' : ''}
              help={errors.semester?.message}
              required
            >
              <Controller
                name="semester"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="e.g. 2026 Semester 1" />
                )}
              />
            </Form.Item>

            <Form.Item label="Description">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    rows={4}
                    placeholder="Course description..."
                  />
                )}
              />
            </Form.Item>

            <Form.Item label="Status" required>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select {...field} options={STATUS_OPTIONS} className="w-44" />
                )}
              />
            </Form.Item>

            <div className="pt-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                disabled={!isDirty}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      ),
    },
    {
      key: 'sections',
      label: 'Sections',
      children: (
        <Card className="shadow-sm" styles={{ body: { padding: '28px' } }}>
          <SectionList courseId={id} />
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Breadcrumb
        className="mb-4"
        items={[
          {
            title: (
              <span
                className="cursor-pointer hover:text-blue-500 transition-colors"
                onClick={() => navigate(ROUTES.INSTRUCTOR_COURSES)}
              >
                <HomeOutlined className="mr-1" />
                My Courses
              </span>
            ),
          },
          { title: course.title },
        ]}
      />

      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <Text type="secondary" className="font-mono text-sm tracking-wide">
              {course.course_code}
            </Text>
            <CourseStatusBadge status={course.status} />
          </div>
          <Title level={3} className="!mb-0">
            {course.title}
          </Title>
          <Text type="secondary">{course.semester}</Text>
        </div>
      </div>

      <Tabs items={tabItems} defaultActiveKey="basic" />
    </div>
  );
};

export default CourseConfigPage;
