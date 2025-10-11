import { Metadata } from 'next';
import { Suspense } from "react";
import { FieldDiscoveryPage } from '../../components/pages/FieldDiscoveryPage';

export const metadata: Metadata = {
  title: 'SportHub - Tìm Sân Thể Thao | Đặt Sân Nhanh, Giá Rẻ',
  description: 'Khám phá và đặt sân thể thao tại Quy Nhơn. Tìm kiếm sân bóng đá, cầu lông, pickle ball với giá tốt nhất. Đặt sân nhanh chóng chỉ với vài click!',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'tìm sân thể thao',
    'đặt sân bóng đá',
    'đặt sân cầu lông',
    'đặt sân pickle ball',
    'sân thể thao quy nhơn',
    'đặt sân online',
    'sân bóng đá quy nhơn',
    'sân cầu lông quy nhơn',
    'sân pickle ball quy nhơn'
  ],
  openGraph: {
    title: 'SportHub - Tìm Sân Thể Thao | Đặt Sân Nhanh, Giá Rẻ',
    description: 'Khám phá và đặt sân thể thao tại Quy Nhơn. Tìm kiếm sân bóng đá, cầu lông, pickle ball với giá tốt nhất. Đặt sân nhanh chóng chỉ với vài click!',
    url: 'https://sport-hub.pro.vn/fields',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Tìm Sân Thể Thao',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Tìm Sân Thể Thao | Đặt Sân Nhanh, Giá Rẻ',
    description: 'Khám phá và đặt sân thể thao tại Quy Nhơn. Tìm kiếm sân bóng đá, cầu lông, pickle ball với giá tốt nhất',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/fields',
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

export default function Fields() {
  return (
    <Suspense fallback={<div style={{ padding: 40, fontSize: 24 }}>Đang tải dữ liệu đặt sân...</div>}>
      <FieldDiscoveryPage />
    </Suspense>
  );
}