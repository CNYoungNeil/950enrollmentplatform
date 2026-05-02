import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ROUTES } from '@/router/routes';
import { DASHBOARD_CONFIG } from './config';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isInstructor } = useCurrentUser();
  const { clearAuth } = useAuthStore();

  const config = user ? DASHBOARD_CONFIG[user.role] : null;

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.LOGIN);
  };

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
        danger: true,
      },
    ],
  };

  if (!config) return null;

  return (
    <Layout className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        theme="light"
        width={260}
        className="shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20"
        style={{ 
          minHeight: '100vh',
          position: 'sticky',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="h-20 flex items-center px-6 mb-4">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg italic">G</span>
          </div>
          {!collapsed && (
            <Title level={4} className="!m-0 !text-gray-800 !text-lg !font-bold tracking-tight">
              {config.title}
            </Title>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={config.menuItems.map((item) => ({
            key: item.path,
            icon: React.createElement(item.icon, { style: { fontSize: '18px' } }),
            label: <span className="font-medium">{item.label}</span>,
            onClick: () => navigate(item.path),
          }))}
          className="border-none px-3"
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout style={{ background: '#F8FAFC' }}>
        <Header 
          className="sticky top-0 z-10 w-full flex items-center justify-between px-8 h-20 border-b border-gray-100/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          style={{ background: 'white', padding: 0 }}
        >
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 text-lg w-10 h-10 flex items-center justify-center hover:!bg-gray-50 rounded-xl"
            />
          </div>

          <Space size={20}>
            <Button
              type="text"
              icon={<BellOutlined />}
              className="text-lg text-gray-400 hover:!text-blue-600 w-10 h-10 flex items-center justify-center rounded-xl"
            />
            <div className="h-6 w-[1px] bg-gray-100 mx-2" />
            <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
              <Space className="cursor-pointer hover:bg-gray-50 p-1.5 pr-3 rounded-2xl transition-all duration-200 group">
                <Avatar
                  icon={<UserOutlined />}
                  className="bg-blue-50 text-blue-600 border-none shadow-sm"
                  size={40}
                />
                <div className="hidden sm:flex flex-col leading-tight">
                  <Text
                    strong
                    className="text-[14px] text-gray-700 group-hover:text-blue-600 transition-colors"
                  >
                    {user?.name}
                  </Text>
                  <Text className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                    {isInstructor ? 'Instructor' : 'Student'}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content 
          className="min-h-[calc(100vh-80px)] overflow-auto" 
          style={{ background: '#F8FAFC' }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
