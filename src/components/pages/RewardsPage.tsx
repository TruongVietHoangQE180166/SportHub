'use client'

import React, { useState, useEffect } from 'react'
import { Gift, Ticket, AlertTriangle, ShoppingCart, Star, Sparkles, Trophy, Zap } from 'lucide-react'
import { useFieldStore } from "@/stores/fieldStore"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from 'next/navigation'

// Define the voucher template type
interface VoucherTemplate {
  discountValue: number;
  minOrderValue: number;
  image: string;
  exchangePoint: number;
  active: boolean;
  percentage: boolean;
}

export default function RewardsPage() {
  const { userVouchers, fetchUserVouchers, userPoints, exchangeUserVoucher } = useFieldStore()
  const { user, isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [exchanging, setExchanging] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherTemplate | null>(null)
  const [showExchangeModal, setShowExchangeModal] = useState(false)
  const [exchangeError, setExchangeError] = useState<string | null>(null)
  const router = useRouter()

  // Available voucher templates for exchange
  const voucherTemplates: VoucherTemplate[] = [
    {
      discountValue: 50000,
      minOrderValue: 200000,
      image: "",
      exchangePoint: 100,
      active: true,
      percentage: false
    },
    {
      discountValue: 10,
      minOrderValue: 100000,
      image: "",
      exchangePoint: 50,
      active: true,
      percentage: true
    },
    {
      discountValue: 100000,
      minOrderValue: 500000,
      image: "",
      exchangePoint: 200,
      active: true,
      percentage: false
    },
    {
      discountValue: 15,
      minOrderValue: 300000,
      image: "",
      exchangePoint: 120,
      active: true,
      percentage: true
    },
    {
      discountValue: 20000,
      minOrderValue: 100000,
      image: "",
      exchangePoint: 30,
      active: true,
      percentage: false
    },
    {
      discountValue: 20,
      minOrderValue: 250000,
      image: "",
      exchangePoint: 80,
      active: true,
      percentage: true
    },
    {
      discountValue: 30000,
      minOrderValue: 150000,
      image: "",
      exchangePoint: 40,
      active: true,
      percentage: false
    },
    {
      discountValue: 25,
      minOrderValue: 400000,
      image: "",
      exchangePoint: 150,
      active: true,
      percentage: true
    },
    {
      discountValue: 70000,
      minOrderValue: 350000,
      image: "",
      exchangePoint: 100,
      active: true,
      percentage: false
    },
    {
      discountValue: 30,
      minOrderValue: 500000,
      image: "",
      exchangePoint: 180,
      active: true,
      percentage: true
    }
  ]

  useEffect(() => {
    const loadVouchers = async () => {
      if (isAuthenticated && user?.id) {
        try {
          await fetchUserVouchers(user.id)
        } catch (error) {
          console.error("Failed to fetch user vouchers:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    loadVouchers()
  }, [isAuthenticated, user?.id, fetchUserVouchers])

  const handleUseVoucher = (voucherCode: string) => {
    // Navigate to booking page
    router.push('/booking')
  }

  const handleExchangeVoucher = async () => {
    if (!selectedVoucher) return;

    setExchanging(true)
    setExchangeError(null)
    
    try {
      // Create the payload with the full voucher data
      const voucherPayload = {
        discountValue: selectedVoucher.discountValue,
        minOrderValue: selectedVoucher.minOrderValue,
        image: selectedVoucher.image,
        exchangePoint: selectedVoucher.exchangePoint,
        active: selectedVoucher.active,
        percentage: selectedVoucher.percentage
      };

      // Call the updated exchangeUserVoucher function with the full voucher data
      const response = await exchangeUserVoucher(voucherPayload)
  
      if (response.success) {
        // Refresh user vouchers
        if (user?.id) {
          await fetchUserVouchers(user.id)
        }
        setShowExchangeModal(false)
        setSelectedVoucher(null)
      } else {
        setExchangeError(response.message.messageDetail || "Failed to exchange voucher")
      }
    } catch (error: any) {
      setExchangeError(error.message || "Failed to exchange voucher")
    } finally {
      setExchanging(false)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng nhập để xem phần thưởng</h3>
          <p className="text-gray-600">Bạn cần đăng nhập để xem trang này.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Exchange Error Modal */}
      {exchangeError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 border-2 border-gray-200">
                <AlertTriangle className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-4">Lỗi khi đổi voucher</h3>
              <div className="mt-4">
                <p className="text-gray-600 break-words">{exchangeError}</p>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  className="px-8 py-3 bg-green-400 text-white rounded-xl hover:bg-green-500 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  onClick={() => setExchangeError(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exchange Confirmation Modal */}
      {showExchangeModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 border-2 border-gray-200">
                <Gift className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-4">Xác nhận đổi voucher</h3>
              <div className="mt-4">
                <p className="text-gray-600">
                  Bạn có chắc chắn muốn đổi <span className="font-bold text-green-400">{selectedVoucher.exchangePoint} điểm</span> để nhận voucher này?
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      {selectedVoucher.percentage 
                        ? `${selectedVoucher.discountValue}%` 
                        : `${selectedVoucher.discountValue.toLocaleString()}đ`}
                    </span>
                    <span className="text-gray-600 text-sm">
                      Đơn tối thiểu: {selectedVoucher.minOrderValue.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
                  onClick={() => setShowExchangeModal(false)}
                  disabled={exchanging}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-3 bg-green-400 text-white rounded-xl hover:bg-green-500 transition-all duration-200 font-semibold flex items-center justify-center shadow-md hover:shadow-lg"
                  onClick={handleExchangeVoucher}
                  disabled={exchanging}
                >
                  {exchanging ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    "Đổi ngay"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-8 py-4 shadow-lg border border-gray-200 mb-6">
            <Trophy className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-gray-900">
              Phần thưởng của tôi
            </h1>
            <Sparkles className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-600 text-lg">Quản lý điểm thưởng và voucher của bạn</p>
        </div>
        
        {/* Points Summary */}
        <div className="mb-12">
          <div className="bg-green-400 rounded-2xl p-8 text-white shadow-lg border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">Điểm thưởng hiện tại</h3>
                </div>
                <p className="text-4xl font-bold mb-2">{(userPoints?.currentPoints || 0).toLocaleString()}</p>
                <p className="text-green-100 text-sm">điểm thưởng</p>
              </div>
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center border border-white border-opacity-30">
                <Gift className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Exchange Vouchers */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center shadow-md">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Cửa hàng voucher</h3>
                <p className="text-gray-600">Đổi điểm lấy voucher hấp dẫn</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 max-h-[800px] overflow-y-auto pr-2">
              {voucherTemplates.map((voucher, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-green-400 transition-all duration-300"
                >
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-green-400 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      <Star className="w-3 h-3" />
                      {voucher.exchangePoint}
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <h4 className="font-bold text-lg text-gray-900 mb-2">
                      {voucher.percentage 
                        ? `Giảm ${voucher.discountValue}%`
                        : `Giảm ${voucher.discountValue.toLocaleString()}đ`}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Đơn tối thiểu: <span className="font-semibold">{voucher.minOrderValue.toLocaleString()}đ</span>
                    </p>
                    
                    <button 
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                        (userPoints?.currentPoints || 0) >= voucher.exchangePoint
                          ? "bg-green-400 text-white hover:bg-green-500 shadow-md"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        setSelectedVoucher(voucher);
                        setShowExchangeModal(true);
                      }}
                      disabled={(userPoints?.currentPoints || 0) < voucher.exchangePoint}
                    >
                      {(userPoints?.currentPoints || 0) >= voucher.exchangePoint ? (
                        <>
                          <Gift className="w-4 h-4 inline mr-2" />
                          Đổi ngay
                        </>
                      ) : (
                        "Không đủ điểm"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - My Vouchers */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shadow-md">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Voucher của tôi</h3>
                <p className="text-gray-600">Tổng cộng {userVouchers?.length || 0} voucher</p>
              </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-400 mb-4"></div>
                <p className="text-gray-600">Đang tải voucher...</p>
              </div>
            ) : userVouchers && userVouchers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 max-h-[800px] overflow-y-auto pr-2">
                {userVouchers.map((userVoucher, index) => (
                  <div 
                    key={index} 
                    className={`relative rounded-xl p-4 border-2 transition-all duration-300 ${
                      userVoucher.used 
                        ? "bg-gray-100 border-gray-300 opacity-75" 
                        : "bg-white border-gray-200 hover:shadow-md hover:border-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-base text-gray-900 mb-1">{userVoucher.voucher.code}</h4>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          userVoucher.used 
                            ? "bg-gray-300 text-gray-700" 
                            : "bg-green-400 text-white"
                        }`}>
                          {userVoucher.used ? "Đã sử dụng" : "Có thể sử dụng"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 text-xs">Giá trị giảm:</span>
                        <span className="font-bold text-gray-900 text-sm">
                          {userVoucher.voucher.percentage 
                            ? `${userVoucher.voucher.discountValue}%` 
                            : `${userVoucher.voucher.discountValue.toLocaleString()}đ`}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-xs">Đơn tối thiểu:</span>
                        <span className="font-semibold text-gray-900 text-xs">
                          {userVoucher.voucher.minOrderValue.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                    
                    {!userVoucher.used && (
                      <button 
                        className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-all duration-300 font-semibold text-sm shadow-md"
                        onClick={() => handleUseVoucher(userVoucher.voucher.code)}
                      >
                        Sử dụng ngay
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Chưa có voucher nào</h4>
                <p className="text-gray-600">Hãy tích điểm để đổi voucher hấp dẫn ở cửa hàng bên cạnh</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}