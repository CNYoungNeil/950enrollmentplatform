import { Layout, Menu } from 'antd';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const { Header, Sider, Content } = Layout;

const StudentLayout = () => {
  const token = useAuthStore((state) => state.token);
  console.log('current token:', token);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          Course Platform
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={[
            { key: 'courses', label: 'My Courses' },
            { key: 'assignments', label: 'Assignments' },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 500 }}>Student Portal</span>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 'calc(100vh - 64px - 48px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export { StudentLayout };
