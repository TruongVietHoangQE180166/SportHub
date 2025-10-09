'use client';
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, AlertCircle, Timer, RefreshCw, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isClient, setIsClient] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60); // 5 minutes countdown for password reset
  const [isResending, setIsResending] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  
  const { resetPassword, sendOTP } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setIsClient(true);
    // Get user's email from router query parameters
    const email = searchParams.get('email') || '';
    setUserEmail(email);
    
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [searchParams]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Password strength calculation
  useEffect(() => {
    let strength = 0;
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[a-z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    setPasswordStrength(strength);
  }, [newPassword]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: 'Rất yếu', color: 'text-red-500', bgColor: 'bg-red-500' };
      case 2:
        return { text: 'Yếu', color: 'text-orange-500', bgColor: 'bg-orange-500' };
      case 3:
        return { text: 'Trung bình', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
      case 4:
        return { text: 'Mạnh', color: 'text-blue-500', bgColor: 'bg-blue-500' };
      case 5:
        return { text: 'Rất mạnh', color: 'text-green-500', bgColor: 'bg-green-500' };
      default:
        return { text: '', color: '', bgColor: '' };
    }
  };

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;
    if (value !== '' && !/^\d$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (error) setError('');
    if (success) setSuccess('');

    // Move to next input if value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      const newOtpValues = [...otpValues];
      if (otpValues[index] === '' && index > 0) {
        // Move to previous input and clear it
        newOtpValues[index - 1] = '';
        setOtpValues(newOtpValues);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        newOtpValues[index] = '';
        setOtpValues(newOtpValues);
      }
    }
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newOtpValues = pastedData.split('');
      setOtpValues(newOtpValues);
      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');
    try {
      // Use the actual sendOTP function from authStore
      await sendOTP(userEmail);
      setCountdown(300); // Reset countdown to 5 minutes
      setOtpValues(['', '', '', '', '', '']); // Clear OTP inputs
      inputRefs.current[0]?.focus(); // Focus first input
      setSuccess('Mã OTP mới đã được gửi đến email của bạn');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.');
    } finally {
      setIsResending(false);
    }
  };

  const validatePassword = () => {
    if (newPassword.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (!/(?=.*[a-z])/.test(newPassword)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ thường';
    }
    if (!/(?=.*[A-Z])/.test(newPassword)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
    }
    if (!/(?=.*\d)/.test(newPassword)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ số';
    }
    if (newPassword !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const otpString = otpValues.join('');
    
    if (otpString.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số mã OTP');
      return;
    }

    if (countdown === 0) {
      setError('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
      return;
    }

    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);
    try {
      // Use the actual resetPassword function from authStore
      await resetPassword(userEmail, otpString, newPassword);
      
      setSuccess('Đặt lại mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra. Vui lòng kiểm tra lại mã OTP và thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  const isFormValid = otpValues.every(value => value !== '') && 
                     newPassword.length >= 8 && 
                     newPassword === confirmPassword && 
                     countdown > 0 &&
                     passwordStrength >= 3;

  const strengthIndicator = getPasswordStrengthText();

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6">
          {/* Logo - Ultra Compact */}
          <div className="text-center mb-3">
            <Link href="/" className="inline-flex items-center justify-center group">
              <div className="w-50 h-14 relative mx-auto">
                <Image 
                  src="/SportHub-Logo.png" 
                  alt="SportHub Logo" 
                  fill 
                  style={{ objectFit: 'contain' }} 
                  priority 
                />
              </div>
            </Link>
          </div>

          {/* Header - Ultra Compact */}
          <div className="text-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <h1 className="text-lg font-bold text-gray-800 mb-1">Đặt lại mật khẩu</h1>
            <p className="text-gray-600 text-xs">
              Nhập mã OTP và mật khẩu mới để hoàn tất
            </p>
            
            {/* Countdown Timer - Inline */}
            <div className="mt-1 flex items-center justify-center gap-1 text-xs">
              <Timer className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">
                {formatTime(countdown)}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Alert Messages - More Compact */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
                <div className="flex items-center">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                <div className="flex items-center">
                  <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* OTP Input Fields */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Mã OTP
              </label>
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-8 h-9 text-center text-base font-bold border-2 rounded-lg focus:ring-1 focus:ring-green-200 focus:outline-none transition-all ${
                      value 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-200 focus:border-green-500 bg-white'
                    }`}
                    maxLength={1}
                    autoComplete="off"
                  />
                ))}
              </div>
              
              {/* Resend OTP - More Compact */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || isResending}
                  className="inline-flex items-center text-xs text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isResending ? 'animate-spin' : ''}`} />
                  {isResending ? 'Đang gửi...' : 'Gửi lại'}
                </button>
              </div>
            </div>

            {/* Password Fields - More Compact */}
            <div className="grid grid-cols-1 gap-3">
              {/* New Password */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-1 focus:ring-green-200 focus:border-green-500 focus:outline-none text-sm pr-8"
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-1 focus:ring-green-200 focus:outline-none text-sm pr-8 ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength - Compact */}
            {newPassword && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Độ mạnh:</span>
                  <span className={`text-xs font-medium ${strengthIndicator.color}`}>
                    {strengthIndicator.text}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${strengthIndicator.bgColor}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Password Requirements - Ultra Compact */}
            <div className="rounded-lg p-2">
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className={`flex items-center ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="w-1 h-1 bg-current rounded-full mr-1"></span>
                  8+ ký tự
                </div>
                <div className={`flex items-center ${/(?=.*[a-z])/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="w-1 h-1 bg-current rounded-full mr-1"></span>
                  Chữ thường
                </div>
                <div className={`flex items-center ${/(?=.*[A-Z])/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="w-1 h-1 bg-current rounded-full mr-1"></span>
                  Chữ hoa
                </div>
                <div className={`flex items-center ${/(?=.*\d)/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="w-1 h-1 bg-current rounded-full mr-1"></span>
                  Có số
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Đặt lại mật khẩu
                </>
              )}
            </button>
          </form>

          {/* Footer Links - Compact */}
          <div className="mt-3 pt-3 text-center space-y-1">
            <p className="text-xs text-gray-600">
              Nhớ mật khẩu?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Đăng nhập
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}