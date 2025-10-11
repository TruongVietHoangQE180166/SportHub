import { Metadata } from 'next';
import  ProfilePage  from '../../components/pages/ProfilePage';

export const metadata: Metadata = {
  title: 'SportHub - Hồ Sơ Cá Nhân | Quản Lý Thông Tin & Cài Đặt',
  description: 'Quản lý hồ sơ cá nhân và cài đặt tài khoản trên SportHub. Cập nhật thông tin, ảnh đại diện, và tùy chỉnh trải nghiệm đặt sân thể thao của bạn.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'hồ sơ cá nhân',
    'quản lý tài khoản',
    'cài đặt người dùng',
    'thông tin cá nhân',
    'ảnh đại diện',
    'tùy chỉnh tài khoản',
    'quản lý thông tin'
  ],
  openGraph: {
    title: 'SportHub - Hồ Sơ Cá Nhân | Quản Lý Thông Tin & Cài Đặt',
    description: 'Quản lý hồ sơ cá nhân và cài đặt tài khoản trên SportHub. Cập nhật thông tin, ảnh đại diện, và tùy chỉnh trải nghiệm đặt sân thể thao của bạn.',
    url: 'https://sport-hub.pro.vn/profile',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Hồ Sơ Cá Nhân',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Hồ Sơ Cá Nhân | Quản Lý Thông Tin & Cài Đặt',
    description: 'Quản lý hồ sơ cá nhân và cài đặt tài khoản trên SportHub',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/profile',
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

export default function Profile() {
  return <ProfilePage />;
}