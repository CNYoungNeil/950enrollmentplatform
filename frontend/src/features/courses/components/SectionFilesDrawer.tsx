import React from 'react';
import {
  Drawer,
  List,
  Button,
  Upload,
  Tooltip,
  Popconfirm,
  Typography,
  Space,
  Tag,
  message,
  Empty,
  Spin,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FilePptOutlined,
  FileZipOutlined,
  FileImageOutlined,
  PlayCircleOutlined,
  FileOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { useSectionFiles } from '../hooks/useSectionFiles';
import {
  useUploadSectionFile,
  useDeleteSectionFile,
  useUpdateSectionFile,
} from '../hooks/useFileMutations';
import { FILE_TYPE, FILE_TYPE_LABELS } from '../types';
import type { CourseSection, CourseSectionFile, FileType } from '../types';

const { Text } = Typography;

const ACCEPTED_TYPES =
  '.pdf,.doc,.docx,.ppt,.pptx,.zip,.jpg,.jpeg,.png,.gif,.webp,.mp4,.avi,.mov,.mkv';

const FILE_ICON: Record<FileType, React.ReactElement> = {
  [FILE_TYPE.PDF]: <FilePdfOutlined className="text-red-500 text-lg" />,
  [FILE_TYPE.DOC]: <FileWordOutlined className="text-blue-500 text-lg" />,
  [FILE_TYPE.DOCX]: <FileWordOutlined className="text-blue-500 text-lg" />,
  [FILE_TYPE.PPT]: <FilePptOutlined className="text-orange-500 text-lg" />,
  [FILE_TYPE.PPTX]: <FilePptOutlined className="text-orange-500 text-lg" />,
  [FILE_TYPE.ZIP]: <FileZipOutlined className="text-yellow-500 text-lg" />,
  [FILE_TYPE.IMAGE]: <FileImageOutlined className="text-green-500 text-lg" />,
  [FILE_TYPE.VIDEO]: <PlayCircleOutlined className="text-purple-500 text-lg" />,
  [FILE_TYPE.OTHER]: <FileOutlined className="text-gray-400 text-lg" />,
};

interface Props {
  courseId: number;
  section: CourseSection | null;
  open: boolean;
  onClose: () => void;
}

const SectionFilesDrawer: React.FC<Props> = ({ courseId, section, open, onClose }) => {
  const sectionId = section?.id ?? null;

  const { data: files = [], isLoading } = useSectionFiles(courseId, sectionId);
  const { mutate: uploadFile, isPending: isUploading } = useUploadSectionFile(
    courseId,
    sectionId ?? 0,
  );
  const { mutate: deleteFile } = useDeleteSectionFile(courseId, sectionId ?? 0);
  const { mutate: updateFile } = useUpdateSectionFile(courseId, sectionId ?? 0);

  const sorted = [...files].sort((a, b) => a.display_order - b.display_order);

  const handleUpload = ({ file, onSuccess, onError }: UploadRequestOption) => {
    uploadFile(file as File, {
      onSuccess: () => {
        message.success(`${(file as File).name} uploaded successfully`);
        onSuccess?.('ok');
      },
      onError: () => {
        message.error(`Failed to upload ${(file as File).name}`);
        onError?.(new Error('Upload failed'));
      },
    });
  };

  const handleDelete = (fileId: number, fileName: string) => {
    deleteFile(fileId, {
      onSuccess: () => message.success(`${fileName} deleted`),
      onError: () => message.error('Failed to delete file'),
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = sorted[index];
    const swapWith = direction === 'up' ? sorted[index - 1] : sorted[index + 1];
    if (!swapWith) return;
    const targetOrder = target.display_order;
    const swapOrder = swapWith.display_order;
    updateFile({ fileId: target.id, params: { display_order: swapOrder } });
    updateFile({ fileId: swapWith.id, params: { display_order: targetOrder } });
  };

  const renderFileItem = (file: CourseSectionFile, index: number) => (
    <List.Item
      key={file.id}
      className="!px-3 !py-2 mb-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
      actions={[
        <Space size={2} key="file-actions">
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
          <Popconfirm
            title="Delete this file?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(file.id, file.file_name)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>,
      ]}
    >
      <div className="flex items-center gap-3 min-w-0">
        {FILE_ICON[file.file_type]}
        <div className="min-w-0 flex-1">
          <Text
            className="block text-sm font-medium truncate"
            title={file.file_name}
          >
            {file.file_name}
          </Text>
          <div className="flex items-center gap-2 mt-0.5">
            <Tag className="!text-xs !px-1 !py-0 !leading-4">
              {FILE_TYPE_LABELS[file.file_type]}
            </Tag>
            <Text type="secondary" className="text-xs">
              {new Date(file.created_at).toLocaleDateString()}
            </Text>
          </div>
        </div>
      </div>
    </List.Item>
  );

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <PaperClipOutlined />
          <span className="truncate" title={section?.title}>
            {section?.title ?? 'Files'}
          </span>
        </div>
      }
      open={open}
      onClose={onClose}
      width={480}
      destroyOnClose
      footer={
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          multiple
          accept={ACCEPTED_TYPES}
          disabled={isUploading}
        >
          <Button
            type="primary"
            icon={<UploadOutlined />}
            loading={isUploading}
            className="w-full"
            size="large"
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </Upload>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spin />
        </div>
      ) : sorted.length === 0 ? (
        <Empty
          image={<PaperClipOutlined className="text-5xl text-gray-300" />}
          description={
            <div className="text-center">
              <Text strong className="block mb-1">
                No files yet
              </Text>
              <Text type="secondary" className="text-sm">
                Click "Upload Files" below to add materials
              </Text>
            </div>
          }
          className="py-12"
        />
      ) : (
        <>
          <Text type="secondary" className="text-xs mb-3 block">
            {sorted.length} file{sorted.length !== 1 ? 's' : ''}
          </Text>
          <List dataSource={sorted} renderItem={renderFileItem} />
        </>
      )}
    </Drawer>
  );
};

export default SectionFilesDrawer;
