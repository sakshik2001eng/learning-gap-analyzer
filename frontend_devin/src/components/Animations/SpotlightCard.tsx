import React from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({ 
  children, 
  className = '', 
  style,
  onMouseMove 
}) => {
  return (
    <div 
      className={`spotlight-card ${className}`}
      style={style}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  );
};
