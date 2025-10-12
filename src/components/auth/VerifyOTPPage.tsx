'use client';
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, AlertCircle, Shield, Timer, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Image from 'next/image';
import MeteorShower from './background2';

export default function VerifyOTPPage() {
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isClient, setIsClient] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60); // 1 minute countdown
  const [isResending, setIsResending] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>(''); // Store user's email
  
  const { verifyOTP } = useAuthStore();
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    try {
      // In a real implementation, you would call sendOTP from the authStore
      // For now, we'll keep the simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCountdown(60); // Reset countdown
      setOtpValues(['', '', '', '', '', '']); // Clear OTP inputs
      inputRefs.current[0]?.focus(); // Focus first input
      setSuccess('Mã OTP mới đã được gửi đến email của bạn');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError('Không thể gửi lại mã OTP. Vui lòng thử lại.');
    } finally {
      setIsResending(false);
    }
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

    setIsLoading(true);
    try {
      // Use the actual verifyOTP function from authStore
      await verifyOTP(userEmail, otpString);
      
      setSuccess('Xác thực thành công! Đang chuyển hướng...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Mã OTP không chính xác. Vui lòng kiểm tra lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  const isFormValid = otpValues.every(value => value !== '') && countdown > 0;

  return (
    <MeteorShower className="p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6">
          {/* Logo - Compact */}
          <div className="text-center mb-6">
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

          {/* Header - Compact */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Xác thực mã OTP</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Nhập mã xác thực 6 chữ số đã được gửi đến email của bạn
            </p>
            
            {/* Countdown Timer */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs">
              <Timer className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">
                Mã hết hạn trong: {formatTime(countdown)}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* OTP Input Fields */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-gray-700 text-center">
                Mã xác thực OTP
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
                    className={`w-10 h-12 text-center text-lg font-bold border-2 rounded-xl focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 ${
                      value 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-200 focus:border-green-500 bg-white'
                    }`}
                    maxLength={1}
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xác thực...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Xác thực mã OTP
                </>
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isResending}
                className="inline-flex items-center text-xs text-green-600 hover:text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Đang gửi...' : countdown > 0 ? 'Gửi lại mã' : 'Gửi lại mã OTP'}
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-4 pt-4 space-y-2 text-center">
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

        {/* Security Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Để bảo mật tài khoản, không chia sẻ mã OTP với bất kỳ ai khác.
          </p>
        </div>
      </div>
    </MeteorShower>
  );
}