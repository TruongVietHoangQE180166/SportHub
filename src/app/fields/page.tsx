import { Suspense } from "react";
import { FieldDiscoveryPage } from '../../components/pages/FieldDiscoveryPage';

export default function Fields() {
  return (
    <Suspense fallback={<div style={{ padding: 40, fontSize: 24 }}>Đang tải dữ liệu đặt sân...</div>}>
      <FieldDiscoveryPage />
    </Suspense>
  );
}