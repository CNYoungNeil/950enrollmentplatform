import React from 'react';
import {
  FileTextOutlined,
  NotificationOutlined,
  ReadOutlined,
  AreaChartOutlined,
  FormOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileWordOutlined,
  FileZipOutlined,
  FileImageOutlined,
  PlayCircleOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { SECTION_TYPE, FILE_TYPE } from '../types';

export const SECTION_ICON_CONFIG: Record<
  number,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  [SECTION_TYPE.MATERIALS]: {
    icon: <FileTextOutlined />,
    color: '#1890ff',
    bg: '#e6f7ff',
    label: 'Learning Materials',
  },
  [SECTION_TYPE.ANNOUNCEMENT]: {
    icon: <NotificationOutlined />,
    color: '#ff4d4f',
    bg: '#fff1f0',
    label: 'Announcements',
  },
  [SECTION_TYPE.ARTICLE]: {
    icon: <ReadOutlined />,
    color: '#52c41a',
    bg: '#f6ffed',
    label: 'Readings',
  },
  [SECTION_TYPE.LECTURE_PRESENTATION]: {
    icon: <AreaChartOutlined />,
    color: '#faad14',
    bg: '#fffbe6',
    label: 'Lecture Slides',
  },
  [SECTION_TYPE.ASSIGNMENT]: {
    icon: <FormOutlined />,
    color: '#722ed1',
    bg: '#f9f0ff',
    label: 'Assignments',
  },
};

export const FILE_ICON_CONFIG: Record<number, { icon: React.ReactNode; color: string }> = {
  [FILE_TYPE.PDF]: { icon: <FilePdfOutlined />, color: '#ff4d4f' },
  [FILE_TYPE.DOC]: { icon: <FileWordOutlined />, color: '#2b579a' },
  [FILE_TYPE.DOCX]: { icon: <FileWordOutlined />, color: '#2b579a' },
  [FILE_TYPE.PPT]: { icon: <FilePptOutlined />, color: '#fa8c16' },
  [FILE_TYPE.PPTX]: { icon: <FilePptOutlined />, color: '#fa8c16' },
  [FILE_TYPE.ZIP]: { icon: <FileZipOutlined />, color: '#8c8c8c' },
  [FILE_TYPE.IMAGE]: { icon: <FileImageOutlined />, color: '#13c2c2' },
  [FILE_TYPE.VIDEO]: { icon: <PlayCircleOutlined />, color: '#722ed1' },
  [FILE_TYPE.OTHER]: { icon: <FileOutlined />, color: '#595959' },
};
