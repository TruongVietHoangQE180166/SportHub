import { Metadata } from 'next';
import LoginPage from '../../../components/auth/LoginPage';

export const metadata: Metadata = {
  title: 'SportHub - Đăng Nhập | Truy Cập Tài Khoản Thể Thao Của Bạn',
  description: 'Đăng nhập vào tài khoản SportHub để đặt sân thể thao, quản lý trận đấu và tích điểm thưởng. Truy cập nhanh chóng và bảo mật cao.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'đăng nhập',
    'tài khoản thể thao',
    'đăng nhập sporthub',
    'truy cập tài khoản',
    'đăng nhập đặt sân',
    'tài khoản đặt sân'
  ],
  openGraph: {
    title: 'SportHub - Đăng Nhập | Truy Cập Tài Khoản Thể Thao Của Bạn',
    description: 'Đăng nhập vào tài khoản SportHub để đặt sân thể thao, quản lý trận đấu và tích điểm thưởng. Truy cập nhanh chóng và bảo mật cao.',
    url: 'https://sport-hub.pro.vn/login',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Đăng Nhập',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Đăng Nhập | Truy Cập Tài Khoản Thể Thao Của Bạn',
    description: 'Đăng nhập vào tài khoản SportHub để đặt sân thể thao, quản lý trận đấu và tích điểm thưởng',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/login',
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

export default function Login() {
  return <LoginPage />;
}