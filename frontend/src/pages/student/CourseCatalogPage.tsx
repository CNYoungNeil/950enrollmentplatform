import React, { useState, useMemo } from 'react';
import { Typography, Table, Input, Button, Space, Modal, Tag } from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useAvailableCourses } from '@/features/courses/hooks/useAvailableCourses';
import { useMyCourses } from '@/features/courses/hooks/useMyCourses';
import { useEnrollmentAction } from '@/features/courses/hooks/useEnrollmentAction';
import { LoadingCenter } from '@/components/ui';
import type { Course } from '@/features/courses/types';

const { Title, Text, Paragraph } = Typography;

const CourseCatalogPage: React.FC = () => {
  const [activeSearchText, setActiveSearchText] = useState('');
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  const handleSearch = (value: string) => {
    setActiveSearchText(value);
  };

  // Data Fetching
  const { data: allCourses = [], isLoading: isMarketLoading } = useAvailableCourses();
  const { data: myCourses = [], isLoading: isMyCoursesLoading } = useMyCourses();
  const { mutate: enroll, isPending: isEnrolling } = useEnrollmentAction();

  // Logic: Identify which courses are already enrolled
  const myCourseIds = useMemo(() => new Set(myCourses.map((c) => c.id)), [myCourses]);

  // Logic: Client-side filtering based on status and active search text
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const isPublished = course.status === 2;
      const matchesSearch =
        course.course_code.toLowerCase().includes(activeSearchText.toLowerCase()) ||
        course.title.toLowerCase().includes(activeSearchText.toLowerCase());

      return isPublished && matchesSearch;
    });
  }, [allCourses, activeSearchText]);

  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'course_code',
      key: 'course_code',
      render: (code: string) => (
        <Tag color="blue" className="font-mono">
          {code}
        </Tag>
      ),
      width: 150,
    },
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <Text strong>{title}</Text>,
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'action',
      width: 200,
      render: (_: any, record: Course) => {
        const isEnrolled = myCourseIds.has(record.id);

        return (
          <Space size="middle">
            <Button type="text" icon={<EyeOutlined />} onClick={() => setViewingCourse(record)}>
              View
            </Button>

            {isEnrolled ? (
              <Tag
                icon={<CheckCircleOutlined />}
                color="success"
                className="px-3 py-1 rounded-full"
              >
                Enrolled
              </Tag>
            ) : (
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                loading={isEnrolling}
                onClick={() => enroll(record.id)}
                className="rounded-lg"
              >
                Enroll
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  if (isMarketLoading || isMyCoursesLoading) {
    return <LoadingCenter />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Title level={2} className="!mb-1">
            Enroll Courses
          </Title>
          <Text type="secondary">Browse the catalog and join new courses.</Text>
        </div>

        <Input.Search
          placeholder="Search by code or title..."
          onSearch={handleSearch}
          size="large"
          className="max-w-md custom-search"
          allowClear
          enterButton={
            <Button
              type="primary"
              icon={<SearchOutlined />}
              className="bg-blue-600 border-blue-600"
            >
              Search
            </Button>
          }
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showTotal: (total) => `Total ${total} courses`,
            className: 'pt-4',
          }}
        />
      </div>

      {/* Course Detail Modal */}
      <Modal
        title={null}
        open={!!viewingCourse}
        onCancel={() => setViewingCourse(null)}
        footer={[
          <Button key="close" onClick={() => setViewingCourse(null)} className="rounded-lg">
            Close
          </Button>,
          viewingCourse && !myCourseIds.has(viewingCourse.id) && (
            <Button
              key="enroll"
              type="primary"
              loading={isEnrolling}
              onClick={() => {
                enroll(viewingCourse.id);
                setViewingCourse(null);
              }}
              className="rounded-lg"
            >
              Enroll Now
            </Button>
          ),
        ].filter(Boolean)}
        centered
        width={600}
        styles={{ body: { padding: '32px' } }}
      >
        {viewingCourse && (
          <div>
            <Tag color="blue" className="mb-3">
              {viewingCourse.course_code}
            </Tag>
            <Title level={3} className="!mt-0 !mb-4">
              {viewingCourse.title}
            </Title>
            <Text type="secondary" className="block mb-2 font-medium">
              Description
            </Text>
            <Paragraph className="text-gray-600 leading-relaxed text-lg">
              {viewingCourse.description || 'No description available for this course.'}
            </Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourseCatalogPage;
