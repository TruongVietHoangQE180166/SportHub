import React from 'react';
import { Inter } from 'next/font/google';
import { ConditionalLayout } from '../components/ConditionalLayout';
import { PageProvider } from '../contexts/PageContext';
import './globals.css';
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sport-hub.pro.vn'),
}

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