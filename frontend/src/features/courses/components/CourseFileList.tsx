import React from 'react';
import { Typography, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { CourseSectionFile } from '@/features/courses/types';
import { FILE_ICON_CONFIG } from '@/features/courses/constants/courseUIConfig';

const { Text } = Typography;

interface CourseFileListProps {
  files: CourseSectionFile[];
}

export const CourseFileList: React.FC<CourseFileListProps> = ({ files }) => {
  const handleDownload = (fileUrl: string) => {
    const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${fileUrl}`;
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="space-y-3">
      {files.map((file) => {
        const fileConfig = FILE_ICON_CONFIG[file.file_type] || FILE_ICON_CONFIG[9];
        return (
          <div
            key={file.id}
            onClick={() => handleDownload(file.file_url)}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="text-2xl flex items-center" style={{ color: fileConfig.color }}>
                {fileConfig.icon}
              </div>
              <div className="min-w-0 text-left">
                <Text
                  strong
                  className="block truncate text-gray-700 group-hover:text-blue-700 transition-colors"
                >
                  {file.file_name}
                </Text>
                <Text type="secondary" className="text-[12px]">
                  Click to download
                </Text>
              </div>
            </div>
            <Button
              type="text"
              icon={<DownloadOutlined className="group-hover:text-blue-600" />}
              className="text-gray-400"
            />
          </div>
        );
      })}
    </div>
  );
};
