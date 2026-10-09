import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  TrendingUp, 
  FileText, 
  Users, 
  BarChart3,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from '../../utils/cn';

const menuItems = {
  student: [
    { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/student/gaps', icon: Target, label: 'Learning Gaps' },
    { path: '/student/learning-path', icon: BookOpen, label: 'Learning Path' },
    { path: '/student/quizzes', icon: FileText, label: 'Quizzes' },
    { path: '/student/progress', icon: TrendingUp, label: 'Progress' },
  ],
  teacher: [
    { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/teacher/students', icon: Users, label: 'Students' },
    { path: '/teacher/gaps', icon: Target, label: 'Learning Gaps' },
    { path: '/teacher/materials', icon: Upload, label: 'Study Materials' },
    { path: '/teacher/reports', icon: FileSpreadsheet, label: 'Reports' },
  ],
};

export const Sidebar = ({ isOpen, role, onClose }) => {
  const location = useLocation();
  const items = menuItems[role] || [];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon className={cn('w-5 h-5 mr-3', isActive ? 'text-blue-600' : 'text-gray-400')} />
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Learning Gap Analyzer v1.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
