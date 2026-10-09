import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-indigo-100 text-indigo-800',
  };
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    high: { variant: 'danger', label: 'High' },
    medium: { variant: 'warning', label: 'Medium' },
    low: { variant: 'success', label: 'Low' },
  };
  
  const config = priorityConfig[priority] || priorityConfig.medium;
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const SeverityBadge = ({ severity }) => {
  const severityConfig = {
    critical: { variant: 'danger', label: 'Critical' },
    high: { variant: 'danger', label: 'High' },
    medium: { variant: 'warning', label: 'Medium' },
    low: { variant: 'success', label: 'Low' },
  };
  
  const config = severityConfig[severity] || severityConfig.medium;
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
