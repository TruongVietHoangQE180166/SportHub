'use client';
import React from 'react';
import { Users, Calendar, Clock, MapPin, Trophy, Zap, Shield } from 'lucide-react';
import { getSkillLevelColor, getSportIcon, getSportGradient, getStatusBadge } from './matchUtils';
import { useAuthStore } from '@/stores/authStore';
import { updateTeamJoinRequest, removeTeamMember } from '@/services/matchService';
import { ConfirmationModal } from './ConfirmationModal';

// Define types that match the API response structure
interface MatchMember {
  userId: string;
  username: string;
  email: string;
}

// Add the Join interface to match the API response structure
interface Join {
  id: string;
  teamId: string;
  nameMatch: string;
  nameSport: string;
  userId: string;
  username: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
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
  teamJoinRequest: Join[]; // Add this line
}

// Define the Match interface that the component expects
interface Match {
  id: string;
  title: string;
  sport: string;
  organizer: string;
  ownerId: string;
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
  teamJoinRequests: Join[];
  members?: MatchMember[];
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
    id: apiMatch.id, // Keep ID as string
    title: apiMatch.nameMatch,
    sport: apiMatch.nameSport,
    organizer: apiMatch.ownerName,
    ownerId: apiMatch.ownerId,
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
    joinRequests,
    teamJoinRequests: apiMatch.teamJoinRequest,
    members: apiMatch.members // Add this line
  };
};

interface MatchCardProps {
  match: Match;
  isDetailed?: boolean;
  onJoinMatch?: (matchId: string) => void;
  onSelectMatch?: (matchId: string) => void;
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
  // Validate match ID
  const validMatch = {
    ...match,
    id: match.id || '0'
  };
  
  // Get real authentication state and user data
  const { user, isAuthenticated } = useAuthStore();

  // Add state for handling team join request updates
  const [updatingRequests, setUpdatingRequests] = React.useState<Record<string, boolean>>({});
  
  // Add state for handling member removal
  const [removingMembers, setRemovingMembers] = React.useState<Record<string, boolean>>({});

  // Add state for handling member leaving
  const [leavingMatch, setLeavingMatch] = React.useState<boolean>(false);

