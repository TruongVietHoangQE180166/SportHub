import { Metadata } from 'next';
import DashboardPage  from '../../components/pages/DashboardPage';

export const metadata: Metadata = {
  title: 'SportHub - Dashboard | Quản Lý Hoạt Động Thể Thao',
  description: 'Quản lý hoạt động thể thao chuyên nghiệp trên SportHub. Theo dõi đơn hàng, lịch đặt sân, và thống kê hoạt động thể thao của bạn.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'dashboard thể thao',
    'quản lý sân thể thao',
    'theo dõi đơn hàng',
    'thống kê thể thao',
    'quản lý đặt sân',
    'sports dashboard',
    'quản lý hoạt động thể thao'
  ],
  openGraph: {
    title: 'SportHub - Dashboard | Quản Lý Hoạt Động Thể Thao',
    description: 'Quản lý hoạt động thể thao chuyên nghiệp trên SportHub. Theo dõi đơn hàng, lịch đặt sân, và thống kê hoạt động thể thao của bạn.',
    url: 'https://sport-hub.pro.vn/dashboard',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Dashboard | Quản Lý Hoạt Động Thể Thao',
    description: 'Quản lý hoạt động thể thao chuyên nghiệp trên SportHub',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/dashboard',
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

export default function Dashboard() {
  return <DashboardPage />;
}