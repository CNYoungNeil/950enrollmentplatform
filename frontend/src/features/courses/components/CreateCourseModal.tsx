import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCourse } from '../hooks/useCourseMutations';

const schema = z.object({
  course_code: z.string().min(1, 'Course code is required').max(50),
  title: z.string().min(1, 'Course title is required').max(200),
  description: z.string().max(2000).optional().default(''),
  semester: z.string().min(1, 'Semester is required').max(50),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (courseId: number) => void;
}

const CreateCourseModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const { mutate: createCourse, isPending } = useCreateCourse();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { course_code: '', title: '', description: '', semester: '' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    createCourse(values, {
      onSuccess: (course) => {
        message.success('Course created successfully');
        handleClose();
        onSuccess(course.id);
      },
      onError: () => {
        message.error('Failed to create course. Please try again.');
      },
    });
  };

  return (
    <Modal
      title="Create New Course"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={560}
      destroyOnClose
    >
      <form onSubmit={handleSubmit(onSubmit)} className="pt-4 flex flex-col gap-1">
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
            render={({ field }) => (
              <Input {...field} placeholder="e.g. Advanced Software Engineering" />
            )}
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

        <Form.Item
          label="Description"
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder="Brief description of the course..."
              />
            )}
          />
        </Form.Item>

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Create Course
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCourseModal;
