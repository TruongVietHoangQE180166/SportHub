import ResetPasswordPage from '@/components/auth/Reset-Pass-Page';
import { Suspense } from 'react';

export default function VerifyOTP() {
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  ) 
}