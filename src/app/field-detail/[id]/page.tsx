import { Metadata } from 'next';
// app/field-detail/[id]/page.tsx
import FieldDetailPage from '../../../components/pages/Field-detail';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return {
    title: 'SportHub - Chi Tiết Sân Thể Thao | Đặt Sân Nhanh, Giá Tốt',
    description: 'Chi tiết sân thể thao trên SportHub. Xem thông tin, hình ảnh, giá cả và đặt sân nhanh chóng. Đặt sân bóng đá, cầu lông, pickle ball tại Quy Nhơn.',
    keywords: [
      'sporthub',
      'sport hub',
      'sport-hub',
      'chi tiết sân thể thao',
      'đặt sân chi tiết',
      'sân bóng đá',
      'sân cầu lông',
      'sân pickle ball',
      'đặt sân theo id',
      'thông tin sân thể thao'
    ],
    openGraph: {
      title: 'SportHub - Chi Tiết Sân Thể Thao | Đặt Sân Nhanh, Giá Tốt',
      description: 'Chi tiết sân thể thao trên SportHub. Xem thông tin, hình ảnh, giá cả và đặt sân nhanh chóng. Đặt sân bóng đá, cầu lông, pickle ball tại Quy Nhơn.',
      url: `https://sport-hub.pro.vn/field-detail/${id}`,
      siteName: 'SportHub',
      locale: 'vi_VN',
      type: 'website',
      images: [
        {
          url: '/SportHup.png',
          width: 1200,
          height: 630,
          alt: 'SportHub - Chi Tiết Sân Thể Thao',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SportHub - Chi Tiết Sân Thể Thao | Đặt Sân Nhanh, Giá Tốt',
      description: 'Chi tiết sân thể thao trên SportHub. Xem thông tin, hình ảnh, giá cả và đặt sân nhanh chóng',
    },
    alternates: {
      canonical: `https://sport-hub.pro.vn/field-detail/${id}`,
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
  } satisfies Metadata;
}

export default async function FieldDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FieldDetailPage fieldId={id} />;
}