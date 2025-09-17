'use client';
import React, { useState, useEffect } from 'react';
import { Search, Users, ChevronDown, Target, Zap, Shield, Plus, Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useMatchStore } from '@/stores/matchStore';
import { MatchCard } from './shared/MatchCard';
import { MatchNavigation } from './shared/MatchNavigation';
import { getSportIcon, getSportGradient } from './shared/matchUtils';
import { useRouter } from 'next/navigation';

export const DiscoverMatchesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sport: '',
    skillLevel: '',
    date: '',
  });
  const [chipDropdown, setChipDropdown] = useState<string | null>(null);

  const { user, isAuthenticated, fetchAllUsers } = useAuthStore();
  const { matches, fetchAllMatches, joinMatch } = useMatchStore();
  const router = useRouter();

  useEffect(() => {
    fetchAllUsers();
    fetchAllMatches();
  }, [fetchAllUsers, fetchAllMatches]);

  // Cập nhật logic lọc trận đấu
  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = !filters.sport || match.sport === filters.sport;
    const matchesLevel = !filters.skillLevel || match.skillLevel === filters.skillLevel;
    const matchesDate = !filters.date || match.date === filters.date;
    const matchesStatus = match.status === 'open' || match.status === 'full';
    return matchesSearch && matchesSport && matchesLevel && matchesDate && matchesStatus;
  });

  const handleJoinMatch = async (matchId: number) => {
    if (!user) return;
    await joinMatch(matchId, user.name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <div className="relative">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              <div className="flex items-center justify-center space-x-4">
                <Search className="w-16 h-16 text-green-600" />
                <span>Khám phá trận đấu</span>
              </div>
            </h1>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Tìm kiếm và tham gia các trận đấu thể thao phù hợp với bạn
            </p>
          </div>
        </div>

        <MatchNavigation />

        <div className="space-y-8">
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
                Bạn cần đăng nhập để khám phá và tham gia các trận đấu thể thao.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  {/* Sport Dropdown */}
                  <div className="relative">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Môn thể thao</label>
                    <button
                      className="w-full px-3 py-2.5 text-left bg-white border border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500 focus:outline-none transition-all flex items-center justify-between text-sm"
                      onClick={() => setChipDropdown(chipDropdown === 'sport' ? null : 'sport')}
                      type="button"
                    >
                      <span className="text-gray-700 truncate">
                        {filters.sport ? filters.sport : 'Chọn môn thể thao'}
                      </span>
                      <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                    </button>
                    {chipDropdown === 'sport' && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-green-500 rounded-lg shadow-xl">
                        {[ '', 'Bóng đá', 'Cầu lông', 'Pickle Ball' ].map(option => (
                          <button
                            key={option}
                            className={`w-full text-left px-3 py-2 hover:bg-green-50 transition-all text-sm first:rounded-t-lg last:rounded-b-lg ${
                              filters.sport === option ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-700'
                            }`}
                            onClick={() => {
                              setFilters(f => ({ ...f, sport: option }));
                              setChipDropdown(null);
                            }}
                          >
                            {option || 'Tất cả môn thể thao'}
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
                      onClick={() => setChipDropdown(chipDropdown === 'level' ? null : 'level')}
                      type="button"
                    >
                      <span className="text-gray-700 truncate">
                        {filters.skillLevel ? filters.skillLevel : 'Chọn trình độ'}
                      </span>
                      <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                    </button>
                    {chipDropdown === 'level' && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-green-500 rounded-lg shadow-xl">
                        {[ '', 'Thấp', 'Trung bình', 'Cao', 'Chuyên nghiệp' ].map(option => (
                          <button
                            key={option}
                            className={`w-full text-left px-3 py-2 hover:bg-green-50 transition-all text-sm first:rounded-t-lg last:rounded-b-lg ${
                              filters.skillLevel === option ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-700'
                            }`}
                            onClick={() => {
                              setFilters(f => ({ ...f, skillLevel: option }));
                              setChipDropdown(null);
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
                      value={filters.date}
                      onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
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
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
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
                {(filters.sport || filters.skillLevel || filters.date || searchQuery) && (
                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setFilters({ sport: '', skillLevel: '', date: '' });
                        setSearchQuery('');
                      }}
                      className="px-3 py-1.5 text-green-600 hover:text-green-700 font-medium transition-all text-sm"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
                  <p className="text-gray-700 font-semibold flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span>Tìm thấy <span className="text-green-600 font-bold text-lg">{filteredMatches.length}</span> trận đấu</span>
                  </p>
                </div>
                <button
                  onClick={() => router.push('/matches/create')}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Tạo trận đấu</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMatches.map((match) => {
                  const SportIcon = getSportIcon(match.sport);
                  const isJoined = match.joinRequests.some(r => r.user === user?.name && r.status === 'approved');
                  const isPending = match.joinRequests.some(r => r.user === user?.name && r.status === 'pending');
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
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {match.status === 'open' ? 'Đang tuyển' : match.status === 'full' ? 'Đã đầy' : 'Đã kết thúc'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {match.skillLevel}
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-6 line-clamp-2">{match.description}</p>
                      
                      {/* Action button */}
                      <div className="mt-auto">
                        {isOrganizer ? (
                          <button className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-orange-100 text-orange-700 cursor-not-allowed">
                            Trận đấu của bạn
                          </button>
                        ) : isJoined ? (
                          <button className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 cursor-not-allowed">
                            Đã tham gia
                          </button>
                        ) : isPending ? (
                          <button className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-yellow-100 text-yellow-700 cursor-not-allowed">
                            Chờ duyệt
                          </button>
                        ) : (
                          <button
                            className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
                            onClick={() => handleJoinMatch(match.id)}
                            disabled={match.status !== 'open'}
                          >
                            Tham gia ngay
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredMatches.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center space-x-2">
                    <Search className="w-6 h-6 text-gray-600" />
                    <span>Không tìm thấy trận đấu nào</span>
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Có vẻ như chưa có trận đấu nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi từ khóa hoặc tạo trận đấu mới!
                  </p>
                  <button
                    onClick={() => router.push('/matches/create')}
                    className="bg-green-600 text-white px-8 py-4 rounded-2xl hover:bg-green-700 font-semibold text-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Tạo trận đấu mới</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};