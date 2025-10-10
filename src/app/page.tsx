import { Metadata } from 'next'
import { HomePage } from '../components/pages/HomePage';

export const metadata: Metadata = {
  title: 'SportHub - Đặt Sân Thể Thao Quy Nhơn | Đặt Sân Nhanh, Giá Rẻ',
  description: 'SportHub - Hệ thống đặt sân thể thao hàng đầu tại Quy Nhơn. Đặt sân bóng đá, cầu lông, tennis, bóng rổ nhanh chóng, giá tốt. Đặt ngay chỉ với vài click!',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'đặt sân bóng đá',
    'đặt sân bóng rổ',
    'đặt sân tennis',
    'đặt sân cầu lông',
    'sport hub quy nhơn',
    'đặt sân thể thao quy nhơn',
    'đặt sân bóng đá quy nhơn',
    'đặt sân cầu lông quy nhơn',
    'sân thể thao quy nhơn',
    'đặt sân tennis quy nhơn',
    'booking sân thể thao',
    'đặt sân online quy nhơn',
    'sân bóng quy nhơn'
  ],
  openGraph: {
    title: 'SportHub - Đặt Sân Thể Thao Quy Nhơn',
    description: 'Hệ thống đặt sân thể thao hàng đầu tại Quy Nhơn. Đặt sân nhanh chóng, giá tốt, tiện lợi.',
    url: 'https://sport-hub.pro.vn',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Thêm ảnh preview cho social media
        width: 1200,
        height: 630,
        alt: 'SportHub - Đặt Sân Thể Thao Quy Nhơn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Đặt Sân Thể Thao Quy Nhơn',
    description: 'Hệ thống đặt sân thể thao hàng đầu tại Quy Nhơn',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn',
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

export default function Home() {
  return <HomePage />;
}