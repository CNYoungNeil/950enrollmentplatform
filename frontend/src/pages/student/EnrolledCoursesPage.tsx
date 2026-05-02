import React from 'react';
import { Typography, Row, Col, Empty, Button } from 'antd';
import { BookOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMyCourses } from '@/features/courses/hooks/useMyCourses';
import CourseCard from '@/features/courses/components/CourseCard';
import { LoadingCenter } from '@/components/ui';
import { ROUTES, buildRoute } from '@/router/routes';

const { Title, Text } = Typography;

const EnrolledCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: courses = [], isLoading } = useMyCourses();

  const handleCourseClick = (course: any) => {
    navigate(buildRoute.studentCourseDetail(course.id));
  };

  if (isLoading) {
    return <LoadingCenter />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <Title level={2} className="!mb-1">My Enrolled Courses</Title>
        <Text type="secondary" className="text-lg">
          Access your courses and start learning.
        </Text>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm flex flex-col items-center justify-center py-24 border border-dashed border-gray-200">
          <Empty
            image={<BookOutlined className="text-6xl text-blue-200" />}
            description={
              <div className="text-center mt-4">
                <Text strong className="text-xl block mb-2">
                  No courses enrolled yet
                </Text>
                <Text type="secondary" className="text-gray-400">
                  You haven't joined any courses yet. Visit the catalog to find subjects you like.
                </Text>
              </div>
            }
          >
            <Button
              type="primary"
              size="large"
              icon={<ShopOutlined />}
              onClick={() => navigate(ROUTES.COURSE_SELECTION)}
              className="mt-6 rounded-xl h-12 px-8 font-semibold shadow-lg shadow-blue-100"
            >
              Explore Catalog
            </Button>
          </Empty>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {courses.map((course) => (
            <Col key={course.id} xs={24} sm={12} lg={8} xl={6}>
              <CourseCard 
                course={course} 
                onClick={handleCourseClick} 
                showStatus={false} 
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default EnrolledCoursesPage;
