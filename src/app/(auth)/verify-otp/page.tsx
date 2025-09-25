import VerifyOTPPage from '@/components/auth/VerifyOTPPage';
import { Suspense } from 'react';

export default function VerifyOTP() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPPage />
    </Suspense>
  );
}