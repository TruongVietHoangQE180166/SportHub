import { Metadata } from 'next';
import { DiscoverMatchesPage } from '../../../components/matches/DiscoverMatchesPage';

export const metadata: Metadata = {
  title: 'SportHub - Khám Phá Trận Đấu | Tìm & Tham Gia Trận Thể Thao',
  description: 'Khám phá và tham gia các trận đấu thể thao trên SportHub. Tìm đối thủ, tạo đội nhóm, và tham gia các trận đấu bóng đá, cầu lông tại Quy Nhơn.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'khám phá trận đấu',
    'tìm trận thể thao',
    'tham gia trận đấu',
    'trận bóng đá',
    'trận cầu lông',
    'cộng đồng thể thao',
    'tìm đối thủ'
  ],
  openGraph: {
    title: 'SportHub - Khám Phá Trận Đấu | Tìm & Tham Gia Trận Thể Thao',
    description: 'Khám phá và tham gia các trận đấu thể thao trên SportHub. Tìm đối thủ, tạo đội nhóm, và tham gia các trận đấu bóng đá, cầu lông tại Quy Nhơn.',
    url: 'https://sport-hub.pro.vn/matches/discover',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Khám Phá Trận Đấu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Khám Phá Trận Đấu | Tìm & Tham Gia Trận Thể Thao',
    description: 'Khám phá và tham gia các trận đấu thể thao trên SportHub',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/matches/discover',
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

export default function DiscoverMatches() {
  return <DiscoverMatchesPage />;
}