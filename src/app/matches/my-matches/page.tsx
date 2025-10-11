import { Metadata } from 'next';
import { MyMatchesPage } from '../../../components/matches/MyMatchesPage';

export const metadata: Metadata = {
  title: 'SportHub - Trận Đấu Của Tôi | Quản Lý & Theo Dõi Các Trận Thể Thao',
  description: 'Quản lý và theo dõi các trận đấu thể thao bạn đã tạo và tham gia trên SportHub. Xem lịch sử trận đấu, kết quả và thống kê hoạt động thể thao của bạn.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'trận đấu của tôi',
    'quản lý trận đấu',
    'theo dõi trận thể thao',
    'lịch sử trận đấu',
    'thống kê thể thao',
    'kết quả trận đấu'
  ],
  openGraph: {
    title: 'SportHub - Trận Đấu Của Tôi | Quản Lý & Theo Dõi Các Trận Thể Thao',
    description: 'Quản lý và theo dõi các trận đấu thể thao bạn đã tạo và tham gia trên SportHub. Xem lịch sử trận đấu, kết quả và thống kê hoạt động thể thao của bạn.',
    url: 'https://sport-hub.pro.vn/matches/my-matches',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Trận Đấu Của Tôi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Trận Đấu Của Tôi | Quản Lý & Theo Dõi Các Trận Thể Thao',
    description: 'Quản lý và theo dõi các trận đấu thể thao bạn đã tạo và tham gia trên SportHub',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/matches/my-matches',
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

export default function MyMatches() {
  return <MyMatchesPage />;
}