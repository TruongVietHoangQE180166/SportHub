import { Metadata } from 'next';
import RegisterPage from '../../../components/auth/RegisterPage';

export const metadata: Metadata = {
  title: 'SportHub - Đăng Ký | Tạo Tài Khoản Thể Thao Miễn Phí',
  description: 'Đăng ký tài khoản miễn phí trên SportHub để đặt sân thể thao, tham gia trận đấu và tích điểm thưởng. Quy trình đăng ký nhanh chóng và đơn giản.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'đăng ký',
    'tạo tài khoản',
    'đăng ký sporthub',
    'tài khoản thể thao miễn phí',
    'đăng ký đặt sân',
    'tạo tài khoản thể thao'
  ],
  openGraph: {
    title: 'SportHub - Đăng Ký | Tạo Tài Khoản Thể Thao Miễn Phí',
    description: 'Đăng ký tài khoản miễn phí trên SportHub để đặt sân thể thao, tham gia trận đấu và tích điểm thưởng. Quy trình đăng ký nhanh chóng và đơn giản.',
    url: 'https://sport-hub.pro.vn/register',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Đăng Ký',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Đăng Ký | Tạo Tài Khoản Thể Thao Miễn Phí',
    description: 'Đăng ký tài khoản miễn phí trên SportHub để đặt sân thể thao, tham gia trận đấu và tích điểm thưởng',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/register',
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

export default function Register() {
  return <RegisterPage />;
}