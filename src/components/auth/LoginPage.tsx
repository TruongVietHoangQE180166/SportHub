'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Check, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { LoginCredentials } from '@/types/auth';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [remember, setRemember] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Vui lòng nhập email';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email không hợp lệ';
        return '';
      case 'password':
        if (!value) return 'Vui lòng nhập mật khẩu';
        if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    if (error) setError('');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    const errors = {
      email: validateField('email', email),
      password: validateField('password', password)
    };
    setFieldErrors(errors);
    setTouched({ email: true, password: true });
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const credentials: LoginCredentials = { email, password };
      await login(credentials);
      router.push('/');
    } catch {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[280px]">
          {/* Left Side - Form */}
          <div className="flex-1 p-4 lg:p-6 flex flex-col justify-center">
            {/* Logo */}
            <div className="text-center mb-6">
              <Link href="/" className="inline-flex items-center justify-center group">
                <div className="w-48 h-20 relative mr-0 mx-auto">
                  <Image src="/SportHub-Logo.png" alt="SportHub Logo" fill style={{ objectFit: 'contain' }} priority />
                </div>
              </Link>
            </div>
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
              <p className="text-gray-600 flex items-center justify-center gap-2 text-base">
                Chào mừng bạn quay lại với SportHub
              </p>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 !text-black w-5 h-5" />
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white ${touched.email && fieldErrors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-green-500'}`}
                    placeholder="Email"
                    required
                  />
                  {touched.email && !fieldErrors.email && email.trim() && (
                    <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5 animate-fade-in" />
                  )}
                </div>
                {touched.email && fieldErrors.email && (
                  <div className="flex items-center mt-1 ml-1">
                    <AlertCircle className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                    <p className="text-xs text-red-600">{fieldErrors.email}</p>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 !text-black w-5 h-5" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white ${touched.password && fieldErrors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-green-500'}`}
                    placeholder="Mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {touched.password && !fieldErrors.password && password.length >= 6 && (
                    <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5 animate-fade-in" />
                  )}
                </div>
                {touched.password && fieldErrors.password && (
                  <div className="flex items-center mt-1 ml-1">
                    <AlertCircle className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                    <p className="text-xs text-red-600">{fieldErrors.password}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-green-600 hover:text-green-700">
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  'Đăng nhập'
                )}
              </button>
              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-white text-gray-500 font-medium">Hoặc</span>
                </div>
              </div>
              {/* Social Login */}
              <button className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Đăng nhập với Google
              </button>
            </form>
            <p className="text-center text-gray-600 mt-4">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold underline decoration-green-300">
                Đăng ký ngay
              </Link>
            </p>
          </div>
          {/* Right Side - Sports Illustration */}
          <div className="flex-1 relative overflow-hidden hidden lg:flex items-center justify-center bg-black">
            <Image src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="Football Field" fill style={{ objectFit: 'cover', filter: 'blur(3px) brightness(0.7)' }} priority />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
              <div className="w-40 h-40 relative mb-4">
                <Image src="/SportHub-Logo.png" alt="SportHub Logo" fill style={{ objectFit: 'contain' }} priority />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-emerald-100 drop-shadow-lg">Chào mừng trở lại!</h2>
              <p className="text-base text-emerald-100 max-w-sm mx-auto drop-shadow-lg text-center leading-relaxed">
                Đăng nhập để tiếp tục kết nối, đặt sân và quản lý hoạt động thể thao cùng SportHub.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}