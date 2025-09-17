'use client';
import React from 'react';
import { Users, Calendar, Clock, MapPin, Trash2, Trophy, Zap, Shield, X, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useMatchStore } from '@/stores/matchStore';
import { Match } from '@/types/match';
import Image from 'next/image';
import { getSkillLevelColor, getSportIcon, getSportGradient, findUserByName, getStatusBadge } from './matchUtils';

interface MatchCardProps {
  match: Match;
  isDetailed?: boolean;
  onJoinMatch?: (matchId: number) => void;
  onSelectMatch?: (matchId: number) => void;
  showJoinButton?: boolean;
  showDetailButton?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  isDetailed = false,
  onJoinMatch,
  onSelectMatch,
  showJoinButton = false,
  showDetailButton = false
}) => {
  const { user, isAuthenticated, users } = useAuthStore();
  const {
    approveJoinRequest,
    rejectJoinRequest,
    cancelMatch,
    deleteMatch,
    leaveMatch
  } = useMatchStore();

  const isOrganizer = match.organizer === user?.name;
  const isParticipant = match.joinRequests.some(r => r.user === user?.name && r.status === 'approved');
  const isPending = match.joinRequests.some(r => r.user === user?.name && r.status === 'pending');
  const SportIcon = getSportIcon(match.sport);
  const organizerUser = findUserByName(users, match.organizer);

  const handleApproveRequest = async (matchId: number, userName: string) => {
    await approveJoinRequest(matchId, userName);
  };

  const handleRejectRequest = async (matchId: number, userName: string) => {
    await rejectJoinRequest(matchId, userName);
  };

  const handleDeleteMatch = (matchId: number) => {
    deleteMatch(matchId);
  };

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
          {showJoinButton && isAuthenticated && !isOrganizer && (
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
                  onClick={() => onJoinMatch?.(match.id)}
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
          {showDetailButton && (
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 font-semibold text-sm shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center space-x-2" 
              onClick={() => onSelectMatch?.(match.id)}
            >
              <Users className="w-4 h-4" />
              <span>Xem chi tiết</span>
            </button>
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