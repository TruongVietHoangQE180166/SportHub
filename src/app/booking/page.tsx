import { Suspense } from "react";
import { BookingPage } from "../../components/pages/BookingPage";

export default function Booking() {
  return (
    <Suspense fallback={<div style={{padding: 40, fontSize: 24}}>Đang tải dữ liệu đặt sân...</div>}>
      <BookingPage />
    </Suspense>
  );
}