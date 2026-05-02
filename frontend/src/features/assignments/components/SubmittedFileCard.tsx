import React from 'react';
import { Typography, Button, Space } from 'antd';
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { config } from '@/config';

const { Text } = Typography;

interface SubmittedFileCardProps {
  submission: any;
}

export const SubmittedFileCard: React.FC<SubmittedFileCardProps> = ({ submission }) => {
  const downloadUrl = submission.file_url.startsWith('http')
    ? submission.file_url
    : `${config.apiBaseUrl.replace(/\/$/, '')}${submission.file_url}`;

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between group">
      <Space>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <FileTextOutlined className="text-blue-600 text-lg" />
        </div>
        <div className="flex flex-col text-left">
          <Text strong className="text-gray-700">{submission.file_name}</Text>
          <Text type="secondary" className="text-xs">
            Submitted on {dayjs(submission.submitted_at).format('DD MMM, HH:mm')}
          </Text>
        </div>
      </Space>
      <Button
        type="text"
        icon={<DownloadOutlined />}
        href={downloadUrl}
        target="_blank"
        className="text-blue-600 hover:bg-blue-50"
      >
        Download
      </Button>
    </div>
  );
};
