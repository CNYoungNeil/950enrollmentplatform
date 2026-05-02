import React from 'react';
import { Typography, Upload } from 'antd';
import { InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Dragger } = Upload;

interface FileUploadZoneProps {
  onUpload: (file: File) => void;
  isPending: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onUpload, isPending }) => (
  <Dragger
    name="file"
    multiple={false}
    beforeUpload={(file) => { onUpload(file); return false; }}
    showUploadList={false}
    disabled={isPending}
    className="!bg-white !border-dashed !border-gray-200 hover:!border-blue-400 !rounded-2xl !transition-all"
  >
    <p className="ant-upload-drag-icon">
      <InboxOutlined className="text-blue-600" />
    </p>
    <p className="ant-upload-text text-gray-700 font-semibold text-center">
      {isPending ? 'Uploading...' : 'Click or drag file to this area to upload'}
    </p>
    <p className="ant-upload-hint text-gray-400 text-xs text-center mt-2">
      PDF, ZIP, DOCX supported. Max 20MB.
    </p>
    <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-xl border border-blue-100/50 mx-4">
      <ExclamationCircleOutlined className="text-blue-500 text-xs" />
      <Text type="secondary" className="text-[11px] leading-tight text-left">
        Only one file is allowed. Uploading a new file will replace your existing submission.
      </Text>
    </div>
  </Dragger>
);
