"use client";
import React from "react";

export const GlobalLoading = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
    <span className="sr-only">Đang tải...</span>
  </div>
); 