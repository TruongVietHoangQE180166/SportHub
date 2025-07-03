export type SkillLevel = 'Thấp' | 'Trung bình' | 'Cao' | 'Chuyên nghiệp';
export type MatchStatus = 'open' | 'full' | 'finished' | 'cancelled';
export type MatchRole = 'organizer' | 'participant';
export type JoinRequestStatus = 'pending' | 'approved';

export interface JoinRequest {
  user: string;
  status: JoinRequestStatus;
}

export interface Match {
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
  skillLevel: SkillLevel;
  description: string;
  status: MatchStatus;
  phone: string;
  facebook: string;
  role: MatchRole;
  joinRequests: JoinRequest[];
}
