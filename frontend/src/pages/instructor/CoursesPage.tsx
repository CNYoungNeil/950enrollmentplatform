import React from 'react';
import { Button, Typography, Empty, Row, Col } from 'antd';
import { PlusOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useInstructorCourses } from '@/features/courses/hooks/useInstructorCourses';
import CourseCard from '@/features/courses/components/CourseCard';
import CreateCourseModal from '@/features/courses/components/CreateCourseModal';
import { LoadingCenter } from '@/components/ui';
import { buildRoute } from '@/router/routes';
import type { Course } from '@/features/courses/types';

const { Title, Text } = Typography;

const CoursesPage: React.FC = () => {
  const [createOpen, setCreateOpen] = React.useState(false);
  const navigate = useNavigate();
  const { data: courses = [], isLoading } = useInstructorCourses();

  const handleCourseClick = (course: Course) => {
    navigate(buildRoute.instructorCourseDetail(course.id));
  };

  const handleCreateSuccess = (courseId: number) => {
    navigate(buildRoute.instructorCourseDetail(courseId));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={3} className="!mb-1">
            My Courses
          </Title>
          <Text type="secondary">Manage and configure your courses</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setCreateOpen(true)}
        >
          Create Course
        </Button>
      </div>

      {isLoading ? (
        <LoadingCenter />
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center py-24">
          <Empty
            image={<BookOutlined className="text-6xl text-blue-200" />}
            description={
              <div className="text-center mt-2">
                <Text strong className="text-base block mb-1">
                  No courses yet
                </Text>
                <Text type="secondary">Create your first course to get started</Text>
              </div>
            }
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateOpen(true)}
            >
              Create Course
            </Button>
          </Empty>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {courses.map((course) => (
            <Col key={course.id} xs={24} sm={12} lg={8} xl={6}>
              <CourseCard course={course} onClick={handleCourseClick} />
            </Col>
          ))}
        </Row>
      )}

      <CreateCourseModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default CoursesPage;
