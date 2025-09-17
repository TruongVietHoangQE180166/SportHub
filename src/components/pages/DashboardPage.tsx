'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, Activity, Target, Circle, Search, ChevronDown, ChevronLeft, ChevronRight, User, Phone, Mail, Star, Filter, X, Eye, XCircle, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore'; 
import Image from 'next/image';

type Booking = {
  id: number;
  fieldName: string;
  sport: string;
  date: string;
  time: string;
  status: string;
  owner: {
    name: string;
    phone: string;
    email: string;
  };
  price: string;
};

export default function App() {
  const { user } = useAuthStore();

  // Dữ liệu lịch sử đặt sân
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([
    {
      id: 1,
      fieldName: 'Sân bóng Quy Nhon Center',
      sport: 'Bóng đá',
      date: '2025-01-05',
      time: '19:00 - 20:00',
      status: 'confirmed',
      owner: {
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        email: 'owner1@email.com',
      },
      price: '200,000 VNĐ'
    },
    {
      id: 2,
      fieldName: 'Sân cầu lông Hoàng Gia',
      sport: 'Cầu lông',
      date: '2025-01-07',
      time: '18:30 - 19:30',
      status: 'confirmed',
      owner: {
        name: 'Trần Thị B',
        phone: '0912345678',
        email: 'owner2@email.com',
      },
      price: '150,000 VNĐ'
    },
    {
      id: 3,
      fieldName: 'Sân Pickle Ball Biển Đông',
      sport: 'Pickle Ball',
      date: '2025-01-03',
      time: '16:00 - 17:00',
      status: 'completed',
      owner: {
        name: 'Lê Văn C',
        phone: '0923456789',
        email: 'owner3@email.com',
      },
      price: '300,000 VNĐ'
    },
    {
      id: 4,
      fieldName: 'Sân bóng đá Trung tâm',
      sport: 'Bóng đá',
      date: '2025-01-01',
      time: '20:00 - 21:00',
      status: 'completed',
      owner: {
        name: 'Phạm Thị D',
        phone: '0934567890',
        email: 'owner4@email.com',
      },
      price: '180,000 VNĐ'
    }
  ]);

  const [modalDetail, setModalDetail] = useState<Booking|null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<number|null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number|null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 10;
  const [confirmCancelRequestId, setConfirmCancelRequestId] = useState<number|null>(null);
  const [feedbacks, setFeedbacks] = useState<{ [id: number]: { content: string, rating: number } }>({});
  const [feedbackModal, setFeedbackModal] = useState<{ id: number, content: string, rating: number }|null>(null);

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'Bóng đá':
        return '⚽';
      case 'Cầu lông':
        return '🏸';
      case 'Pickle Ball':
        return '🎾';
      default:
        return <Circle className="w-8 h-8 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
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
    switch (status) {
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

  const handleCancel = (id: number) => {
    setBookingHistory(history => history.map(b => b.id === id ? { ...b, status: 'pending' } : b));
  };

  const handleDelete = (id: number) => {
    setBookingHistory(history => history.filter(b => b.id !== id));
  };

  const stats = {
    total: bookingHistory.length,
    confirmed: bookingHistory.filter(b => b.status === 'confirmed').length,
    completed: bookingHistory.filter(b => b.status === 'completed').length
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterSport, filterDate, activeSearch]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Vui lòng đăng nhập</h1>
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
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center border-4 border-green-400 shadow-lg">
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} width={80} height={80} className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{user.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2 tracking-tight">SPORTS DASHBOARD</h1>
                  <p className="text-gray-300 text-lg font-medium">Quản lý hoạt động thể thao chuyên nghiệp</p>
                </div>
              </div>
              
              {/* Desktop Stats */}
              <div className="hidden lg:flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400">{stats.total}</div>
                  <div className="text-sm text-gray-400 font-medium">TỔNG LƯỢT</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400">{stats.confirmed}</div>
                  <div className="text-sm text-gray-400 font-medium">SẮP TỚI</div>
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
              <Trophy className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-black text-black">{stats.total}</div>
              <div className="text-xs text-gray-600 font-medium">TỔNG LƯỢT</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Activity className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-black text-black">{stats.confirmed}</div>
              <div className="text-xs text-gray-600 font-medium">SẮP TỚI</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
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
              <Filter className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-black">BỘ LỌC & TÌM KIẾM</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Trạng thái</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full px-3 lg:px-4 py-3 text-left bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm font-medium"
                    onClick={() => setShowStatusDropdown(v => !v)}
                  >
                    <span className="text-gray-800 truncate">
                      {filterStatus === '' ? 'Tất cả trạng thái' :
                        filterStatus === 'confirmed' ? 'Đã xác nhận' :
                        filterStatus === 'pending' ? 'Chờ xác nhận hủy' :
                        filterStatus === 'completed' ? 'Đã hoàn thành' :
                        filterStatus === 'cancelled' ? 'Đã hủy' : filterStatus}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl">
                      {['', 'confirmed', 'pending', 'completed', 'cancelled'].map(option => (
                        <button
                          key={option}
                          className={`w-full text-left px-3 lg:px-4 py-3 hover:bg-gray-50 transition-all text-sm first:rounded-t-xl last:rounded-b-xl ${filterStatus === option ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-700'}`}
                          onClick={() => { setFilterStatus(option); setShowStatusDropdown(false); }}
                        >
                          {option === '' ? 'Tất cả trạng thái' :
                            option === 'confirmed' ? 'Đã xác nhận' :
                            option === 'pending' ? 'Chờ xác nhận hủy' :
                            option === 'completed' ? 'Đã hoàn thành' :
                            option === 'cancelled' ? 'Đã hủy' : option}
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
                    className="w-full px-3 lg:px-4 py-3 text-left bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm font-medium"
                    onClick={() => setShowSportDropdown(v => !v)}
                  >
                    <span className="text-gray-800 truncate">
                      {filterSport === '' ? 'Tất cả môn thể thao' : filterSport}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  </button>
                  {showSportDropdown && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl">
                      {['', 'Bóng đá', 'Cầu lông', 'Pickle Ball'].map(option => (
                        <button
                          key={option}
                          className={`w-full text-left px-3 lg:px-4 py-3 hover:bg-gray-50 transition-all text-sm first:rounded-t-xl last:rounded-b-xl ${filterSport === option ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-700'}`}
                          onClick={() => { setFilterSport(option); setShowSportDropdown(false); }}
                        >
                          {option === '' ? 'Tất cả môn thể thao' : option}
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
                    className="w-full px-3 lg:px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all text-sm text-gray-800 font-medium"
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
                    className="flex-1 min-w-0 px-3 lg:px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all text-sm font-medium"
                  />
                  <button
                    type="button"
                    className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0"
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
                  className="px-6 py-2 text-green-600 hover:text-green-700 font-bold transition-all text-sm hover:bg-green-50 rounded-xl border-2 border-green-200 hover:border-green-300"
                >
                  XÓA TẤT CẢ BỘ LỌC
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Booking List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-black uppercase tracking-tight">LỊCH SỬ ĐẶT SÂN</h2>
            <p className="text-gray-600 mt-1 text-sm font-medium">Quản lý và theo dõi hoạt động thể thao</p>
          </div>
          
          {(() => {
            const filtered = bookingHistory.filter(booking => {
              const q = activeSearch.toLowerCase();
              const matchSearch = !q || booking.fieldName.toLowerCase().includes(q);
              const matchStatus = !filterStatus || booking.status === filterStatus;
              const matchSport = !filterSport || booking.sport === filterSport;
              const matchDate = !filterDate || booking.date === filterDate;
              return matchSearch && matchStatus && matchSport && matchDate;
            });
            const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
            const paginated = filtered.slice(startIndex, startIndex + ORDERS_PER_PAGE);
            
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
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-3 lg:p-4 text-xs font-black text-gray-700 uppercase tracking-wide min-w-[250px]">Sân & Môn thể thao</th>
                      <th className="text-left p-3 lg:p-4 text-xs font-black text-gray-700 uppercase tracking-wide min-w-[150px]">Ngày & Giờ</th>
                      <th className="text-left p-3 lg:p-4 text-xs font-black text-gray-700 uppercase tracking-wide min-w-[100px]">Giá</th>
                      <th className="text-left p-3 lg:p-4 text-xs font-black text-gray-700 uppercase tracking-wide min-w-[120px]">Trạng thái</th>
                      <th className="text-center p-3 lg:p-4 text-xs font-black text-gray-700 uppercase tracking-wide min-w-[180px]">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map((booking) => (
                      <React.Fragment key={booking.id}>
                        <tr className="hover:bg-gray-50 transition-all duration-200 group">
                          <td className="p-3 lg:p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl bg-gray-100 text-lg lg:text-2xl shrink-0">
                                {typeof getSportIcon(booking.sport) === 'string' ? getSportIcon(booking.sport) : getSportIcon(booking.sport)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-xs lg:text-sm font-black text-black truncate mb-1 group-hover:text-green-600 transition-all">{booking.fieldName}</h3>
                                <span className="text-xs font-bold text-white bg-black px-2 py-1 rounded-full">
                                  {booking.sport}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 lg:p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs lg:text-sm text-gray-700 font-medium">
                                <Calendar className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" />
                                <span className="truncate">{booking.date}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs lg:text-sm text-gray-700 font-medium">
                                <Clock className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" />
                                <span className="truncate">{booking.time}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 lg:p-4">
                            <div className="text-xs lg:text-sm font-black text-green-600">{booking.price}</div>
                          </td>
                          <td className="p-3 lg:p-4">
                            <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)} block text-center`}>
                              {getStatusText(booking.status)}
                            </span>
                          </td>
                          <td className="p-3 lg:p-4">
                            <div className="flex flex-wrap gap-1 lg:gap-2 justify-center">
                              <button
                                className="flex items-center gap-1 p-1.5 lg:p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-sm text-xs font-bold"
                                onClick={() => setModalDetail(booking)}
                                title="Chi tiết"
                              >
                                <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="hidden md:inline">Chi tiết</span>
                              </button>
                              {booking.status === 'confirmed' && (
                                <button
                                  className="flex items-center gap-1 p-1.5 lg:p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all shadow-sm text-xs font-bold"
                                  onClick={() => setConfirmCancelId(booking.id)}
                                  title="Hủy đặt"
                                >
                                  <XCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                                  <span className="hidden lg:inline">Hủy đặt</span>
                                </button>
                              )}
                              {booking.status === 'completed' && !feedbacks[booking.id] && (
                                <button
                                  className="flex items-center gap-1 p-1.5 lg:p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all shadow-sm text-xs font-bold"
                                  onClick={() => setFeedbackModal({ id: booking.id, content: '', rating: 5 })}
                                  title="Đánh giá"
                                >
                                  <Star className="w-3 h-3 lg:w-4 lg:h-4" />
                                  <span className="hidden lg:inline">Đánh giá</span>
                                </button>
                              )}
                              {(booking.status === 'cancelled' || booking.status === 'completed') && (
                                <button
                                  className="flex items-center gap-1 p-1.5 lg:p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-sm text-xs font-bold"
                                  onClick={() => setConfirmDeleteId(booking.id)}
                                  title="Xóa lịch sử"
                                >
                                  <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                  <span className="hidden lg:inline">Xóa</span>
                                </button>
                              )}
                              {booking.status === 'pending' && (
                                <button
                                  className="flex items-center gap-1 p-1.5 lg:p-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all shadow-sm text-xs font-bold"
                                  onClick={() => setConfirmCancelRequestId(booking.id)}
                                  title="Hủy yêu cầu"
                                >
                                  <XCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                                  <span className="hidden xl:inline">Hủy yêu cầu</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        
                        {/* Pending Status Alert Row */}
                        {booking.status === 'pending' && (
                          <tr>
                            <td colSpan={5} className="p-0">
                              <div className="p-4 bg-yellow-50 border border-yellow-200 mx-4 mb-2 rounded-xl">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shrink-0">
                                    <Clock className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-black text-yellow-800 mb-2 text-sm uppercase">YÊU CẦU HỦY ĐANG CHỜ XÁC NHẬN</h4>
                                    <div className="bg-white rounded-lg p-3 space-y-2 border border-yellow-200">
                                      <div className="flex items-center gap-2 text-xs">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="font-bold text-black">CHỦ SÂN:</span>
                                        <span className="text-gray-700 font-medium">{booking.owner?.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-xs">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="font-bold text-black">SĐT:</span>
                                        <span className="text-gray-700 font-medium">{booking.owner?.phone}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-xs">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="font-bold text-black">EMAIL:</span>
                                        <span className="text-gray-700 font-medium">{booking.owner?.email}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                        
                        {/* Feedback Display Row */}
                        {booking.status === 'completed' && feedbacks[booking.id] && (
                          <tr>
                            <td colSpan={5} className="p-0">
                              <div className="p-4 bg-gray-100 border border-gray-300 mx-4 mb-2 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <Trophy className="w-5 h-5 text-green-600" />
                                  <h4 className="font-black text-green-800 uppercase text-xs">ĐÁNH GIÁ CỦA BẠN</h4>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  {[1,2,3,4,5].map(i => (
                                    <Star key={i} className={`w-4 h-4 ${i <= feedbacks[booking.id].rating ? 'text-green-600 fill-green-600' : 'text-gray-300'}`} fill={i <= feedbacks[booking.id].rating ? 'currentColor' : 'none'} />
                                  ))}
                                </div>
                                <div className="text-gray-800 font-medium italic bg-white p-2 rounded-lg border border-gray-200 text-xs mb-2">{feedbacks[booking.id].content}</div>
                                <div className="flex gap-2 mt-1">
                                  <button
                                    className="flex items-center gap-1 p-2 bg-black hover:bg-gray-900 text-white rounded-lg transition-all shadow-sm text-xs font-bold"
                                    onClick={() => setFeedbackModal({ id: booking.id, content: feedbacks[booking.id].content, rating: feedbacks[booking.id].rating })}
                                    title="Sửa đánh giá"
                                  >
                                    <Pencil className="w-4 h-4" />
                                    <span>Sửa</span>
                                  </button>
                                  <button
                                    className="flex items-center gap-1 p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all shadow-sm text-xs font-bold"
                                    onClick={() => setFeedbacks(fb => { const n = { ...fb }; delete n[booking.id]; return n; })}
                                    title="Xóa đánh giá"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Xóa</span>
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>

        {/* Pagination */}
        {(() => {
          const filtered = bookingHistory.filter(booking => {
            const q = activeSearch.toLowerCase();
            const matchSearch = !q || booking.fieldName.toLowerCase().includes(q);
            const matchStatus = !filterStatus || booking.status === filterStatus;
            const matchSport = !filterSport || booking.sport === filterSport;
            const matchDate = !filterDate || booking.date === filterDate;
            return matchSearch && matchStatus && matchSport && matchDate;
          });
          const totalPages = Math.ceil(filtered.length / ORDERS_PER_PAGE);
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

        {/* Detail Modal */}
        {modalDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-3 sm:mx-2 overflow-hidden border border-gray-200 p-3 lg:p-4">
              <div className="relative pb-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-xl">
                <button
                  className="absolute top-2 right-2 text-white/80 hover:text-white text-xl w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-all font-bold"
                  onClick={() => setModalDetail(null)}
                >
                  ×
                </button>
                <div className="text-center pt-4">
                  <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                    {typeof getSportIcon(modalDetail.sport) === 'string' ? getSportIcon(modalDetail.sport) : getSportIcon(modalDetail.sport)}
                  </div>
                  <h3 className="text-lg font-black mb-1 uppercase tracking-tight">{modalDetail.fieldName}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 border border-white/30 uppercase`}>
                    {getStatusText(modalDetail.status)}
                  </span>
                </div>
              </div>
              <div className="pt-2 pb-1 px-2">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-1 mb-1">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Môn thể thao</span>
                    </div>
                    <div className="font-black text-gray-900 text-xs">{modalDetail.sport}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Ngày</span>
                    </div>
                    <div className="font-black text-gray-900 text-xs">{modalDetail.date}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Giờ</span>
                    </div>
                    <div className="font-black text-gray-900 text-xs">{modalDetail.time}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Giá</span>
                    </div>
                    <div className="font-black text-green-600 text-xs">{modalDetail.price}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h4 className="font-black text-gray-900 mb-2 text-xs uppercase tracking-tight">THÔNG TIN CHỦ SÂN</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-gray-600 uppercase tracking-wide text-xs">CHỦ SÂN:</span>
                      <span className="text-gray-900 font-medium text-xs">{modalDetail.owner?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-gray-600 uppercase tracking-wide text-xs">SĐT:</span>
                      <span className="text-gray-900 font-medium text-xs">{modalDetail.owner?.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-gray-600 uppercase tracking-wide text-xs">EMAIL:</span>
                      <span className="text-gray-900 font-medium text-xs">{modalDetail.owner?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {confirmCancelId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-xs w-full mx-2 p-4 border border-gray-200">
              <div className="text-center mb-4">
                <div className="w-10 h-10 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1 uppercase tracking-tight">XÁC NHẬN HỦY ĐẶT SÂN</h3>
                <p className="text-gray-600 font-medium text-xs">Bạn có chắc chắn muốn gửi yêu cầu hủy lịch đặt sân này không?</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 px-2 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all border border-gray-200 text-xs"
                  onClick={() => setConfirmCancelId(null)}
                >
                  HỦY BỎ
                </button>
                <button
                  className="flex-1 px-2 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all text-xs"
                  onClick={() => { handleCancel(confirmCancelId); setConfirmCancelId(null); }}
                >
                  XÁC NHẬN
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-xs w-full mx-2 p-4 border border-gray-200">
              <div className="text-center mb-4">
                <div className="w-10 h-10 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1 uppercase tracking-tight">XÁC NHẬN XÓA LỊCH SỬ</h3>
                <p className="text-gray-600 font-medium text-xs">Bạn có chắc chắn muốn xóa lịch sử đặt sân này không?</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 px-2 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all border border-gray-200 text-xs"
                  onClick={() => setConfirmDeleteId(null)}
                >
                  HỦY BỎ
                </button>
                <button
                  className="flex-1 px-2 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all text-xs"
                  onClick={() => { handleDelete(confirmDeleteId); setConfirmDeleteId(null); }}
                >
                  XÁC NHẬN XÓA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Request Confirmation Modal */}
        {confirmCancelRequestId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-xs w-full mx-2 p-4 border border-gray-200">
              <div className="text-center mb-4">
                <div className="w-10 h-10 mx-auto mb-2 bg-black rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1 uppercase tracking-tight">XÁC NHẬN HỦY YÊU CẦU</h3>
                <p className="text-gray-600 font-medium text-xs">Bạn có chắc chắn muốn hủy yêu cầu hủy đặt sân này không?</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 px-2 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all border border-gray-200 text-xs"
                  onClick={() => setConfirmCancelRequestId(null)}
                >
                  HỦY BỎ
                </button>
                <button
                  className="flex-1 px-2 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-all text-xs"
                  onClick={() => {
                    setBookingHistory(history => history.map(b => b.id === confirmCancelRequestId ? { ...b, status: 'confirmed' } : b));
                    setConfirmCancelRequestId(null);
                  }}
                >
                  XÁC NHẬN
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {feedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-3 sm:mx-2 p-3 lg:p-4 border border-gray-200">
              <div className="text-center mb-4">
                <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1 uppercase tracking-tight">ĐÁNH GIÁ SÂN & LỊCH ĐẶT</h3>
                <p className="text-gray-600 font-medium text-xs">Hãy chia sẻ cảm nhận của bạn về sân và trải nghiệm đặt sân này!</p>
              </div>
              <form onSubmit={e => {
                e.preventDefault();
                setFeedbacks(fb => ({ ...fb, [feedbackModal.id]: { content: feedbackModal.content, rating: feedbackModal.rating } }));
                setFeedbackModal(null);
              }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFeedbackModal(modal => modal ? { ...modal, rating: i } : null)}
                      className="focus:outline-none transition-all hover:scale-110"
                    >
                      <Star className={`w-6 h-6 ${i <= feedbackModal.rating ? 'text-green-600 fill-green-600' : 'text-gray-300'}`} fill={i <= feedbackModal.rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 mb-3 resize-none font-medium text-xs"
                  rows={3}
                  placeholder="Nhập đánh giá của bạn..."
                  value={feedbackModal.content}
                  onChange={e => setFeedbackModal(modal => modal ? { ...modal, content: e.target.value } : null)}
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="px-3 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all border border-gray-200 text-xs"
                    onClick={() => setFeedbackModal(null)}
                  >
                    HỦY
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all text-xs"
                  >
                    LƯU ĐÁNH GIÁ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}