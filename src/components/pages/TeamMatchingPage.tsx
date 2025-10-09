'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Users, Calendar, Clock, MapPin, Search, Star, MessageCircle, ChevronDown, X, Eye, Trash2, Trophy, Target, Zap, Shield } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Match, SkillLevel } from '@/types/match';
import Image from 'next/image';

export const TeamMatchingPage = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-matches' | 'create'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMatch, setNewMatch] = useState({
    title: '',
    sport: '',
    date: '',
    time: '',
    location: '',
    address: '',
    maxParticipants: 10,
    skillLevel: 'Thấp',
    description: '',
    phone: '',
    facebook: '',
  });
  const { user, isAuthenticated } = useAuthStore();
  
  // Mock data for matches
  const matches: Match[] = [
    {
      id: 1,
      title: 'Giao hữu bóng đá cuối tuần',
      sport: 'Bóng đá',
      organizer: 'Nguyễn Văn A',
      organizerAvatar: '',
      date: '2025-10-15',
      time: '17:00',
      location: 'Sân bóng Quy Nhon Center',
      address: '123 Đường ABC, Quy Nhơn',
      maxParticipants: 12,
      skillLevel: 'Trung bình',
      description: 'Trận giao hữu bóng đá thân mật vào cuối tuần. Mời các bạn yêu thích bóng đá cùng tham gia!',
      status: 'open',
      phone: '0123456789',
      facebook: 'https://facebook.com/nguyenvana',
      role: 'organizer',
      joinRequests: [
        { user: 'Trần Văn B', status: 'approved' },
        { user: 'Lê Thị C', status: 'pending' }
      ]
    },
    {
      id: 2,
      title: 'Cầu lông giải trí buổi tối',
      sport: 'Cầu lông',
      organizer: 'Trần Thị D',
      organizerAvatar: '',
      date: '2025-10-12',
      time: '19:30',
      location: 'Trung tâm thể thao Quy Nhơn',
      address: '456 Đường XYZ, Quy Nhơn',
      maxParticipants: 8,
      skillLevel: 'Thấp',
      description: 'Chơi cầu lông giải trí vào buổi tối. Ai cũng có thể tham gia!',
      status: 'full',
      phone: '0987654321',
      facebook: 'https://facebook.com/tranthid',
      role: 'organizer',
      joinRequests: [
        { user: 'Phạm Văn E', status: 'approved' },
        { user: 'Hoàng Thị F', status: 'approved' }
      ]
    }
  ];
  
  // Mock users data
  const users = [
    { name: 'Nguyễn Văn A', avatar: '' },
    { name: 'Trần Văn B', avatar: '' },
    { name: 'Lê Thị C', avatar: '' },
    { name: 'Trần Thị D', avatar: '' },
    { name: 'Phạm Văn E', avatar: '' },
    { name: 'Hoàng Thị F', avatar: '' }
  ];
  
  // Mock functions (no-op)
  const createMatch = async (match: Match) => {};
  const joinMatch = async (matchId: number, userName: string) => {};
  const approveJoinRequest = async (matchId: number, userName: string) => {};
  const rejectJoinRequest = async (matchId: number, userName: string) => {};
  const cancelMatch = (matchId: number) => {};
  const deleteMatch = (matchId: number) => {};
  const leaveMatch = (matchId: number, userName: string) => {};

  // State filter mới
  const [filters, setFilters] = useState({
    sport: '',
    skillLevel: '',
    date: '',
  });
  const [chipDropdown, setChipDropdown] = useState<string | null>(null);

  // State filter cho tab 'Trận đấu của tôi'
  const [myMatchFilters, setMyMatchFilters] = useState({
    status: '',
    role: '',
    skillLevel: '',
    date: '',
    searchQuery: '',
  });
  const [myChipDropdown, setMyChipDropdown] = useState<string | null>(null);

  // Dropdown state for create form
  const [createDropdown, setCreateDropdown] = useState<{ sport: boolean; skillLevel: boolean; time: boolean }>({ sport: false, skillLevel: false, time: false });
  const sportOptions = [
    { value: '', label: 'Chọn môn thể thao' },
    { value: 'Bóng đá', label: 'Bóng đá' },
    { value: 'Cầu lông', label: 'Cầu lông' },
    { value: 'Pickle Ball', label: 'Pickle Ball' },
  ];
  const skillLevelOptions = [
    { value: 'Thấp', label: 'Thấp' },
    { value: 'Trung bình', label: 'Trung bình' },
    { value: 'Cao', label: 'Cao' },
    { value: 'Chuyên nghiệp', label: 'Chuyên nghiệp' },
  ];

  // Time options for dropdown
  const timeOptions = [];
  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  // Removed fetchAllUsers and fetchAllMatches since we're using mock data

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

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Thấp':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      case 'Trung bình':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Cao':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'Chuyên nghiệp':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getSportIcon = (sportName: string) => {
    switch (sportName) {
      case 'Bóng đá': return function FootballIcon() { return <span className="text-2xl">⚽</span>; };
      case 'Cầu lông': return function BadmintonIcon() { return <span className="text-2xl">🏸</span>; };
      case 'Pickle Ball': return function PickleIcon() { return <span className="text-2xl">🎾</span>; };
      default: return function DefaultIcon() { return <span className="text-2xl">🏅</span>; };
    }
  };

  const getSportGradient = () => {
    return 'from-green-500 to-emerald-600';
  };

  function findUserByName(users: {name: string, avatar?: string}[], name: string): {name: string, avatar?: string} | undefined {
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
    return users.find((u) => normalize(u.name) === normalize(name));
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-100 text-green-700 border border-green-200 flex items-center space-x-2"> <Zap className="w-4 h-4" /><span>Đang tuyển</span></span>;
      case 'full':
        return <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200 flex items-center space-x-2"> <Shield className="w-4 h-4" /><span>Đã đầy</span></span>;
      case 'finished':
        return <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200 flex items-center space-x-2"> <Star className="w-4 h-4" /><span>Đã kết thúc</span></span>;
      case 'cancelled':
        return <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-100 text-red-700 border border-red-200 flex items-center space-x-2"> <X className="w-4 h-4" /><span>Đã hủy</span></span>;
      default:
        return null;
    }
  };

  const MatchCard = ({ match, isDetailed = false }: { match: Match, isDetailed?: boolean }) => {
    const isOrganizer = match.organizer === user?.name;
    const isParticipant = match.joinRequests.some(r => r.user === user?.name && r.status === 'approved');
    const isPending = match.joinRequests.some(r => r.user === user?.name && r.status === 'pending');
    const SportIcon = getSportIcon(match.sport);
    const organizerUser = findUserByName(users, match.organizer);
    
    return (
      <div className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 ${
        isDetailed ? 'ring-1 ring-green-200' : ''
      } group`}>
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getSportGradient()} flex items-center justify-center text-white shadow-sm`}>
                  {React.createElement(SportIcon)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {match.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">{match.sport}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                {(() => { console.log('organizerUser.avatar', organizerUser?.avatar, 'for', match.organizer); return null; })()}
                <Image
                  src={organizerUser?.avatar && organizerUser.avatar.startsWith('http') ? organizerUser.avatar : (organizerUser?.avatar ? `/` + organizerUser.avatar.replace(/^\/+/, '') : '/default-avatar.png')}
                  alt={match.organizer}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                />
                <div>
                  <span className="text-xs text-gray-500 font-medium">Tổ chức bởi</span>
                  <p className="text-xs font-semibold text-gray-900">{match.organizer}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge(match.status)}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
              <div className="flex items-center space-x-1 text-gray-700">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="text-xs font-semibold truncate">{match.date}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
              <div className="flex items-center space-x-1 text-gray-700">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span className="text-xs font-semibold">{match.time}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
              <div className="flex items-center space-x-1 text-gray-700">
                <Users className="w-3 h-3 flex-shrink-0" />
                <span className="text-xs font-semibold">{1 + match.joinRequests.filter(r => r.status === 'approved').length}/{match.maxParticipants}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
              <div className="flex items-center space-x-1 text-gray-700">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="text-xs font-semibold truncate">{match.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSkillLevelColor(match.skillLevel)}`}> 
              <div className="flex items-center space-x-1">
                <Trophy className="w-3 h-3" />
                <span>{match.skillLevel}</span>
              </div>
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
            <p className="text-gray-700 text-xs leading-relaxed">{match.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {isAuthenticated && !isOrganizer && (
              <>
                {isParticipant ? (
                  <button className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600 cursor-not-allowed border border-gray-200">
                    <div className="flex items-center justify-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Đã tham gia</span>
                    </div>
                  </button>
                ) : isPending ? (
                  <button className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-yellow-100 text-yellow-700 cursor-not-allowed border border-yellow-200">
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Chờ duyệt</span>
                    </div>
                  </button>
                ) : (
                  <button
                    className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={() => handleJoinMatch(match.id)}
                    disabled={match.status !== 'open'}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>Tham gia ngay</span>
                    </div>
                  </button>
                )}
              </>
            )}
          </div>

          {isDetailed && (
            <div className="mt-10 border-t border-gray-100 pt-8">
              {isOrganizer && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <h4 className="font-bold text-base text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Quản lý yêu cầu tham gia
                  </h4>
                  {match.joinRequests.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm border border-gray-100">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium text-sm">Chưa có yêu cầu tham gia nào</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {match.joinRequests.map((req, idx) => {
                      const memberUser = findUserByName(users, req.user);
                      return (
                        <div key={idx} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {(() => { console.log('memberUser.avatar', memberUser?.avatar, 'for', req.user); return null; })()}
                            <Image 
                              src={memberUser?.avatar && memberUser.avatar.startsWith('http') ? memberUser.avatar : (memberUser?.avatar ? `/` + memberUser.avatar.replace(/^\/+/, '') : '/default-avatar.png')} 
                              alt={req.user} 
                              width={32} 
                              height={32} 
                              className="w-8 h-8 rounded-full border-2 border-gray-100 shadow-sm" 
                            />
                            <div>
                              <span className="font-semibold text-gray-900 text-sm">{req.user}</span>
                              <div className={`text-xs font-medium ${req.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}> 
                                {req.status === 'pending' ? (
                                  <span className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Chờ duyệt</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center space-x-1">
                                    <Shield className="w-3 h-3" />
                                    <span>Đã duyệt</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {(match.status === 'open' || match.status === 'full') && req.status === 'pending' && (
                              <>
                                <button 
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-xs shadow-sm transition-all duration-200 flex items-center space-x-1"
                                  onClick={() => handleApproveRequest(match.id, req.user)}
                                >
                                  <Shield className="w-3 h-3" />
                                  <span>Duyệt</span>
                                </button>
                                <button 
                                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-xs shadow-sm transition-all duration-200 flex items-center space-x-1"
                                  onClick={() => handleRejectRequest(match.id, req.user)}
                                >
                                  <X className="w-3 h-3" />
                                  <span>Từ chối</span>
                                </button>
                              </>
                            )}
                            {(match.status === 'open' || match.status === 'full') && req.status === 'approved' && (
                              <button 
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-xs shadow-sm transition-all duration-200 flex items-center space-x-1"
                                onClick={() => handleRejectRequest(match.id, req.user)}
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Loại bỏ</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {isParticipant && !isOrganizer && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <h4 className="font-bold text-base text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Danh sách thành viên
                  </h4>
                  <div className="space-y-2">
                    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center">
                      {(() => { console.log('organizerUser.avatar', organizerUser?.avatar, 'for', match.organizer); return null; })()}
                      <Image src={organizerUser?.avatar && organizerUser.avatar.startsWith('http') ? organizerUser.avatar : (organizerUser?.avatar ? `/` + organizerUser.avatar.replace(/^\/+/, '') : '/default-avatar.png')} alt={match.organizer} width={28} height={28} className="w-8 h-8 rounded-full border-2 border-gray-100 shadow-sm mr-3" />
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{match.organizer}</span>
                        <p className="text-xs text-orange-600 font-medium flex items-center space-x-1">
                          <Trophy className="w-3 h-3" />
                          <span>Tổ chức viên</span>
                        </p>
                      </div>
                    </div>
                    {match.joinRequests.filter(r => r.status === 'approved').map((req, idx) => {
                      const memberUser = findUserByName(users, req.user);
                      return (
                        <div key={idx} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center">
                          {(() => { console.log('memberUser.avatar', memberUser?.avatar, 'for', req.user); return null; })()}
                          <Image 
                            src={memberUser?.avatar && memberUser.avatar.startsWith('http') ? memberUser.avatar : (memberUser?.avatar ? `/` + memberUser.avatar.replace(/^\/+/, '') : '/default-avatar.png')} 
                            alt={req.user} 
                            width={32} 
                            height={32} 
                            className="w-8 h-8 rounded-full border-2 border-gray-100 shadow-sm mr-3" 
                          />
                          <div>
                            <span className="font-semibold text-gray-900 text-sm">{req.user}</span>
                            <div className="text-xs font-medium text-green-600">
                              <span className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>Thành viên</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-2 flex items-center space-x-2 text-sm">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span>Liên hệ người tổ chức</span>
                    </h5>
                    <p className="text-xs text-gray-600 mb-2">Liên hệ người tổ chức để nắm rõ thông tin về trận đấu.</p>
                    <div className="flex items-center space-x-2 mb-2">
                      {(() => { console.log('organizerUser.avatar', organizerUser?.avatar, 'for', match.organizer); return null; })()}
                      <Image src={organizerUser?.avatar && organizerUser.avatar.startsWith('http') ? organizerUser.avatar : (organizerUser?.avatar ? `/` + organizerUser.avatar.replace(/^\/+/, '') : '/default-avatar.png')} alt={match.organizer} width={28} height={28} className="w-7 h-7 rounded-full border-2 border-gray-100 shadow-sm" />
                      <span className="font-semibold text-gray-900 text-sm">{match.organizer}</span>
                    </div>
                    <div className="text-xs text-gray-700 mb-1">Số điện thoại: <span className="font-medium">{match.phone}</span></div>
                    <div className="text-xs text-gray-700">Facebook: <a href={match.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{match.facebook}</a></div>
                  </div>
                </div>
              )}
            </div>
          )}
          {isDetailed && (
            <div className="flex flex-col gap-3 mt-8">
              {isOrganizer && (match.status === 'open' || match.status === 'full') && (
                <button
                  onClick={() => cancelMatch(match.id)}
                  className="px-6 py-3 bg-red-600 text-white rounded-2xl font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Hủy trận đấu</span>
                </button>
              )}
              {isOrganizer && (match.status === 'finished' || match.status === 'cancelled') && (
                <button
                  onClick={() => handleDeleteMatch(match.id)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-2xl font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Xóa trận đấu</span>
                </button>
              )}
              {isParticipant && match.status === 'open' && (
                <button
                  onClick={() => leaveMatch(match.id, user?.name || '')}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-2xl font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Hủy tham gia</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  MatchCard.displayName = 'MatchCard';

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newId = matches.length > 0 ? Math.max(...matches.map(m => m.id)) + 1 : 1;
    await createMatch({
      id: newId,
      title: newMatch.title,
      sport: newMatch.sport,
      organizer: user.name,
      organizerAvatar: user.avatar || '',
      date: newMatch.date,
      time: newMatch.time,
      location: newMatch.location,
      address: newMatch.address,
      maxParticipants: Number(newMatch.maxParticipants),
      skillLevel: newMatch.skillLevel as SkillLevel,
      description: newMatch.description,
      status: 'open',
      phone: '0123456789',
      facebook: 'https://facebook.com/' + user.name.replace(/ /g, '').toLowerCase(),
      role: 'organizer',
      joinRequests: [],
    });
    setActiveTab('my-matches');
  };

  const handleJoinMatch = async (matchId: number) => {
    if (!user) return;
    await joinMatch(matchId, user.name);
    setSelectedMatch(matchId);
  };

  const handleApproveRequest = async (matchId: number, userName: string) => {
    await approveJoinRequest(matchId, userName);
  };

  const handleRejectRequest = async (matchId: number, userName: string) => {
    await rejectJoinRequest(matchId, userName);
  };

  const handleDeleteMatch = (matchId: number) => {
    deleteMatch(matchId);
    if (selectedMatch === matchId) {
      setSelectedMatch(null);
    }
  };

  const TimeDropdown: React.FC<{
    value: string;
    options: string[];
    onSelect: (val: string) => void;
    onClose: () => void;
  }> = function TimeDropdown({ value, options, onSelect, onClose }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) onClose();
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);
    // Scroll to selected
    useEffect(() => {
      if (!value) return;
      const idx = options.findIndex(t => t === value);
      if (idx >= 0) {
        const el = document.getElementById('time-opt-' + idx);
        if (el) el.scrollIntoView({ block: 'nearest' });
      }
    }, [value, options]);
    return (
      <div ref={ref} className="absolute z-50 left-0 right-0 mt-2 bg-white border border-green-500 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fadeIn flex flex-col">
        <div className="max-h-60 overflow-y-auto rounded-xl">
          {options.map((time, idx) => (
            <button
              key={time}
              id={'time-opt-' + idx}
              type="button"
              className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm ${value === time ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
              onClick={() => onSelect(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    );
  };
  TimeDropdown.displayName = 'TimeDropdown';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <div className="relative">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              <div className="flex items-center justify-center space-x-4">
                <Trophy className="w-16 h-16 text-green-600" />
                <span>Tìm Đội Chơi</span>
              </div>
            </h1>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Kết nối với cộng đồng thể thao Quy Nhon - Tham gia, tạo lập và trải nghiệm
            </p>
          </div>
        </div>

        <div className="mb-12">
          <div className="bg-white rounded-3xl shadow-sm p-3 border border-gray-100">
            <nav className="flex w-full justify-center space-x-3 min-w-0">
              <button
                onClick={() => {
                  setActiveTab('discover');
                  setSelectedMatch(null);
                }}
                className={`flex-1 py-4 px-8 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeTab === 'discover'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Khám phá trận đấu</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('my-matches');
                  setSelectedMatch(null);
                }}
                className={`flex-1 py-4 px-8 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeTab === 'my-matches'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Trận đấu của tôi</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('create');
                  setSelectedMatch(null);
                }}
                className={`flex-1 py-4 px-8 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeTab === 'create'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Tạo trận đấu</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'discover' && (
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
                    onClick={() => setShowCreateForm(true)}
                    className="sm:hidden bg-green-600 text-white p-4 rounded-full shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {filteredMatches.map((match) => (
                    <div key={match.id}>
                      <MatchCard match={match} isDetailed={false} />
                    </div>
                  ))}
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
                      onClick={() => setActiveTab('create')}
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
        )}

        {activeTab === 'my-matches' && (
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
                    <div className="space-y-6">
                      {myFilteredMatches.map((match) => (
                        <div key={match.id} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getSportGradient()} flex items-center justify-center text-white shadow-sm`}>
                                  {React.createElement(getSportIcon(match.sport))}
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">{match.title}</h3>
                                  <p className="text-xs text-gray-500 font-medium">{match.sport}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-600 text-sm">
                                <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3 text-gray-600" />
                                    <span className="font-semibold">{match.date}</span>
                                  </div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-gray-600" />
                                    <span className="font-semibold">{match.time}</span>
                                  </div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3 text-gray-600" />
                                    <span className="truncate font-semibold">{match.location}</span>
                                  </div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                                  <div className="flex items-center space-x-1">
                                    <Users className="w-3 h-3 text-gray-600" />
                                    <span className="font-semibold">{1 + match.joinRequests.filter(r => r.status === 'approved').length}/{match.maxParticipants}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:items-end space-y-2 mt-2 sm:mt-0">
                              {getStatusBadge(match.status)}
                              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                match.organizer === user?.name 
                                  ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                                  : 'bg-blue-100 text-blue-700 border border-blue-200'
                              }`}>
                                {match.organizer === user?.name ? (
                                  <div className="flex items-center space-x-1">
                                    <Trophy className="w-3 h-3" />
                                    <span>Tổ chức</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    <Users className="w-3 h-3" />
                                    <span>Tham gia</span>
                                  </div>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <button 
                              className="px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 font-semibold text-sm shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center space-x-2" 
                              onClick={() => setSelectedMatch(match.id)}
                            >
                              <Eye className="w-4 h-4" />
                              <span>Xem chi tiết</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  // Xem chi tiết trận đấu vẫn giữ nguyên logic cũ
                  <>
                    {/* Phần chi tiết trận đấu */}
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
        )}

        {activeTab === 'create' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <div className="p-8 sm:p-12">
              {!isAuthenticated ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Plus className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center space-x-2">
                    <Shield className="w-6 h-6 text-gray-600" />
                    <span>Vui lòng đăng nhập</span>
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Bạn cần đăng nhập để có thể tạo trận đấu mới
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
                      <Zap className="w-10 h-10 text-green-600" />
                      <span>Tạo trận đấu mới</span>
                    </h2>
                    <p className="text-gray-600 font-medium text-lg">Tạo cơ hội kết nối và vận động cùng cộng đồng thể thao</p>
                  </div>
                  <form className="space-y-10" onSubmit={handleCreateMatch}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-green-600" />
                          <span>Tên trận đấu *</span>
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                          placeholder="VD: Giao hữu bóng đá cuối tuần"
                          value={newMatch.title}
                          onChange={e => setNewMatch({ ...newMatch, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span>Môn thể thao *</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-white text-left font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all flex items-center justify-between hover:border-green-500"
                            onClick={() => setCreateDropdown(d => ({ ...d, sport: !d.sport }))}
                          >
                            <span>{newMatch.sport || 'Chọn môn thể thao'}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                          </button>
                          {createDropdown.sport && (
                            <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-green-500 rounded-xl shadow-xl">
                              {sportOptions.map(option => (
                                <button
                                  key={option.value}
                                  className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm first:rounded-t-xl last:rounded-b-xl ${newMatch.sport === option.value ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
                                  onClick={() => {
                                    setNewMatch(prev => ({ ...prev, sport: option.value }));
                                    setCreateDropdown(d => ({ ...d, sport: false }));
                                  }}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span>Ngày *</span>
                        </label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                          value={newMatch.date}
                          onChange={e => setNewMatch({ ...newMatch, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span>Giờ *</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            className={`w-full px-4 py-4 border border-gray-200 rounded-2xl bg-white text-left font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all flex items-center justify-between hover:border-green-500 ${createDropdown.time ? 'border-green-500 ring-2 ring-green-500' : ''}`}
                            onClick={() => setCreateDropdown(d => ({ ...d, time: !d.time }))}
                          >
                            <span className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className={newMatch.time ? '' : 'text-gray-400'}>{newMatch.time || 'Chọn giờ'}</span>
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                          </button>
                          {createDropdown.time && (
                            <TimeDropdown
                              value={newMatch.time}
                              options={timeOptions}
                              onSelect={time => {
                                setNewMatch(prev => ({ ...prev, time }));
                                setCreateDropdown(d => ({ ...d, time: false }));
                              }}
                              onClose={() => setCreateDropdown(d => ({ ...d, time: false }))}
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span>Số người tối đa *</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="2"
                          max="22"
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                          value={newMatch.maxParticipants}
                          onChange={e => setNewMatch({ ...newMatch, maxParticipants: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span>Địa điểm *</span>
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                          placeholder="VD: Sân bóng Quy Nhon Center"
                          value={newMatch.location}
                          onChange={e => setNewMatch({ ...newMatch, location: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                          <Target className="w-4 h-4 text-green-600" />
                          <span>Trình độ *</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-white text-left font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all flex items-center justify-between hover:border-green-500"
                            onClick={() => setCreateDropdown(d => ({ ...d, skillLevel: !d.skillLevel }))}
                          >
                            <span>{newMatch.skillLevel || 'Chọn trình độ'}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                          </button>
                          {createDropdown.skillLevel && (
                            <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-green-500 rounded-xl shadow-xl">
                              {skillLevelOptions.map(option => (
                                <button
                                  key={option.value}
                                  className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm first:rounded-t-xl last:rounded-b-xl ${newMatch.skillLevel === option.value ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700'}`}
                                  onClick={() => {
                                    setNewMatch(prev => ({ ...prev, skillLevel: option.value }));
                                    setCreateDropdown(d => ({ ...d, skillLevel: false }));
                                  }}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span>Mô tả</span>
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200 resize-none"
                        placeholder="Mô tả chi tiết về trận đấu, yêu cầu, ghi chú..."
                        value={newMatch.description}
                        onChange={e => setNewMatch({ ...newMatch, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-green-600" />
                          <span>Số điện thoại liên hệ *</span>
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                          placeholder="Nhập số điện thoại"
                          value={newMatch.phone}
                          onChange={e => setNewMatch({ ...newMatch, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center space-x-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span>Link Facebook *</span>
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 transition-all duration-200"
                          placeholder="Nhập link Facebook"
                          value={newMatch.facebook}
                          onChange={e => setNewMatch({ ...newMatch, facebook: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">
                      <button
                        type="button"
                        className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
                        onClick={() => setActiveTab('discover')}
                      >
                        <X className="w-4 h-4" />
                        <span>Hủy bỏ</span>
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Tạo trận đấu</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span>Tạo trận đấu mới</span>
                </h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600 font-medium">Chuyển sang tab &quot;Tạo trận đấu&quot; để tạo trận đấu mới</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};