  // Add state for confirmation modals
  const [confirmationModal, setConfirmationModal] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isLoading: false,
    type: 'danger' as 'danger' | 'success'
  });

  // Function to open confirmation modal
  const openConfirmationModal = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'success' = 'danger') => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      isLoading: false,
      type
    });
  };

  // Function to close confirmation modal
  const closeConfirmationModal = () => {
    setConfirmationModal(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  // Function to handle accepting or rejecting team join requests
  const handleTeamJoinRequestUpdate = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!user || !isOrganizer) return;
    
    // Set loading state for this specific request
    setUpdatingRequests(prev => ({ ...prev, [requestId]: true }));
    
    try {
      // Call the API to update the team join request
      await updateTeamJoinRequest(requestId, status);
      
      // You might want to add a success notification here
      // For now, we'll just refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating team join request:', error);
      // You might want to add an error notification here
    } finally {
      // Reset loading state
      setUpdatingRequests(prev => {
        const newUpdating = { ...prev };
        delete newUpdating[requestId];
        return newUpdating;
      });
    }
  };

  // Function to handle kicking a team member
  const handleKickMember = async (teamId: string, userId: string) => {
    if (!user || !isOrganizer) return;
    
    // Set loading state for this specific member
    setRemovingMembers(prev => ({ ...prev, [userId]: true }));
    
    try {
      // Call the API to remove the team member
      await removeTeamMember(teamId, userId, true); // true for kick
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error removing team member:', error);
      // You might want to add an error notification here
    } finally {
      // Reset loading state
      setRemovingMembers(prev => {
        const newRemoving = { ...prev };
        delete newRemoving[userId];
        return newRemoving;
      });
    }
  };

  // Function to handle member leaving the match
  const handleLeaveMatch = async (teamId: string) => {
    if (!user) return;
    
    // Set loading state
    setLeavingMatch(true);
    
    try {
      // Call the API to remove the team member (with isKick = false)
      await removeTeamMember(teamId, user.id, false); // false for leaving voluntarily
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error leaving match:', error);
      // You might want to add an error notification here
    } finally {
      // Reset loading state
      setLeavingMatch(false);
    }
  };

  const isOrganizer = user ? validMatch.ownerId === user.id : false;
  const isParticipant = user ? validMatch.joinRequests.some(r => r.user === user.name && r.status === 'approved') : false;
  const isPending = user ? validMatch.joinRequests.some(r => r.user === user.name && r.status === 'pending') : false;
  const SportIcon = getSportIcon(validMatch.sport);

  return (
    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 ${
      isDetailed ? 'ring-1 ring-green-200' : ''
    } group`}>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        isLoading={confirmationModal.isLoading}
        type={confirmationModal.type}
      />
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getSportGradient()} flex items-center justify-center text-white shadow-sm`}>
                {React.createElement(SportIcon)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {validMatch.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium">{validMatch.sport}</p>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <div>
                <span className="text-xs text-gray-500 font-medium">Tổ chức bởi</span>
                <p className="text-xs font-semibold text-gray-900">{validMatch.organizer}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge(validMatch.status)}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
            <div className="flex items-center space-x-1 text-gray-700">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs font-semibold truncate">{validMatch.date}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
            <div className="flex items-center space-x-1 text-gray-700">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs font-semibold">{validMatch.time}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
            <div className="flex items-center space-x-1 text-gray-700">
              <Users className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs font-semibold">
                {1 + (validMatch.members && Array.isArray(validMatch.members) ? validMatch.members.length : 0)}/{validMatch.maxParticipants}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
            <div className="flex items-center space-x-1 text-gray-700">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs font-semibold truncate">{validMatch.location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSkillLevelColor(validMatch.skillLevel as any)}`}> 
            <div className="flex items-center space-x-1">
              <Trophy className="w-3 h-3" />
              <span>{validMatch.skillLevel}</span>
            </div>
          </span>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
          <p className="text-gray-700 text-xs leading-relaxed">{validMatch.description}</p>
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
                  onClick={() => onJoinMatch?.(validMatch.id)}
                  disabled={validMatch.status !== 'open'}
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
              onClick={() => onSelectMatch?.(validMatch.id)}
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
                    <span className="font-bold text-gray-900 text-sm">{validMatch.organizer || 'Unknown Organizer'}</span>
                    <p className="text-xs text-orange-600 font-medium flex items-center space-x-1">
                      <Trophy className="w-3 h-3" />
                      <span>Tổ chức viên</span>
                    </p>
                  </div>
                </div>
                {validMatch.members && Array.isArray(validMatch.members) && validMatch.members.map((member, idx) => {
                  // Since the API already provides userId in the members array, we can use it directly
                  const userId = member.userId || '';
                  
                  // Log userId for debugging
                  console.log(`Member: ${member.username}, userId: ${userId}, isOrganizer: ${isOrganizer}`);
                  
                  return (
                    <div key={idx} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-gray-900 text-sm">{member.username || 'Unknown User'}</span>
                          <div className="text-xs text-gray-500 truncate">{member.email || 'No email'}</div>
                          <div className="text-xs font-medium text-green-600">
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>Thành viên</span>
                            </span>
                          </div>
                        </div>
                        {/* Kick button for organizers (not for the organizer themselves) */}
                        {isOrganizer && userId && member.username !== validMatch.organizer && (
                          <button
                            className="px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-semibold flex items-center justify-center disabled:opacity-50 shadow-sm"
                            onClick={() => openConfirmationModal(
                              'Xác nhận kick thành viên',
                              `Bạn có chắc chắn muốn kick thành viên ${member.username} khỏi trận đấu?`,
                              () => handleKickMember(validMatch.id, userId),
                              'danger'
                            )}
                            disabled={removingMembers[userId]}
                          >
                            {removingMembers[userId] ? (
                              <span>Đang xử lý...</span>
                            ) : (
                              <span>Kick</span>
                            )}
                          </button>
                        )}
                        {/* Leave button for members (not for the organizer) */}
                        {user && userId === user.id && !isOrganizer && (
                          <button
                            className="px-3 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 text-sm font-semibold flex items-center justify-center disabled:opacity-50 shadow-sm"
                            onClick={() => openConfirmationModal(
                              'Xác nhận rời khỏi trận đấu',
                              'Bạn có chắc chắn muốn rời khỏi trận đấu này?',
                              () => handleLeaveMatch(validMatch.id),
                              'danger'
                            )}
                            disabled={leavingMatch}
                          >
                            {leavingMatch ? (
                              <span>Đang xử lý...</span>
                            ) : (
                              <span>Rời khỏi</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Team Join Requests Section */}
              {(() => {
                // Filter out rejected requests - only show pending and approved requests
                const filteredTeamJoinRequests = validMatch.teamJoinRequests && Array.isArray(validMatch.teamJoinRequests) 
                  ? validMatch.teamJoinRequests.filter(request => request.status !== 'REJECTED')
                  : [];
                
                const shouldRender = filteredTeamJoinRequests.length > 0;
                
                if (shouldRender) {
                  return (
                    <div className="mt-6">
                      <h4 className="font-bold text-base text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-blue-600" />
                        Yêu cầu tham gia đội
                      </h4>
                      <div className="space-y-2">
                        {filteredTeamJoinRequests.map((request, idx) => {
                          return (
                            <div key={idx} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-semibold text-gray-900 text-sm">{request.username || 'Unknown User'}</span>
                                  <div className="text-xs">
                                    <span className={`font-medium ${
                                      request.status === 'PENDING' ? 'text-yellow-600' : 
                                      request.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {request.status === 'PENDING' ? 'Chờ duyệt' : 
                                       request.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {request.id ? request.id.substring(0, 8) : 'N/A'}...
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-gray-600">
                                <div>Trận đấu: {request.nameMatch || 'N/A'}</div>
                                <div>Môn thể thao: {request.nameSport || 'N/A'}</div>
                              </div>
                              {/* Add accept/reject buttons for pending requests (only for organizers) */}
                              {request.status === 'PENDING' && isOrganizer && (
                                <div className="mt-3 flex space-x-2">
                                  <button
                                    className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-semibold flex items-center justify-center disabled:opacity-50"
                                    onClick={() => openConfirmationModal(
                                      'Xác nhận chấp nhận yêu cầu',
                                      `Bạn có chắc chắn muốn chấp nhận yêu cầu tham gia của ${request.username}?`,
                                      () => handleTeamJoinRequestUpdate(request.id, 'APPROVED'),
                                      'success'
                                    )}
                                    disabled={updatingRequests[request.id]}
                                  >
                                    {updatingRequests[request.id] ? (
                                      <span>Đang xử lý...</span>
                                    ) : (
                                      <span>Chấp nhận</span>
                                    )}
                                  </button>
                                  <button
                                    className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-semibold flex items-center justify-center disabled:opacity-50"
                                    onClick={() => openConfirmationModal(
                                      'Xác nhận từ chối yêu cầu',
                                      `Bạn có chắc chắn muốn từ chối yêu cầu tham gia của ${request.username}?`,
                                      () => handleTeamJoinRequestUpdate(request.id, 'REJECTED'),
                                      'danger'
                                    )}
                                    disabled={updatingRequests[request.id]}
                                  >
                                    {updatingRequests[request.id] ? (
                                      <span>Đang xử lý...</span>
                                    ) : (
                                      <span>Từ chối</span>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })()}
              
              <div className="mt-4 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <h5 className="font-bold text-gray-900 mb-2 flex items-center space-x-2 text-sm">
                  <span className="text-green-600">Liên hệ người tổ chức</span>
                </h5>
                <p className="text-xs text-gray-600 mb-2">Liên hệ người tổ chức để nắm rõ thông tin về trận đấu.</p>
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-gray-900 text-sm">{validMatch.organizer || 'Unknown Organizer'}</span>
                </div>
                <div className="text-xs text-gray-700 mb-1">Số điện thoại: <span className="font-medium">{validMatch.phone || 'N/A'}</span></div>
                <div className="text-xs text-gray-700">
                  Facebook: 
                  {validMatch.facebook ? (
                    <a href={validMatch.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {validMatch.facebook}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};