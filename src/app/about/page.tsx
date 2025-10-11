import { Metadata } from 'next'
import AboutPage from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: 'SportHub - Về Chúng Tôi | Đối Tác Thành Công',
  description: 'Tìm hiểu về SportHub - Nền tảng đặt sân thể thao hàng đầu tại Quy Nhơn. Trở thành đối tác để tăng doanh thu và mở rộng khách hàng cho sân thể thao của bạn.',
  keywords: [
    'sporthub',
    'sport hub',
    'sport-hub',
    'về chúng tôi',
    'đối tác sân thể thao',
    'quản lý sân thể thao',
    'đăng ký đối tác',
    'sport hub quy nhơn',
    'đối tác thành công',
    'hệ sinh thái thể thao',
    'quản lý sân thông minh'
  ],
  openGraph: {
    title: 'SportHub - Về Chúng Tôi | Đối Tác Thành Công',
    description: 'Tìm hiểu về SportHub - Nền tảng đặt sân thể thao hàng đầu tại Quy Nhơn. Trở thành đối tác để tăng doanh thu và mở rộng khách hàng cho sân thể thao của bạn.',
    url: 'https://sport-hub.pro.vn/about',
    siteName: 'SportHub',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/SportHup.png',
        width: 1200,
        height: 630,
        alt: 'SportHub - Về Chúng Tôi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Về Chúng Tôi | Đối Tác Thành Công',
    description: 'Tìm hiểu về SportHub - Nền tảng đặt sân thể thao hàng đầu tại Quy Nhơn',
  },
  alternates: {
    canonical: 'https://sport-hub.pro.vn/about',
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

export default function AboutUsPage() {
  return <AboutPage />;
}