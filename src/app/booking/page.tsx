import { Metadata } from 'next';
import { Suspense } from "react";
import { BookingPage } from "../../components/pages/BookingPage";

export const metadata: Metadata = {
  title: 'SportHub - Đặt Sân Thể Thao | Quy Trình Đơn Giản, Thanh Toán An Toàn',
  description: 'Đặt sân thể thao nhanh chóng tại Quy Nhơn. Quy trình 3 bước đơn giản, thanh toán an toàn. Đặt sân bóng đá, cầu lông, pickle ball ngay hôm nay!',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'đặt sân thể thao',
    'đặt sân bóng đá',
    'đặt sân cầu lông',
    'đặt sân pickle ball',
    'đặt sân online quy nhơn',
    'thanh toán sân thể thao',
    'đặt lịch sân',
    'sân thể thao quy nhơn'
  ],
  openGraph: {
    title: 'SportHub - Đặt Sân Thể Thao | Quy Trình Đơn Giản, Thanh Toán An Toàn',
    description: 'Đặt sân thể thao nhanh chóng tại Quy Nhơn. Quy trình 3 bước đơn giản, thanh toán an toàn. Đặt sân bóng đá, cầu lông, pickle ball ngay hôm nay!',
    url: 'https://sport-hub.pro.vn/booking',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Đặt Sân Thể Thao',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Đặt Sân Thể Thao | Quy Trình Đơn Giản, Thanh Toán An Toàn',
    description: 'Đặt sân thể thao nhanh chóng tại Quy Nhơn. Quy trình 3 bước đơn giản, thanh toán an toàn',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/booking',
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

export default function Booking() {
  return (
    <Suspense fallback={<div style={{padding: 40, fontSize: 24}}>Đang tải dữ liệu đặt sân...</div>}>
      <BookingPage />
    </Suspense>
  );
}