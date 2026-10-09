import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { Sidebar } from '../Sidebar/Sidebar';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  role: 'student' | 'teacher';
}

export const Layout = ({ role }: LayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate('/login', { replace: true });
  };

  // "Switch Role" signs out and returns to /login to pick the other role.
  const handleSwitchRole = handleLogout;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        user={user}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} role={role} onClose={closeSidebar} />

        <main className="flex-1 pt-16 lg:ml-0 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
