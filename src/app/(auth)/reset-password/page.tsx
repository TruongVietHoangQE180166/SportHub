import { Metadata } from 'next';
import ResetPasswordPage from '@/components/auth/Reset-Pass-Page';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'SportHub - Đặt Lại Mật Khẩu | Bảo Mật Tài Khoản Của Bạn',
  description: 'Đặt lại mật khẩu cho tài khoản SportHub để bảo mật thông tin cá nhân và tiếp tục đặt sân thể thao một cách an toàn.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'đặt lại mật khẩu',
    'reset password',
    'bảo mật tài khoản',
    'thay đổi mật khẩu',
    'mật khẩu mới'
  ],
  openGraph: {
    title: 'SportHub - Đặt Lại Mật Khẩu | Bảo Mật Tài Khoản Của Bạn',
    description: 'Đặt lại mật khẩu cho tài khoản SportHub để bảo mật thông tin cá nhân và tiếp tục đặt sân thể thao một cách an toàn.',
    url: 'https://sport-hub.pro.vn/reset-password',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Đặt Lại Mật Khẩu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Đặt Lại Mật Khẩu | Bảo Mật Tài Khoản Của Bạn',
    description: 'Đặt lại mật khẩu cho tài khoản SportHub để bảo mật thông tin cá nhân',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/reset-password',
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
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  ) 
}