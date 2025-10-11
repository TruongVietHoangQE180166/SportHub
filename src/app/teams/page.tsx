import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'SportHub - Đội Nhóm | Tìm Đối Thủ & Tạo Trận Đấu',
  description: 'Tìm đối thủ và tạo trận đấu thể thao trên SportHub. Kết nối với cộng đồng yêu thể thao tại Quy Nhơn, tạo đội nhóm và tham gia các trận đấu hấp dẫn.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'đội nhóm thể thao',
    'tìm đối thủ',
    'tạo trận đấu',
    'cộng đồng thể thao',
    'kết nối thể thao',
    'đội bóng đá',
    'đội cầu lông'
  ],
  openGraph: {
    title: 'SportHub - Đội Nhóm | Tìm Đối Thủ & Tạo Trận Đấu',
    description: 'Tìm đối thủ và tạo trận đấu thể thao trên SportHub. Kết nối với cộng đồng yêu thể thao tại Quy Nhơn, tạo đội nhóm và tham gia các trận đấu hấp dẫn.',
    url: 'https://sport-hub.pro.vn/teams',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Đội Nhóm',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Đội Nhóm | Tìm Đối Thủ & Tạo Trận Đấu',
    description: 'Tìm đối thủ và tạo trận đấu thể thao trên SportHub',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/teams',
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

export default function Teams() {
  // Redirect to the new discover matches page
  redirect('/matches/discover');
}