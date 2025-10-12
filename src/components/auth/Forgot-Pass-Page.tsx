'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '../../stores/authStore';
import MeteorShower from './background2';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [fieldError, setFieldError] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);
  
  const { sendOTP } = useAuthStore();
  const router = useRouter();

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'Vui lòng nhập email';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Email không hợp lệ';
    return '';
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    setFieldError(validateEmail(value));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const emailError = validateEmail(email);
    setFieldError(emailError);
    setTouched(true);
    if (emailError) return;

    setIsLoading(true);
    try {
      // Use the actual sendOTP function from authStore
      await sendOTP(email);
      setSuccess('Yêu cầu đã được gửi! Vui lòng kiểm tra email để đặt lại mật khẩu.');
      
      // Redirect to reset password page with email as parameter
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MeteorShower className="p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-10">
          {/* Logo - Compact */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center group">
              <div className="w-50 h-14 relative mx-auto">
                <Image src="/SportHub-Logo.png" alt="SportHub Logo" fill style={{ objectFit: 'contain' }} priority />
              </div>
            </Link>
          </div>
          
          {/* Header - Compact */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Quên mật khẩu</h1>
            <p className="text-gray-600 text-sm">
              Nhập email để nhận liên kết đặt lại mật khẩu
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-medium">{success}</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-3 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 bg-white text-sm ${touched && fieldError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-green-500'}`}
                  placeholder="Email"
                  required
                  aria-describedby="email-error"
                />
                {touched && !fieldError && email.trim() && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4 animate-fade-in" />
                )}
              </div>
              {touched && fieldError && (
                <div className="flex items-center mt-1 ml-1">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                  <p className="text-xs text-red-600">{fieldError}</p>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              // Increased py-3 to py-4 for taller button
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang gửi...
                </div>
              ) : (
                'Gửi yêu cầu'
              )}
            </button>
          </form>
          <div className="mt-8 pt-6 space-y-3 text-center">
            <p className="text-xs text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                Đăng nhập
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MeteorShower>
  );
}