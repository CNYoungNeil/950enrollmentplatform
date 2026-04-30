import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SECTION_TYPE, SECTION_TYPE_LABELS } from '../types';
import type { CourseSection, SectionType } from '../types';
import {
  useCreateSection,
  useUpdateSection,
  useCreateAssignment,
  useUpdateAssignment,
} from '../hooks/useCourseMutations';

const schema = z.object({
  title: z.string().min(1, 'Section title is required').max(200),
  section_type: z.number().int() as z.ZodType<SectionType>,
  description_text: z.string().max(2000).optional().default(''),
  due_at: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const SECTION_TYPE_OPTIONS = (
  Object.entries(SECTION_TYPE_LABELS) as [string, string][]
).map(([value, label]) => ({
  value: Number(value) as SectionType,
  label,
}));

interface Props {
  courseId: number;
  open: boolean;
  onClose: () => void;
  editingSection?: CourseSection | null;
}

const SectionFormModal: React.FC<Props> = ({
  courseId,
  open,
  onClose,
  editingSection,
}) => {
  const isEditing = !!editingSection;
  const { mutate: createSection, isPending: isCreatingSection } = useCreateSection(courseId);
  const { mutate: updateSection, isPending: isUpdatingSection } = useUpdateSection(courseId);
  const { mutate: createAssignment, isPending: isCreatingAssignment } = useCreateAssignment(courseId);
  const { mutate: updateAssignment, isPending: isUpdatingAssignment } = useUpdateAssignment(courseId);
  const isPending = isCreatingSection || isUpdatingSection || isCreatingAssignment || isUpdatingAssignment;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      section_type: SECTION_TYPE.MATERIALS,
      description_text: '',
      due_at: undefined,
    },
  });

  const sectionType = watch('section_type');

  React.useEffect(() => {
    if (open) {
      reset({
        title: editingSection?.title ?? '',
        section_type: editingSection?.section_type ?? SECTION_TYPE.MATERIALS,
        description_text: editingSection?.description_text ?? '',
        // slice to "YYYY-MM-DDTHH:mm" format for datetime-local input
        due_at: editingSection?.due_at
          ? editingSection.due_at.slice(0, 16)
          : undefined,
      });
    }
  }, [open, editingSection, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    const isAssignment = values.section_type === SECTION_TYPE.ASSIGNMENT;
    const successMsg = isEditing ? 'Section updated' : 'Section added';
    const errorMsg = isEditing ? 'Failed to update section' : 'Failed to add section';
    const callbacks = {
      onSuccess: () => { message.success(successMsg); handleClose(); },
      onError: () => message.error(errorMsg),
    };

    if (isEditing && editingSection) {
      if (isAssignment) {
        updateAssignment(
          {
            sectionId: editingSection.id,
            params: {
              title: values.title,
              description_text: values.description_text || undefined,
              due_at: values.due_at || undefined,
            },
          },
          callbacks,
        );
      } else {
        updateSection(
          {
            sectionId: editingSection.id,
            params: {
              title: values.title,
              description_text: values.description_text || undefined,
            },
          },
          callbacks,
        );
      }
    } else {
      if (isAssignment) {
        createAssignment(
          {
            title: values.title,
            description_text: values.description_text || undefined,
            due_at: values.due_at || undefined,
          },
          callbacks,
        );
      } else {
        createSection(
          {
            title: values.title,
            section_type: values.section_type,
            description_text: values.description_text || undefined,
          },
          callbacks,
        );
      }
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit Section' : 'Add Section'}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={520}
      destroyOnClose
    >
      <form onSubmit={handleSubmit(onSubmit)} className="pt-4 flex flex-col gap-1">
        <Form.Item
          label="Section Title"
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title?.message}
          required
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="e.g. Week 1: Introduction" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Section Type"
          validateStatus={errors.section_type ? 'error' : ''}
          help={errors.section_type?.message}
          required
        >
          <Controller
            name="section_type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={SECTION_TYPE_OPTIONS}
                placeholder="Select section type"
                disabled={isEditing}
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Description">
          <Controller
            name="description_text"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder="Optional description..."
              />
            )}
          />
        </Form.Item>

        {sectionType === SECTION_TYPE.ASSIGNMENT && (
          <Form.Item label="Due Date">
            <Controller
              name="due_at"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="datetime-local"
                  value={field.value ?? ''}
                />
              )}
            />
          </Form.Item>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            {isEditing ? 'Save Changes' : 'Add Section'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SectionFormModal;
