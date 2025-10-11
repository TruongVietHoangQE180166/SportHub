import { Metadata } from 'next';
import RewardsPage from '../../components/pages/RewardsPage';

export const metadata: Metadata = {
  title: 'SportHub - Phần Thưởng & Voucher | Đổi Điểm Lấy Ưu Đãi',
  description: 'Đổi điểm thưởng lấy voucher giảm giá trên SportHub. Tích điểm khi đặt sân và đổi lấy các ưu đãi hấp dẫn cho lần đặt sân tiếp theo.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'phần thưởng',
    'voucher giảm giá',
    'đổi điểm thưởng',
    'ưu đãi đặt sân',
    'tích điểm thể thao',
    'voucher thể thao',
    'giảm giá sân thể thao'
  ],
  openGraph: {
    title: 'SportHub - Phần Thưởng & Voucher | Đổi Điểm Lấy Ưu Đãi',
    description: 'Đổi điểm thưởng lấy voucher giảm giá trên SportHub. Tích điểm khi đặt sân và đổi lấy các ưu đãi hấp dẫn cho lần đặt sân tiếp theo.',
    url: 'https://sport-hub.pro.vn/rewards',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Phần Thưởng & Voucher',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Phần Thưởng & Voucher | Đổi Điểm Lấy Ưu Đãi',
    description: 'Đổi điểm thưởng lấy voucher giảm giá trên SportHub',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/rewards',
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

export default function Rewards() {
  return <RewardsPage />;
}