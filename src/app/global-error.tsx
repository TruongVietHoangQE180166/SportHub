'use client';

import Link from 'next/link';
import { Home, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-12 h-12 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Lỗi hệ thống</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Đã xảy ra lỗi không mong muốn</h2>
            <p className="text-gray-600 mb-4">
              Xin lỗi, đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 text-left max-h-32 overflow-y-auto">
              <p className="text-sm text-red-600 font-mono">{error.message}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Thử lại
            </button>
            
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow hover:shadow-md"
            >
              <Home className="w-5 h-5 mr-2" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}