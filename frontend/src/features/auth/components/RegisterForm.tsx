import React from 'react';
import { Form, Input, Button, Radio, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuthNavigation } from '../hooks/useAuthNavigation';
import { USER_ROLES } from '@/types/user';
import type { RegisterParams } from '../types';

const registerSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.union([z.literal(USER_ROLES.STUDENT), z.literal(USER_ROLES.INSTRUCTOR)], {
    message: 'Please select your role',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { navigateByRole } = useAuthNavigation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: undefined as any,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      const response = await authApi.register(data as RegisterParams);
      setAuth(response.user, response.token);
      message.success('Account created successfully!');

      navigateByRole(response.user.role);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed. This email may already be in use.';
      message.error(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} size="large">
      <Form.Item
        label="Full Name"
        validateStatus={errors.name ? 'error' : ''}
        help={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter your full name"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Email Address"
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter your email"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Password"
        validateStatus={errors.password ? 'error' : ''}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Create a password"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Identity"
        validateStatus={errors.role ? 'error' : ''}
        help={errors.role?.message}
      >
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Radio.Group {...field}>
              <Radio value={USER_ROLES.STUDENT}>Student</Radio>
              <Radio value={USER_ROLES.INSTRUCTOR}>Instructor</Radio>
            </Radio.Group>
          )}
        />
      </Form.Item>

      <Form.Item className="mt-8">
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          className="h-[48px] rounded-xl font-semibold transition-all hover:translate-y-[-2px] shadow-lg shadow-blue-500/20"
        >
          Create Account
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
