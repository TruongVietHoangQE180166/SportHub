'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Package, Activity, Target, Circle, Search, ChevronDown, ChevronLeft, ChevronRight, User, Phone, Mail, Filter, X, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useFieldStore } from '../../stores/fieldStore'; // Use the field store

// Use the types from field.ts
import { UserOrder, OrderBooking } from '../../types/field';

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { userOrders, fetchUserOrders, loading, cancelBooking } = useFieldStore(); // Use the field store

  // State for UI
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<OrderBooking | null>(null);
  const ORDERS_PER_PAGE = 5; // Show fewer orders per page since each order has multiple bookings

  // Fetch user orders when the component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserOrders(user.id);
    }
  }, [isAuthenticated, user?.id, fetchUserOrders]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterSport, filterDate, activeSearch]);

  // Function to handle booking cancellation
  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    try {
      await cancelBooking(bookingToCancel.id, { status: 'cancelled' });
      // Refresh the orders after cancellation
      if (user?.id) {
        await fetchUserOrders(user.id);
      }
      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-400 border-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận hủy';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  // Get sport icon based on sport type
  const getSportIcon = (sport: string) => {
    // Use a calendar icon to represent bookings
    return <Calendar className="w-5 h-5 text-green-400" />;
  };

  // Filter out cancelled orders (but keep all bookings including cancelled ones)
  const getFilteredOrders = () => {
    if (!userOrders?.data?.content) return [];
    
    return userOrders.data.content
      .filter(order => {
        // Filter out cancelled orders and pending orders
        if (order.status?.toLowerCase() === 'cancelled' || order.status?.toLowerCase() === 'pending') {
          return false;
        }
        
        // Filter out orders where all bookings are pending
        const nonPendingBookings = order.booking.filter(booking => 
          booking.status?.toLowerCase() !== 'pending'
        );
        
        // If all bookings are pending, don't show this order
        if (nonPendingBookings.length === 0) {
          return false;
        }
        
        const q = activeSearch.toLowerCase();
        
        // Check if any booking in the order matches the search
        const matchSearch = !q || order.booking.some(booking => 
          (booking.fieldName?.toLowerCase().includes(q) || 
           booking.smallField?.smallFiledName?.toLowerCase().includes(q))
        );
        
        const matchStatus = !filterStatus || order.status?.toLowerCase() === filterStatus;
        
        // For sport filter, we don't have a direct way to get the sport type from the small field
        // We'll leave this filter to match everything for now
        const matchSport = !filterSport || filterSport === '';
        
        // Check if any booking in the order matches the date filter
        const matchDate = !filterDate || order.booking.some(booking => {
          const bookingDate = new Date(booking.startTime);
          const formattedDate = bookingDate.toISOString().split('T')[0];
          return formattedDate === filterDate;
        });
        
        return matchSearch && matchStatus && matchSport && matchDate;
      })
      // Also filter bookings within each order to remove pending bookings
      .map(order => {
        return {
          ...order,
          booking: order.booking.filter(booking => 
            booking.status?.toLowerCase() !== 'pending'
          )
        };
      });
  };

  const filteredOrders = getFilteredOrders();
  
  const stats = {
    total: filteredOrders.length,
    confirmed: filteredOrders.filter(order => order.status?.toLowerCase() === 'confirmed').length,
    completed: filteredOrders.filter(order => order.status?.toLowerCase() === 'completed').length
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng nhập để xem trang này</h3>
          <p className="text-gray-600">Bạn cần đăng nhập để xem trang này.</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Athletic Header */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <h1 className="text-4xl font-black mb-2 tracking-tight">SPORTS DASHBOARD</h1>
                  <p className="text-gray-300 text-lg font-medium">Quản lý hoạt động thể thao chuyên nghiệp</p>
                </div>
              </div>
              
              {/* Desktop Stats */}
              <div className="hidden lg:flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400">{stats.total}</div>
                  <div className="text-sm text-gray-400 font-medium">TỔNG ĐƠN</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400">{stats.confirmed}</div>
                  <div className="text-sm text-gray-400 font-medium">ĐÃ XÁC NHẬN</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400">{stats.completed}</div>
                  <div className="text-sm text-gray-400 font-medium">HOÀN THÀNH</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Package className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-black text-black">{stats.total}</div>
              <div className="text-xs text-gray-600 font-medium">TỔNG ĐƠN</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Activity className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-black text-black">{stats.confirmed}</div>
              <div className="text-xs text-gray-600 font-medium">ĐÃ XÁC NHẬN</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-black text-black">{stats.completed}</div>
              <div className="text-xs text-gray-600 font-medium">HOÀN THÀNH</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-black">BỘ LỌC & TÌM KIẾM</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Trạng thái</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full px-3 lg:px-4 py-3 text-left bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-green-400 focus:border-green-400 focus:outline-none transition-all flex items-center justify-between text-sm font-medium"
                    onClick={() => setShowStatusDropdown(v => !v)}
                  >
                    <span className="text-gray-800 truncate">
                      {filterStatus === '' ? 'Tất cả trạng thái' :
                        filterStatus === 'confirmed' ? 'Đã xác nhận' :
                        filterStatus === 'pending' ? 'Chờ xác nhận hủy' :
                        filterStatus === 'completed' ? 'Đã hoàn thành' : filterStatus}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl">
                      {['', 'confirmed', 'pending', 'completed'].map(option => ( // Removed 'cancelled' from options
                        <button
                          key={option}
                          className={`w-full text-left px-3 lg:px-4 py-3 hover:bg-green-50 transition-all text-sm first:rounded-t-xl last:rounded-b-xl ${filterStatus === option ? 'bg-green-100 text-green-400 font-bold' : 'text-gray-700'}`}
                          onClick={() => { setFilterStatus(option); setShowStatusDropdown(false); }}
                        >
                          {option === '' ? 'Tất cả trạng thái' :
                            option === 'confirmed' ? 'Đã xác nhận' :
                            option === 'pending' ? 'Chờ xác nhận hủy' :
                            option === 'completed' ? 'Đã hoàn thành' : option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sport Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Môn thể thao</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full px-3 lg:px-4 py-3 text-left bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-green-400 focus:border-green-400 focus:outline-none transition-all flex items-center justify-between text-sm font-medium"
                    onClick={() => setShowSportDropdown(v => !v)}
                  >
                    <span className="text-gray-800 truncate">
                      {filterSport === '' ? 'Tất cả môn thể thao' : filterSport}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  </button>
                  {showSportDropdown && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl">
                      {['', 'Bóng đá', 'Cầu lông', 'Pickle Ball', 'football', 'badminton', 'pickle'].map(option => (
                        <button
                          key={option}
                          className={`w-full text-left px-3 lg:px-4 py-3 hover:bg-green-50 transition-all text-sm first:rounded-t-xl last:rounded-b-xl ${filterSport === option ? 'bg-green-100 text-green-400 font-bold' : 'text-gray-700'}`}
                          onClick={() => { setFilterSport(option); setShowSportDropdown(false); }}
                        >
                          {option === '' ? 'Tất cả môn thể thao' : 
                           option === 'football' ? 'Bóng đá' :
                           option === 'badminton' ? 'Cầu lông' :
                           option === 'pickle' ? 'Pickle Ball' : option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Ngày</label>
                <div className="relative">
                  <input
                    type="date"
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                    className="w-full px-3 lg:px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none transition-all text-sm text-gray-800 font-medium"
                  />
                  {filterDate && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-lg"
                      onClick={() => setFilterDate('')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Tìm kiếm</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên sân..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 min-w-0 px-3 lg:px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none transition-all text-sm font-medium"
                  />
                  <button
                    type="button"
                    className="w-12 h-12 bg-green-400 hover:bg-green-400 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0"
                    onClick={() => setActiveSearch(searchQuery)}
                    title="Tìm kiếm"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Clear Filters */}
            {(filterStatus || filterSport || filterDate || searchQuery) && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setFilterStatus('');
                    setFilterSport('');
                    setFilterDate('');
                    setSearchQuery('');
                    setActiveSearch('');
                  }}
                  className="px-6 py-2 text-green-400 hover:text-green-400 font-bold transition-all text-sm hover:bg-green-50 rounded-xl border-2 border-green-200 hover:border-green-400"
                >
                  XÓA TẤT CẢ BỘ LỌC
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-black uppercase tracking-tight">LỊCH SỬ ĐẶT SÂN</h2>
            <p className="text-gray-600 mt-1 text-sm font-medium">Quản lý và theo dõi hoạt động thể thao</p>
          </div>
          
          {(() => {
            const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
            const paginated = filteredOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
            
            if (paginated.length === 0) {
              return (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">🏟️</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">KHÔNG CÓ LỊCH ĐẶT SÂN</h3>
                  <p className="text-gray-500 font-medium text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm để xem kết quả khác</p>
                </div>
              );
            }
            
            return (
              <div className="divide-y divide-gray-100">
                {paginated.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50 transition-all duration-200">
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-black text-gray-900">Đơn hàng #{order.id.substring(0, 8)}</h3>
                          <p className="text-xs text-gray-500">
                            {order.createdDate && order.createdDate !== 'null'
                              ? new Date(order.createdDate).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Tổng tiền</div>
                          <div className="font-black text-green-400">{order.totalAmount?.toLocaleString('vi-VN')} VNĐ</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Bookings within the order - enhanced visual distinction */}
                    <div className="space-y-3 ml-6 pl-4 border-l-2 border-gray-300 bg-gray-50 rounded-r-lg">
                      {order.booking.map((booking) => (
                        <div key={booking.id} className="flex flex-wrap items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-green-400 transition-all bg-white">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-lg">
                              {getSportIcon(booking.smallField?.smallFiledName || '')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-gray-900 truncate">
                                {booking.fieldName || booking.smallField?.smallFiledName || 'N/A'}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                {booking.smallField?.smallFiledName ? (
                                  <span className="text-xs font-bold text-white bg-black px-2 py-1 rounded-full">
                                    {booking.smallField.smallFiledName}
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold text-white bg-black px-2 py-1 rounded-full">
                                    N/A
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {booking.startTime 
                                    ? new Date(booking.startTime).toLocaleDateString('vi-VN') 
                                    : 'N/A'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {booking.startTime && booking.endTime
                                    ? `${new Date(booking.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
                                    : 'N/A'}
                                </span>
                                {/* Status badge for each booking */}
                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                  {getStatusText(booking.status)}
                                </span>
                                {/* Cancel button for confirmed bookings */}
                                {booking.status?.toLowerCase() === 'confirmed' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setBookingToCancel(booking);
                                      setShowCancelModal(true);
                                    }}
                                    className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Hủy
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Giá</div>
                            <div className="font-black text-green-400">
                              {booking.totalPrice !== undefined && booking.totalPrice !== null 
                                ? `${booking.totalPrice.toLocaleString('vi-VN')} VNĐ` 
                                : 'N/A'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

        {/* Pagination */}
        {(() => {
          const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
          if (totalPages <= 1) return null;
          
          return (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6 lg:mt-8">
              <button
                type="button"
                className="px-4 lg:px-6 py-2 lg:py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="w-4 lg:w-5 lg:h-5 h-4" />
              </button>
              
              <div className="flex items-center gap-1 lg:gap-2">
                {(() => {
                  let start = Math.max(1, currentPage - 1);
                  let end = Math.min(totalPages, currentPage + 1);
                  if (currentPage === 1) {
                    end = Math.min(totalPages, 3);
                  } else if (currentPage === totalPages) {
                    start = Math.max(1, totalPages - 2);
                  }
                  const pages = [];
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  return pages.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 lg:w-12 lg:h-12 text-xs lg:text-sm font-bold rounded-xl transition-all ${
                        currentPage === page 
                          ? 'bg-black text-white border-2 border-black' 
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ));
                })()}
              </div>
              
              <button
                type="button"
                className="px-4 lg:px-6 py-2 lg:py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                <ChevronRight className="w-4 lg:w-5 lg:h-5 h-4" />
              </button>
            </div>
          );
        })()}

        {/* Confirmation Modal for Booking Cancellation */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mt-4">Xác nhận hủy đặt sân</h3>
                <p className="text-gray-600 mt-2">
                  Bạn có chắc chắn muốn hủy đặt sân này không? Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(false);
                    setBookingToCancel(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Không
                </button>
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Có, hủy đặt sân
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default App;