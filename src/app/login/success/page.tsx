'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

function OAuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Handle the token and log the user in directly with authService
      authService.loginGoogle(token)
        .then((result) => {
          // Update the auth store with the user data using the existing login method
          // We'll create a mock login credentials object to satisfy the login method signature
          // but the actual authentication is done via the token
          login({
            username: result.user.name,
            password: '' // Empty password as we're using token-based auth
          } as any).catch(() => {
            // If the login method fails, manually set the state
            useAuthStore.setState({ 
              user: result.user, 
              isAuthenticated: true 
            });
          }).finally(() => {
            // Redirect to home page after successful login
            router.push('/');
          });
        })
        .catch((error: any) => {
          console.error('Error logging in with token:', error);
          // Redirect to login page if there's an error
          router.push('/login');
        });
    } else {
      // No token found, redirect to login
      router.push('/login');
    }
  }, [router, searchParams, login]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang xác thực...</p>
      </div>
    </div>
  );
}

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <OAuthSuccessContent />
    </Suspense>
  );
}