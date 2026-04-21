import React from 'react';
import { Form, Input, Button, message } from 'antd';

import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuthNavigation } from '../hooks/useAuthNavigation';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { navigateByRole } = useAuthNavigation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await authApi.login(data);
      setAuth(response.user, response.token);
      message.success('Login successful!');

      navigateByRole(response.user.role);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Invalid email or password. Please try again.';
      message.error(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} size="large">
      <Form.Item validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email address"
            />
          )}
        />
      </Form.Item>

      <Form.Item validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Password"
            />
          )}
        />
      </Form.Item>

      <Form.Item className="mt-8 mb-0">
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          className="h-[48px] rounded-xl font-semibold transition-all hover:translate-y-[-2px] shadow-lg shadow-blue-500/20"
        >
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
