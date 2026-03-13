import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register, isAdmin, profile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('operator');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Only admin can register new users (except very first registration)
  const isFirstUser = !profile;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      // First user always becomes admin
      const assignedRole: Role = isFirstUser ? 'admin' : role;
      await register(email, password, name, assignedRole);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered');
      } else {
        setError('Registration failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-2">PowerSuraksha</h1>
        <p className="text-gray-500 mb-6 text-sm">Industrial IoT Monitoring System</p>

        <h2 className="text-xl font-bold text-gray-700 mb-1">
          {isFirstUser ? 'Create Admin Account' : 'Register New User'}
        </h2>
        {isFirstUser && (
          <p className="text-xs text-blue-600 mb-4">First account will be created as Admin</p>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min 6 characters"
            />
          </div>

          {/* Role selection only visible to admins registering new users */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as Role)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="operator">Operator — View & monitor devices</option>
                <option value="admin">Admin — Full system access</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {isFirstUser && (
          <p className="mt-4 text-sm text-gray-500 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-700 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
