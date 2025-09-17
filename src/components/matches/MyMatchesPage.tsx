'use client';
import React, { useState, useEffect } from 'react';
import { Users, Search, ChevronDown, Target, Shield, Eye, Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useMatchStore } from '@/stores/matchStore';
import { MatchCard } from './shared/MatchCard';
import { MatchNavigation } from './shared/MatchNavigation';
import { getSportIcon, getSportGradient } from './shared/matchUtils';

export const MyMatchesPage = () => {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [myMatchFilters, setMyMatchFilters] = useState({
    status: '',
    role: '',
    skillLevel: '',
    date: '',
    searchQuery: '',
  });
  const [myChipDropdown, setMyChipDropdown] = useState<string | null>(null);

  const { user, isAuthenticated, fetchAllUsers } = useAuthStore();
  const { matches, fetchAllMatches } = useMatchStore();

  useEffect(() => {
    fetchAllUsers();
    fetchAllMatches();
  }, [fetchAllUsers, fetchAllMatches]);

  // Logic lọc trận đấu của tôi
  const myFilteredMatches = matches.filter(match => {
    const isRelated = match.organizer === user?.name || match.joinRequests.some(r => r.user === user?.name && r.status === 'approved');
    if (!isRelated) return false;
    const matchesSearch = match.title.toLowerCase().includes(myMatchFilters.searchQuery.toLowerCase()) ||
      match.sport.toLowerCase().includes(myMatchFilters.searchQuery.toLowerCase()) ||
      match.location.toLowerCase().includes(myMatchFilters.searchQuery.toLowerCase());
    const matchesStatus = !myMatchFilters.status || match.status === myMatchFilters.status;
    const matchesRole = !myMatchFilters.role || (myMatchFilters.role === 'organizer' ? match.organizer === user?.name : match.joinRequests.some(r => r.user === user?.name && r.status === 'approved'));
    const matchesLevel = !myMatchFilters.skillLevel || match.skillLevel === myMatchFilters.skillLevel;
    const matchesDate = !myMatchFilters.date || match.date === myMatchFilters.date;
    return matchesSearch && matchesStatus && matchesRole && matchesLevel && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <div className="relative">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              <div className="flex items-center justify-center space-x-4">
                <Users className="w-16 h-16 text-green-600" />
                <span>Trận đấu của tôi</span>
              </div>
            </h1>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Quản lý các trận đấu bạn đã tạo hoặc tham gia
            </p>
          </div>
        </div>

        <MatchNavigation />

        <div className="space-y-6">
          {!isAuthenticated ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center space-x-2">
                <Shield className="w-6 h-6 text-gray-600" />
                <span>Vui lòng đăng nhập</span>
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Bạn cần đăng nhập để xem các trận đấu mà mình đã tham gia hoặc tổ chức
              </p>
            </div>
          ) : (
            <>
              {selectedMatch === null && (
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    {/* Status Dropdown */}
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Trạng thái</label>
                      <button
                        className="w-full px-3 py-2.5 text-left bg-white border border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm"
                        onClick={() => setMyChipDropdown(myChipDropdown === 'status' ? null : 'status')}
                        type="button"
                      >
                        <span className="text-gray-700 truncate">
                          {myMatchFilters.status ?
                            (myMatchFilters.status === 'open' ? 'Đang tuyển' : myMatchFilters.status === 'full' ? 'Đã đầy' : myMatchFilters.status === 'finished' ? 'Đã kết thúc' : 'Đã hủy')
                            : 'Tất cả trạng thái'}
                        </span>
                        <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                      </button>
                      {myChipDropdown === 'status' && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-green-500 rounded-lg shadow-xl">
                          {[ '', 'open', 'full', 'finished', 'cancelled' ].map(option => (
                            <button
                              key={option}
                              className={`w-full text-left px-3 py-2 hover:bg-green-50 transition-all text-sm first:rounded-t-lg last:rounded-b-lg ${
                                myMatchFilters.status === option ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-700'
                              }`}
                              onClick={() => {
                                setMyMatchFilters(f => ({ ...f, status: option }));
                                setMyChipDropdown(null);
                              }}
                            >
                              {option === '' ? 'Tất cả trạng thái' : option === 'open' ? 'Đang tuyển' : option === 'full' ? 'Đã đầy' : option === 'finished' ? 'Đã kết thúc' : 'Đã hủy'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Role Dropdown */}
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Vai trò</label>
                      <button
                        className="w-full px-3 py-2.5 text-left bg-white border border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm"
                        onClick={() => setMyChipDropdown(myChipDropdown === 'role' ? null : 'role')}
                        type="button"
                      >
                        <span className="text-gray-700 truncate">
                          {myMatchFilters.role ? (myMatchFilters.role === 'organizer' ? 'Tổ chức' : 'Tham gia') : 'Tất cả vai trò'}
                        </span>
                        <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                      </button>
                      {myChipDropdown === 'role' && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-green-500 rounded-lg shadow-xl">
                          {[ '', 'organizer', 'participant' ].map(option => (
                            <button
                              key={option}
                              className={`w-full text-left px-3 py-2 hover:bg-green-50 transition-all text-sm first:rounded-t-lg last:rounded-b-lg ${
                                myMatchFilters.role === option ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-700'
                              }`}
                              onClick={() => {
                                setMyMatchFilters(f => ({ ...f, role: option }));
                                setMyChipDropdown(null);
                              }}
                            >
                              {option === '' ? 'Tất cả vai trò' : option === 'organizer' ? 'Tổ chức' : 'Tham gia'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Level Dropdown */}
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Trình độ</label>
                      <button
                        className="w-full px-3 py-2.5 text-left bg-white border border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm"
                        onClick={() => setMyChipDropdown(myChipDropdown === 'level' ? null : 'level')}
                        type="button"
                      >
                        <span className="text-gray-700 truncate">
                          {myMatchFilters.skillLevel ? myMatchFilters.skillLevel : 'Chọn trình độ'}
                        </span>
                        <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                      </button>
                      {myChipDropdown === 'level' && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-green-500 rounded-lg shadow-xl">
                          {[ '', 'Thấp', 'Trung bình', 'Cao', 'Chuyên nghiệp' ].map(option => (
                            <button
                              key={option}
                              className={`w-full text-left px-3 py-2 hover:bg-green-50 transition-all text-sm first:rounded-t-lg last:rounded-b-lg ${
                                myMatchFilters.skillLevel === option ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-700'
                              }`}
                              onClick={() => {
                                setMyMatchFilters(f => ({ ...f, skillLevel: option }));
                                setMyChipDropdown(null);
                              }}
                            >
                              {option || 'Tất cả trình độ'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Date Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Ngày</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-all text-sm"
                        value={myMatchFilters.date}
                        onChange={e => setMyMatchFilters(f => ({ ...f, date: e.target.value }))}
                      />
                    </div>
                    {/* Search Input */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Tìm kiếm</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Nhập tên trận đấu, môn thể thao, địa điểm..."
                            value={myMatchFilters.searchQuery}
                            onChange={e => setMyMatchFilters(f => ({ ...f, searchQuery: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-all text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5"
                        >
                          <Search className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Clear Filters */}
                  {(myMatchFilters.status || myMatchFilters.role || myMatchFilters.skillLevel || myMatchFilters.date || myMatchFilters.searchQuery) && (
                    <div className="mt-3 text-center">
                      <button
                        type="button"
                        onClick={() => setMyMatchFilters({ status: '', role: '', skillLevel: '', date: '', searchQuery: '' })}
                        className="px-3 py-1.5 text-green-600 hover:text-green-700 font-medium transition-all text-sm"
                      >
                        Xóa tất cả bộ lọc
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Danh sách hoặc chi tiết trận đấu */}
              {selectedMatch === null ? (
                <>
                  <div className="flex justify-between items-center">
                    <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
                      <p className="text-gray-700 font-semibold flex items-center space-x-2">
                        <Target className="w-4 h-4 text-green-600" />
                        <span>Tìm thấy <span className="text-green-600 font-bold text-lg">{myFilteredMatches.length}</span> trận đấu</span>
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {myFilteredMatches.map((match) => {
                      const SportIcon = getSportIcon(match.sport);
                      const isOrganizer = match.organizer === user?.name;
                      
                      return (
                        <div key={match.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 group">
                          {/* Header with sport icon and title */}
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getSportGradient()} flex items-center justify-center text-white shadow-sm`}>
                              {React.createElement(SportIcon)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors truncate">
                                {match.title}
                              </h3>
                              <p className="text-sm text-gray-500">{match.sport}</p>
                            </div>
                          </div>
                          
                          {/* Role badge */}
                          <div className="mb-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              isOrganizer 
                                ? 'bg-orange-100 text-orange-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {isOrganizer ? (
                                <>
                                  <Trophy className="w-3 h-3 mr-1" />
                                  Tổ chức
                                </>
                              ) : (
                                <>
                                  <Users className="w-3 h-3 mr-1" />
                                  Tham gia
                                </>
                              )}
                            </span>
                          </div>
                          
                          {/* Match details */}
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-medium">{match.date}</span>
                              <Clock className="w-4 h-4 ml-2" />
                              <span className="text-sm font-medium">{match.time}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm font-medium truncate">{match.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Users className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {1 + match.joinRequests.filter(r => r.status === 'approved').length}/{match.maxParticipants} người
                              </span>
                            </div>
                          </div>
                          
                          {/* Status and skill level */}
                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              match.status === 'open' ? 'bg-green-100 text-green-700' :
                              match.status === 'full' ? 'bg-gray-100 text-gray-700' :
                              match.status === 'finished' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {match.status === 'open' ? 'Đang tuyển' : 
                               match.status === 'full' ? 'Đã đầy' : 
                               match.status === 'finished' ? 'Đã kết thúc' : 'Đã hủy'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                              {match.skillLevel}
                            </span>
                          </div>
                          
                          {/* Action button */}
                          <div className="mt-auto">
                            <button 
                              className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-sm transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2" 
                              onClick={() => setSelectedMatch(match.id)}
                            >
                              <Eye className="w-4 h-4" />
                              <span>Xem chi tiết</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                // Xem chi tiết trận đấu
                <>
                  {(() => {
                    const match = myFilteredMatches.find(m => m.id === selectedMatch) || matches.find(m => m.id === selectedMatch);
                    return match ? <MatchCard match={match} isDetailed={true} /> : null;
                  })()}
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={() => setSelectedMatch(null)}
                      className="px-8 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" />
                      <span>Quay lại danh sách</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};