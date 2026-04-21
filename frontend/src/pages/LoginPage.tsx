import React from 'react';
import { Button } from 'antd';
import AuthLayout from '@/features/auth/components/AuthLayout';
import LoginForm from '@/features/auth/components/LoginForm';
import { ROUTES } from '@/router/routes';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome"
      subtitle="Please enter your details to sign in"
      illustrationTitle={
        <>
          <br /> Course Collaboration Platform
        </>
      }
      illustrationDescription="A powerful workspace for seamless course management and academic collaboration."
      footer={
        <>
          Don't have an account?{' '}
          <Button type="link" href={ROUTES.REGISTER} style={{ padding: 0 }}>
            Register now
          </Button>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
