import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { BookOutlined, SearchOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const { Title, Text, Paragraph } = Typography;

const StudentDashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <RocketOutlined className="text-3xl text-blue-500" />
          <Title level={2} className="!mb-0">
            Welcome back, {user?.name || 'Student'}!
          </Title>
        </div>
        <Paragraph className="text-lg text-gray-500">
          It's a great day to learn something new. What would you like to do today?
        </Paragraph>
      </div>

      {/* Quick Actions */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card
            hoverable
            className="h-full border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
            styles={{ body: { padding: '32px' } }}
            onClick={() => navigate(ROUTES.STUDENT_COURSES)}
          >
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <BookOutlined className="text-2xl text-blue-500" />
              </div>
              <div>
                <Title level={4} className="!mb-1">
                  My Enrolled Courses
                </Title>
                <Text type="secondary">
                  View and access materials for courses you've already joined.
                </Text>
              </div>
              <Button 
                type="primary" 
                size="large"
                className="rounded-xl w-44 h-12 shadow-lg shadow-blue-100 font-medium"
              >
                Go to My Courses
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            hoverable
            className="h-full border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
            styles={{ body: { padding: '32px' } }}
            onClick={() => navigate(ROUTES.COURSE_SELECTION)}
          >
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <SearchOutlined className="text-2xl text-orange-500" />
              </div>
              <div>
                <Title level={4} className="!mb-1">
                  Enroll in New Courses
                </Title>
                <Text type="secondary">
                  Explore the catalog and sign up for additional subjects.
                </Text>
              </div>
              <Button
                type="primary"
                size="large"
                className="bg-orange-500 hover:bg-orange-600 border-none rounded-xl w-44 h-12 shadow-lg shadow-orange-100 font-medium"
              >
                Browse Courses
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboardHome;
