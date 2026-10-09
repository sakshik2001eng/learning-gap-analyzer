import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Buttons/Button';
import { AuthShell, inputClass } from '../components/Auth/AuthShell';
import { RoleSelector } from '../components/Auth/RoleSelector';
import { dashboardFor } from '../components/Auth/ProtectedRoute';
import { Role, useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [error, setError] = useState('');

  // Already signed in: skip the login form.
  if (user) {
    return <Navigate to={dashboardFor(user.role)} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    login(email.trim(), password, role);

    // Return to the page the user originally asked for, if it matches their role.
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
    const target = from && from.startsWith(`/${role}`) ? from : dashboardFor(role);
    navigate(target, { replace: true });
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {error && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        <RoleSelector value={role} onChange={setRole} />

        <Button type="submit" size="lg" className="w-full">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
};
