'use client';

import { useState } from 'react';
import { X, User, Store } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState<'customer' | 'vendor'>('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const { login, register } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password, accountType);
      } else {
        await register(formData.email, formData.password, accountType);
      }
      onClose();
      setFormData({ email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">
            {isLogin ? 'Welcome' : 'Create Account'}
            <span className="font-semibold"> Back</span>
          </h2>
          <p className="text-gray-600 mb-8">
            {isLogin ? 'Sign in to continue' : 'Join our furniture marketplace'}
          </p>

          {/* Account Type Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAccountType('customer')}
                className={`flex items-center justify-center gap-2 px-4 py-3 border-2 transition-all ${
                  accountType === 'customer'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Customer</span>
              </button>
              <button
                onClick={() => setAccountType('vendor')}
                className={`flex items-center justify-center gap-2 px-4 py-3 border-2 transition-all ${
                  accountType === 'vendor'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Store className="w-5 h-5" />
                <span className="font-medium">Vendor</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="font-semibold underline">
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 font-medium">Demo Accounts:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center justify-between p-2 bg-gray-50">
                <span>Customer: john@example.com</span>
                <button
                  onClick={() => {
                    setFormData({ email: 'john@example.com', password: 'password123', confirmPassword: '' });
                    setAccountType('customer');
                  }}
                  className="text-gray-900 hover:underline font-medium"
                >
                  Use
                </button>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50">
                <span>Vendor: vendor@furnihub.com</span>
                <button
                  onClick={() => {
                    setFormData({ email: 'vendor@furnihub.com', password: 'vendor123', confirmPassword: '' });
                    setAccountType('vendor');
                  }}
                  className="text-gray-900 hover:underline font-medium"
                >
                  Use
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}