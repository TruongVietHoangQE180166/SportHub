'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { RegisterData } from '@/types/auth';
import Image from 'next/image';
import MeteorShower from './background2';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterData & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const { register } = useAuthStore();
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'username':
        return !value.trim() ? 'Vui lòng nhập tên đăng nhập' : '';
      case 'email':
        if (!value.trim()) return 'Vui lòng nhập email';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email không hợp lệ';
        return '';
      case 'password':
        if (!value) return 'Vui lòng nhập mật khẩu';
        if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        return '';
      case 'confirmPassword':
        if (!value) return 'Vui lòng xác nhận mật khẩu';
        if (value !== formData.password) return 'Mật khẩu xác nhận không khớp';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const fieldError = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
    
    // Also validate confirmPassword when password changes
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setFieldErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
    
    // Clear general error when user starts typing
    if (error) setError('');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    const errors = {
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword)
    };
    
    setFieldErrors(errors);
    setTouched({ username: true, email: true, password: true, confirmPassword: true });
    
    // Check if any field has error
    const hasFieldErrors = Object.values(errors).some(error => error !== '');
    
    if (!acceptTerms) {
      setError('Vui lòng đồng ý với điều khoản sử dụng');
      return false;
    }
    
    return !hasFieldErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const registerData: RegisterData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      await register(registerData);
      
      // Navigate to the OTP verification page with email as state
      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`); 
    } catch (err: unknown) {
      const error = err as Error;
      // Show server error message or fallback to default message
      setError(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MeteorShower className="p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6">
          {/* Logo - Compact */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center justify-center group">
              <div className="w-50 h-14 relative mx-auto">
                <Image src="/SportHub-Logo.png" alt="SportHub Logo" fill style={{ objectFit: 'contain' }} priority />
              </div>
            </Link>
          </div>

          {/* Header - Compact */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Tham gia cộng đồng</h1>
            <p className="text-gray-600 text-sm">
              Bắt đầu hành trình thể thao của bạn
            </p>
          </div>

          {/* Google Button - Compact */}
          <div className="mb-4">
            <button 
              type="button" 
              onClick={() => window.location.href = 'https://sporthub-gdefgpgtf9h0g6gk.malaysiawest-01.azurewebsites.net/oauth2/authorization/google'}
              className="w-full bg-white border-2 border-gray-200 hover:border-green-300 rounded-xl py-3 px-4 font-semibold text-gray-700 flex items-center justify-center transition-all duration-300 hover:shadow-lg group text-sm"
            >
              <div className="bg-white p-1 rounded-full shadow-sm mr-2 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4" viewBox="0 0 533.5 544.3">
                  <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
                  <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
                  <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
                  <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
                </svg>
              </div>
              Đăng ký với Google
            </button>
          </div>

          {/* Divider */}
            <div className="relative my-4">
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="px-3 text-xs text-gray-500 font-medium">Hoặc tiếp tục với email</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* General Error Display - only for terms and server errors */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 bg-white text-sm ${
                    touched.username && fieldErrors.username 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Tên đăng nhập"
                  required
                />
              </div>
              {touched.username && fieldErrors.username && (
                <div className="flex items-center mt-1 ml-1">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                  <p className="text-xs text-red-600">{fieldErrors.username}</p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 bg-white text-sm ${
                    touched.email && fieldErrors.email 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Email"
                  required
                />
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
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 bg-white text-sm ${
                    touched.password && fieldErrors.password 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Mật khẩu"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <div className="flex items-center mt-1 ml-1">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                  <p className="text-xs text-red-600">{fieldErrors.password}</p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 bg-white text-sm ${
                    touched.confirmPassword && fieldErrors.confirmPassword 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Xác nhận mật khẩu"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <div className="flex items-center mt-1 ml-1">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                  <p className="text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                </div>
              )}
            </div>

            <div className="flex items-start space-x-2 pt-1">
              <div className="relative">
                <input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (e.target.checked && error.includes('điều khoản')) {
                      setError('');
                    }
                  }}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>
              <label htmlFor="accept-terms" className="text-xs text-gray-600 leading-relaxed">
                Tôi đồng ý với{' '}
                <Link href="/terms" className="text-green-600 hover:text-green-700 font-medium underline decoration-green-300 transition-colors">
                  Điều khoản sử dụng
                </Link>
                {' '}và{' '}
                <Link href="/privacy" className="text-green-600 hover:text-green-700 font-medium underline decoration-green-300 transition-colors">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold py-3 px-4 rounded-xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo tài khoản...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Tạo tài khoản
                </div>
              )}
            </button>

            <p className="text-center text-gray-600 mt-4 text-sm">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold underline decoration-green-300 transition-colors">
                Đăng nhập ngay
              </Link>
            </p>
          </form>
        </div>
      </div>
    </MeteorShower>
  );
}