import React from 'react';
import { Inter } from 'next/font/google';
import { ConditionalLayout } from '../components/ConditionalLayout';
import { PageProvider } from '../contexts/PageContext';
import './globals.css';
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sport-hub.pro.vn'),

  title: {
    default: 'SportHub - Đặt Sân Thể Thao Quy Nhơn | Đặt Sân Nhanh, Giá Rẻ tại Quy Nhơn',
    template: '%s | SportHub'
  },
  description:
    'SportHub là nền tảng đặt sân thể thao hàng đầu tại Quy Nhơn. Đặt sân bóng đá, cầu lông, tennis, bóng rổ nhanh chóng, giá rẻ, tiện lợi.',

  keywords: [
    'sporthub',
    'đặt sân thể thao quy nhơn',
    'đặt sân bóng đá',
    'đặt sân cầu lông',
    'sân bóng quy nhơn',
    'sport hub quy nhơn',
    'đặt sân tennis quy nhơn'
  ],

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

  openGraph: {
    type: 'website',
    url: 'https://sport-hub.pro.vn',
    title: 'SportHub - Đặt Sân Thể Thao Quy Nhơn',
    description:
      'Đặt sân thể thao nhanh chóng, giá rẻ, tiện lợi tại Quy Nhơn cùng SportHub.',
    siteName: 'SportHub',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SportHub - Đặt Sân Thể Thao Quy Nhơn',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'SportHub - Đặt Sân Thể Thao Quy Nhơn',
    description:
      'Hệ thống đặt sân thể thao hàng đầu tại Quy Nhơn. Đặt sân nhanh chóng, giá tốt, tiện lợi.',
    images: ['/og-image.jpg'],
  },

  alternates: {
    canonical: 'https://sport-hub.pro.vn',
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <PageProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </PageProvider>
      </body>
    </html>
  );
}