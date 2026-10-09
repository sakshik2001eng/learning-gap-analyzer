import React from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '../Buttons/Button';
import { User } from '../../context/AuthContext';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  user: User | null;
  onLogout: () => void;
  onSwitchRole?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  toggleSidebar,
  isSidebarOpen,
  user,
  onLogout,
  onSwitchRole,
}) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between fixed w-full top-0 z-40">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isSidebarOpen}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none lg:hidden"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="ml-4 lg:ml-0 text-xl font-bold text-gray-900">Learning Gap Analyzer</h1>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div
                aria-hidden="true"
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium"
              >
                {user.avatar || user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
            </div>
            {onSwitchRole && (
              <Button variant="outline" size="sm" onClick={onSwitchRole}>
                Switch Role
              </Button>
            )}
            <button
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              title="Log out"
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
