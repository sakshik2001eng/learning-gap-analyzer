import React from 'react';

interface BlurTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <span
      className={`blur-text ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
};
