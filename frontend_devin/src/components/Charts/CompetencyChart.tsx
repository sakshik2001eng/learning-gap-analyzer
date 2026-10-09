import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CompetencyChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="month" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Line 
          type="monotone" 
          dataKey="competency" 
          stroke="#2563eb" 
          strokeWidth={2}
          dot={{ fill: '#2563eb', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
