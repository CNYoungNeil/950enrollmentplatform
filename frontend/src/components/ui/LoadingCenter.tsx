import React from 'react';
import { Spin } from 'antd';

interface Props {
  className?: string;
}

const LoadingCenter: React.FC<Props> = ({ className = 'py-24' }) => (
  <div className={`flex justify-center ${className}`}>
    <Spin size="large" />
  </div>
);

export default LoadingCenter;
