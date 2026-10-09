import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../components/Buttons/Button';
import { AuthShell, inputClass } from '../components/Auth/AuthShell';
import { RoleSelector } from '../components/Auth/RoleSelector';
import { dashboardFor } from '../components/Auth/ProtectedRoute';
import { Role, useAuth } from '../context/AuthContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const Signup = () => {
  const navigate = useNavigate();
  const { user, signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to={dashboardFor(user.role)} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your full name.');
    if (!EMAIL_PATTERN.test(email.trim())) return setError('Please enter a valid email address.');
    if (password.length < MIN_PASSWORD_LENGTH) {
      return setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }
    setError('');
    signup(email.trim(), password, name.trim(), role);
    navigate(dashboardFor(role), { replace: true });
  };

  return (
    <AuthShell title="Create Account" subtitle="Join the Learning Gap Analyzer">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {error && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="John Doe"
          />
        </div>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          />
        </div>

        <RoleSelector value={role} onChange={setRole} />

        <Button type="submit" size="lg" className="w-full">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};
