import React from 'react';
import {
  List,
  Button,
  Tag,
  Tooltip,
  Popconfirm,
  Typography,
  Space,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PaperClipOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import SectionFormModal from './SectionFormModal';
import SectionFilesDrawer from './SectionFilesDrawer';
import SubmissionsDrawer from './SubmissionsDrawer';
import { SECTION_TYPE_LABELS, SECTION_TYPE } from '../types';
import type { CourseSection } from '../types';
import { useDeleteSection, useDeleteAssignment, useUpdateSection } from '../hooks/useCourseMutations';
import { useInstructorSections } from '../hooks/useCourseDetail';

interface Props {
  courseId: number;
}

const SectionList: React.FC<Props> = ({ courseId }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<CourseSection | null>(null);
  const [filesSection, setFilesSection] = React.useState<CourseSection | null>(null);
  const [submissionsSection, setSubmissionsSection] = React.useState<CourseSection | null>(null);

  const { data: sections = [], isLoading } = useInstructorSections(courseId);
  const { mutate: deleteSection } = useDeleteSection(courseId);
  const { mutate: deleteAssignment } = useDeleteAssignment(courseId);
  const { mutate: updateSection } = useUpdateSection(courseId);

  const sorted = [...sections].sort((a, b) => a.display_order - b.display_order);

  const handleEdit = (section: CourseSection) => {
    setEditingSection(section);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSection(null);
    setModalOpen(true);
  };

  const handleDelete = (section: CourseSection) => {
    const callbacks = {
      onSuccess: () => message.success('Section deleted'),
      onError: () => message.error('Failed to delete section'),
    };
    if (section.section_type === SECTION_TYPE.ASSIGNMENT) {
      deleteAssignment(section.id, callbacks);
    } else {
      deleteSection(section.id, callbacks);
    }
  };

  const handleToggleVisibility = (section: CourseSection) => {
    const newPublished = section.is_published === 1 ? 2 : 1;
    updateSection(
      { sectionId: section.id, params: { is_published: newPublished } },
      { onError: () => message.error('Failed to update visibility') },
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = sorted[index];
    const swapWith = direction === 'up' ? sorted[index - 1] : sorted[index + 1];
    if (!swapWith) return;
    const targetOrder = target.display_order;
    const swapOrder = swapWith.display_order;
    updateSection({ sectionId: target.id, params: { display_order: swapOrder } });
    updateSection({ sectionId: swapWith.id, params: { display_order: targetOrder } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Typography.Text strong className="text-base">
          Sections ({sections.length})
        </Typography.Text>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Section
        </Button>
      </div>

      <List
        loading={isLoading}
        dataSource={sorted}
        locale={{ emptyText: 'No sections yet. Click "Add Section" to get started.' }}
        renderItem={(section, index) => (
          <List.Item
            className="!px-4 !py-3 mb-2 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
            actions={[
              <Space size={2} key="actions">
                <Tooltip title={section.is_published === 1 ? 'Hide from students' : 'Publish'}>
                  <Button
                    type="text"
                    size="small"
                    icon={
                      section.is_published === 1 ? (
                        <EyeOutlined className="text-green-500" />
                      ) : (
                        <EyeInvisibleOutlined className="text-gray-400" />
                      )
                    }
                    onClick={() => handleToggleVisibility(section)}
                  />
                </Tooltip>
                <Tooltip title="Move Up">
                  <Button
                    type="text"
                    size="small"
                    icon={<UpOutlined />}
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                  />
                </Tooltip>
                <Tooltip title="Move Down">
                  <Button
                    type="text"
                    size="small"
                    icon={<DownOutlined />}
                    disabled={index === sorted.length - 1}
                    onClick={() => handleMove(index, 'down')}
                  />
                </Tooltip>
                {section.section_type === SECTION_TYPE.ASSIGNMENT ? (
                  <Tooltip title="View Submissions">
                    <Button
                      type="text"
                      size="small"
                      icon={<TeamOutlined />}
                      onClick={() => setSubmissionsSection(section)}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Manage Files">
                    <Button
                      type="text"
                      size="small"
                      icon={<PaperClipOutlined />}
                      onClick={() => setFilesSection(section)}
                    />
                  </Tooltip>
                )}
                <Tooltip title="Edit">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(section)}
                  />
                </Tooltip>
                <Popconfirm
                  title="Delete this section?"
                  description="This action cannot be undone."
                  onConfirm={() => handleDelete(section)}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </Space>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space size={8}>
                  <span className="font-medium">{section.title}</span>
                  <Tag>{SECTION_TYPE_LABELS[section.section_type]}</Tag>
                  {section.is_published === 2 && (
                    <Tag color="default">Hidden</Tag>
                  )}
                  {section.due_at && (
                    <Tag color="orange">
                      Due: {new Date(section.due_at).toLocaleDateString()}
                    </Tag>
                  )}
                </Space>
              }
              description={section.description_text || undefined}
            />
          </List.Item>
        )}
      />

      <SectionFormModal
        courseId={courseId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingSection={editingSection}
      />

      <SectionFilesDrawer
        courseId={courseId}
        section={filesSection}
        open={!!filesSection}
        onClose={() => setFilesSection(null)}
      />

      <SubmissionsDrawer
        courseId={courseId}
        section={submissionsSection}
        open={!!submissionsSection}
        onClose={() => setSubmissionsSection(null)}
      />
    </div>
  );
};

export default SectionList;
