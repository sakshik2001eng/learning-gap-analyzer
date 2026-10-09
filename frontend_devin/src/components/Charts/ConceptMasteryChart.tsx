import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ConceptMasteryChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          angle={-45}
          textAnchor="end"
          height={100}
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
        <Bar 
          dataKey="mastery" 
          fill="#2563eb"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
