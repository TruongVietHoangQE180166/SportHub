import { Metadata } from 'next';
import VerifyOTPPage from '@/components/auth/VerifyOTPPage';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'SportHub - Xác Minh OTP | Bảo Mật Tài Khoản Của Bạn',
  description: 'Xác minh mã OTP để hoàn tất quá trình đăng ký hoặc đặt lại mật khẩu trên SportHub. Bảo mật tài khoản của bạn với xác thực hai lớp.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'xác minh otp',
    'mã xác thực',
    'xác minh tài khoản',
    'otp sporthub',
    'bảo mật hai lớp',
    'xác thực hai yếu tố'
  ],
  openGraph: {
    title: 'SportHub - Xác Minh OTP | Bảo Mật Tài Khoản Của Bạn',
    description: 'Xác minh mã OTP để hoàn tất quá trình đăng ký hoặc đặt lại mật khẩu trên SportHub. Bảo mật tài khoản của bạn với xác thực hai lớp.',
    url: 'https://sport-hub.pro.vn/verify-otp',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Xác Minh OTP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Xác Minh OTP | Bảo Mật Tài Khoản Của Bạn',
    description: 'Xác minh mã OTP để hoàn tất quá trình đăng ký hoặc đặt lại mật khẩu trên SportHub',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/verify-otp',
  },
  authors: [{ name: 'SportHub' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function VerifyOTP() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPPage />
    </Suspense>
  );
}