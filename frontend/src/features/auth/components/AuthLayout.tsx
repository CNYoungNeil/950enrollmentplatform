import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  illustrationTitle: React.ReactNode;
  illustrationDescription: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  illustrationTitle,
  illustrationDescription,
  children,
  footer,
}) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen overflow-hidden">
      {/* Visual illustration (Desktop only) */}
      <div className="hidden md:flex md:flex-[1.2] relative auth-gradient px-20 flex-col justify-center text-white">
        <div
          className="absolute inset-0 z-1 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: 'url("/auth-bg.png")' }}
        />

        <div className="relative z-10">
          <Title level={1} className="!text-white !text-5xl !mb-6 !font-extrabold !leading-tight">
            {illustrationTitle}
          </Title>
          <Paragraph className="!text-white/85 !text-lg max-w-[460px] !leading-relaxed">
            {illustrationDescription}
          </Paragraph>
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex justify-center items-center bg-gradient-to-br from-[#E6F7FF] to-[#BAE7FF] p-6 md:p-0 w-full relative">
        <Card
          variant="borderless"
          className="glass-card w-full max-w-[420px] !p-0 md:!p-4 border-none md:!bg-white/80"
        >
          <div className="text-center mb-8">
            <Title level={2} className="!m-0 !mb-2 !text-[#1F1E33]">
              {title}
            </Title>
            <Text type="secondary" className="!m-0">
              {subtitle}
            </Text>
          </div>

          {children}

          {footer && (
            <div className="text-center mt-6">
              <Text type="secondary">{footer}</Text>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
