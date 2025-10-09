'use client';
import React from 'react';
import { Users, Calendar, Clock, MapPin, Trophy, Zap, Shield } from 'lucide-react';
import { getSkillLevelColor, getSportIcon, getSportGradient, getStatusBadge } from './matchUtils';
import { useAuthStore } from '@/stores/authStore';

// Define types that match the API response structure
interface MatchMember {
  userId: string;
  username: string;
  email: string;
}

interface APIMatch {
  id: string;
  ownerId: string;
  ownerName: string;
  nameMatch: string;
  descriptionMatch: string;
  nameSport: string;
  timeMatch: string; // ISO 8601 format date string
  maxPlayers: number;
  location: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'PROFESSIONAL';
  numberPhone: string;
  linkFacebook: string;
  members: MatchMember[];
}

// Define the Match interface that the component expects
interface Match {
  id: number;
  title: string;
  sport: string;
  organizer: string;
  organizerAvatar: string;
  date: string;
  time: string;
  location: string;
  address: string;
  maxParticipants: number;
  skillLevel: string;
  description: string;
  status: string;
  phone: string;
  facebook: string;
  role: 'organizer' | 'participant';
  joinRequests: Array<{ user: string; status: string }>;
}

// Utility function to convert API match to component match
export const convertAPIMatchToMatch = (apiMatch: APIMatch, currentUserId: string): Match => {
  // Convert date and time from ISO string
  const dateObj = new Date(apiMatch.timeMatch);
  const date = dateObj.toISOString().split('T')[0];
  const time = dateObj.toTimeString().split(' ')[0].substring(0, 5);
  
  // Convert level enum to Vietnamese
  const skillLevel = apiMatch.level === 'LOW' ? 'Thấp' : 
                    apiMatch.level === 'MEDIUM' ? 'Trung bình' : 
                    apiMatch.level === 'HIGH' ? 'Cao' : 'Chuyên nghiệp';
  
  // Determine user role
  const role = apiMatch.ownerId === currentUserId ? 'organizer' : 'participant';
  
  // Convert members to join requests format
  const joinRequests = apiMatch.members.map(member => ({
    user: member.username,
    status: 'approved' // Assuming all members are approved in this context
  }));
  
  return {
    id: parseInt(apiMatch.id, 10),
    title: apiMatch.nameMatch,
    sport: apiMatch.nameSport,
    organizer: apiMatch.ownerName,
    organizerAvatar: '', // Would need to fetch this separately
    date,
    time,
    location: apiMatch.location,
    address: apiMatch.location,
    maxParticipants: apiMatch.maxPlayers,
    skillLevel,
    description: apiMatch.descriptionMatch,
    status: 'open', // Default status, would need to be determined from API data
    phone: apiMatch.numberPhone,
    facebook: apiMatch.linkFacebook,
    role,
    joinRequests
  };
};

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
  // Get real authentication state and user data
  const { user, isAuthenticated } = useAuthStore();

  const isOrganizer = user ? match.organizer === user.name : false;
  const isParticipant = user ? match.joinRequests.some(r => r.user === user.name && r.status === 'approved') : false;
  const isPending = user ? match.joinRequests.some(r => r.user === user.name && r.status === 'pending') : false;
  const SportIcon = getSportIcon(match.sport);

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
            <div className="flex items-center mb-2">
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
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSkillLevelColor(match.skillLevel as any)}`}> 
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
          {showJoinButton && isAuthenticated && user && !isOrganizer && (
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
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <h4 className="font-bold text-base text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Danh sách thành viên
              </h4>
              <div className="space-y-2">
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">{match.organizer}</span>
                    <p className="text-xs text-orange-600 font-medium flex items-center space-x-1">
                      <Trophy className="w-3 h-3" />
                      <span>Tổ chức viên</span>
                    </p>
                  </div>
                </div>
                {match.joinRequests.filter(r => r.status === 'approved').map((req, idx) => {
                  return (
                    <div key={idx} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
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
                  <span className="text-green-600">Liên hệ người tổ chức</span>
                </h5>
                <p className="text-xs text-gray-600 mb-2">Liên hệ người tổ chức để nắm rõ thông tin về trận đấu.</p>
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-gray-900 text-sm">{match.organizer}</span>
                </div>
                <div className="text-xs text-gray-700 mb-1">Số điện thoại: <span className="font-medium">{match.phone}</span></div>
                <div className="text-xs text-gray-700">Facebook: <a href={match.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{match.facebook}</a></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};