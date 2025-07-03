'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { Mail, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [fieldError, setFieldError] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);

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
      // Giả lập API call để gửi email đặt lại mật khẩu
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Thay bằng API thực tế
      setSuccess('Yêu cầu đã được gửi! Vui lòng kiểm tra email để đặt lại mật khẩu.');
      setEmail('');
      setTouched(false);
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[380px]">
          {/* Left Side - Form */}
          <div className="flex-1 p-4 lg:p-6 flex flex-col justify-center">
            {/* Logo */}
            <div className="text-center mb-10">
              <Link href="/" className="inline-flex items-center justify-center group">
                <div className="w-56 h-28 relative mx-auto">
                  <Image src="/SportHub-Logo.png" alt="SportHub Logo" fill style={{ objectFit: 'contain' }} priority />
                </div>
              </Link>
            </div>
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Quên mật khẩu</h1>
              <p className="text-gray-600 flex items-center justify-center gap-2 text-lg">
                Nhập email để nhận liên kết đặt lại mật khẩu
              </p>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8 text-base pb-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-base text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <p className="text-base text-green-700 font-medium">{success}</p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 !text-black w-6 h-6" />
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-14 pr-4 py-5 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white ${touched && fieldError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-green-500'}`}
                    placeholder="Email"
                    required
                    aria-describedby="email-error"
                  />
                  {touched && !fieldError && email.trim() && (
                    <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-6 h-6 animate-fade-in" />
                  )}
                </div>
                {touched && fieldError && (
                  <div className="flex items-center mt-2 ml-1">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-1 flex-shrink-0" />
                    <p className="text-sm text-red-600">{fieldError}</p>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                    Đang gửi...
                  </div>
                ) : (
                  'Gửi yêu cầu'
                )}
              </button>
            </form>
            <div className="mt-8 space-y-3">
              <p className="text-center text-gray-600 text-base">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold underline decoration-green-300">
                  Đăng nhập ngay
                </Link>
              </p>
              <p className="text-center text-gray-600 text-base">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold underline decoration-green-300">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
          {/* Right Side - Sports Illustration */}
          <div className="flex-1 relative overflow-hidden hidden lg:flex items-center justify-center bg-black">
            <Image
              src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Football Field"
              fill
              style={{ objectFit: 'cover', filter: 'blur(3px) brightness(0.7)' }}
              priority
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
              <div className="w-52 h-52 relative mb-6">
                <Image src="/SportHub-Logo.png" alt="SportHub Logo" fill style={{ objectFit: 'contain' }} priority />
              </div>
              <h2 className="text-4xl font-bold mb-6 text-emerald-100 drop-shadow-lg">Khôi phục tài khoản!</h2>
              <p className="text-lg text-emerald-100 max-w-md mx-auto drop-shadow-lg text-center leading-relaxed">
                Nhập email để nhận liên kết đặt lại mật khẩu và quay lại với SportHub ngay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}