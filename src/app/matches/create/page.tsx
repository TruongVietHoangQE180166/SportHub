import { Metadata } from 'next';
import { CreateMatchPage } from '../../../components/matches/CreateMatchPage';

export const metadata: Metadata = {
  title: 'SportHub - Tạo Trận Đấu | Tổ Chức Trận Thể Thao Của Riêng Bạn',
  description: 'Tạo trận đấu thể thao trên SportHub. Tổ chức trận bóng đá, cầu lông cho riêng bạn, mời bạn bè và cộng đồng tham gia. Dễ dàng quản lý lịch và người chơi.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'tạo trận đấu',
    'tổ chức trận thể thao',
    'tạo trận bóng đá',
    'tạo trận cầu lông',
    'quản lý trận đấu',
    'mời bạn chơi thể thao',
    'tạo đội thể thao'
  ],
  openGraph: {
    title: 'SportHub - Tạo Trận Đấu | Tổ Chức Trận Thể Thao Của Riêng Bạn',
    description: 'Tạo trận đấu thể thao trên SportHub. Tổ chức trận bóng đá, cầu lông cho riêng bạn, mời bạn bè và cộng đồng tham gia. Dễ dàng quản lý lịch và người chơi.',
    url: 'https://sport-hub.pro.vn/matches/create',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Tạo Trận Đấu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Tạo Trận Đấu | Tổ Chức Trận Thể Thao Của Riêng Bạn',
    description: 'Tạo trận đấu thể thao trên SportHub',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/matches/create',
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

export default function CreateMatch() {
  return <CreateMatchPage />;
}