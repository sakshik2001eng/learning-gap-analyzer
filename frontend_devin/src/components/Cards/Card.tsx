import React from 'react';

export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${
        hover ? 'hover:shadow-md transition-shadow duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const KPICard = ({ title, value, icon: Icon, trend, trendValue, className = '' }) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };
  
  return (
    <Card hover className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendColors[trend]}`}>
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>
    </Card>
  );
};
