import React from 'react';
import { Button } from 'antd';
import AuthLayout from '@/features/auth/components/AuthLayout';
import RegisterForm from '@/features/auth/components/RegisterForm';
import { ROUTES } from '@/router/routes';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our academic collaborative community"
      illustrationTitle={
        <>
          <br /> Course Collaboration Platform
        </>
      }
      illustrationDescription="A powerful workspace for seamless course management and academic collaboration."
      footer={
        <>
          Already have an account?{' '}
          <Button type="link" href={ROUTES.LOGIN} style={{ padding: 0 }}>
            Sign in
          </Button>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
