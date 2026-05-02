import React from 'react';
import { Typography, Button, Breadcrumb } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { ROUTES } from '@/router/routes';
import { Link } from 'react-router-dom';

const { Text } = Typography;

interface CourseDetailHeaderProps {
  course: any;
  onMenuClick: () => void;
}

export const CourseDetailHeader: React.FC<CourseDetailHeaderProps> = ({ course, onMenuClick }) => {
  if (!course) return null;

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/50">
      <div className="px-10 py-8">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-6 min-w-0">
            {/* Nav Toggle Button */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={onMenuClick}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"
            />

            <div className="flex flex-col min-w-0 text-left">
              <Breadcrumb
                className="mb-1 text-[11px] uppercase tracking-wider font-semibold text-gray-400"
                items={[
                  {
                    title: (
                      <Link to={ROUTES.DASHBOARD} className="hover:text-blue-600">
                        Dashboard
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <Link to={ROUTES.STUDENT_COURSES} className="hover:text-blue-600">
                        Courses
                      </Link>
                    ),
                  },
                  { title: course.course_code },
                ]}
              />

              <div className="flex items-baseline gap-3 min-w-0">
                <Text className="!m-0 !text-2xl !font-extrabold tracking-tight text-gray-900 truncate">
                  <span className="text-blue-600 mr-2">{course.course_code}</span>
                  {course.title}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
