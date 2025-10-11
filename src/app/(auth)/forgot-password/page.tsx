import { Metadata } from 'next';
import ForgotPasswordPage from '../../../components/auth/Forgot-Pass-Page'

export const metadata: Metadata = {
  title: 'SportHub - Quên Mật Khẩu | Khôi Phục Truy Cập Tài Khoản',
  description: 'Khôi phục truy cập tài khoản SportHub khi quên mật khẩu. Nhập email để nhận hướng dẫn đặt lại mật khẩu và tiếp tục đặt sân thể thao.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'quên mật khẩu',
    'khôi phục mật khẩu',
    'đặt lại mật khẩu',
    'quên pass sporthub',
    'khôi phục tài khoản',
    'lấy lại mật khẩu'
  ],
  openGraph: {
    title: 'SportHub - Quên Mật Khẩu | Khôi Phục Truy Cập Tài Khoản',
    description: 'Khôi phục truy cập tài khoản SportHub khi quên mật khẩu. Nhập email để nhận hướng dẫn đặt lại mật khẩu và tiếp tục đặt sân thể thao.',
    url: 'https://sport-hub.pro.vn/forgot-password',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Quên Mật Khẩu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Quên Mật Khẩu | Khôi Phục Truy Cập Tài Khoản',
    description: 'Khôi phục truy cập tài khoản SportHub khi quên mật khẩu',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/forgot-password',
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

export default function ForgotPassPage() {
    return <ForgotPasswordPage />;
  }