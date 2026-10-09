import React from 'react';
import { Brain } from 'lucide-react';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-10">
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Brain className="w-16 h-16 text-blue-600" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8">{children}</div>
    </div>
  </div>
);

export const inputClass =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none';
