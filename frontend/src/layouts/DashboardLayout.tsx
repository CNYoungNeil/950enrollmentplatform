import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Card } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/router/routes';
import { DASHBOARD_CONFIG } from './config';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();

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
    <Layout className="min-h-screen bg-[#F0F2F5]">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        theme="light"
        width={240}
        className="shadow-sm z-10 overflow-hidden"
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <Title level={4} className="!m-0 !text-primary !whitespace-nowrap">
            {!collapsed ? config.title : '950'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={config.menuItems.map((item) => ({
            key: item.path,
            icon: item.icon,
            label: item.label,
            onClick: () => navigate(item.path),
          }))}
          className="border-r-0"
        />
      </Sider>

      <Layout>
        <Header className="bg-[#001529] pr-6 pl-2 flex items-center justify-between border-b border-[#002140]">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-white text-lg w-12 h-12 flex items-center justify-center hover:!bg-white/10"
            />
          </div>

          <Space size={24}>
            <Button
              type="text"
              icon={<BellOutlined />}
              className="text-lg text-white/80 hover:!text-white"
            />
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space className="cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
                <Avatar icon={<UserOutlined />} className="bg-primary" />
                <div className="hidden sm:flex flex-col leading-none">
                  <Text strong className="text-sm text-white">
                    {user?.name}
                  </Text>
                  <Text className="text-[11px] text-white/60">
                    Role ID: {user?.role}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="p-6">
          <div className="h-full min-h-[calc(100vh-128px)] flex items-center justify-center bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <Title level={3} className="!mb-2">
                Dashboard
              </Title>
              <Text type="secondary" className="text-lg block">
                {config.welcomeDescription}
              </Text>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
