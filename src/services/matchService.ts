import { api } from '../config/api.config';

// Define the interface for creating a match request based on the provided structure
export interface CreateMatchRequest {
  nameMatch: string;
  descriptionMatch: string;
  nameSport: string;
  timeMatch: string; // ISO 8601 format date string
  maxPlayers: number;
  location: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'PROFESSIONAL';
  numberPhone: string;
  linkFacebook: string;
}

// Define the response interface for a match member
export interface MatchMember {
  userId: string;
  username: string;
  email: string;
}

// Define the response interface for a single match
export interface MatchDataResponse {
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

// Define the response interface for creating a match
export interface CreateMatchResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: Array<{
    field: string;
    message: string;
  }> | null;
  data: MatchDataResponse;
  success: boolean;
}

// Define the paginated response interface for getMyMatch
export interface GetMyMatchResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    content: MatchDataResponse[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}

// Define the response interface for join match request
export interface JoinMatchResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: null;
  success: boolean;
}

// Define the response interface for team request
export interface TeamRequest {
  id: string;
  teamId: string;
  userId: string;
  username: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  location: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'PROFESSIONAL';
  maxPlayers: number;
  nameMatch: string;
  nameSport: string;
}

// Define the response interface for get team requests
export interface GetTeamRequestsResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    content: TeamRequest[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}

export const createMatch = async (matchData: CreateMatchRequest): Promise<CreateMatchResponse> => {
  try {
    const response = await api.post<CreateMatchResponse>('/api/team', matchData);
    return response.data;
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

export const getMyMatch = async (userId: string): Promise<GetMyMatchResponse> => {
  try {
    const response = await api.get<GetMyMatchResponse>('/api/team/all', {
      params: {
        page: 1,
        size: 1000,
        field: 'createdDate',
        direction: 'desc',
        userId: userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user matches:', error);
    throw error;
  }
};

export const getAllMatch = async (): Promise<GetMyMatchResponse> => {
  try {
    const response = await api.get<GetMyMatchResponse>('/api/team/all', {
      params: {
        page: 1,
        size: 1000,
        field: 'createdDate',
        direction: 'desc',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user matches:', error);
    throw error;
  }
};

export const joinMatch = async (teamId: string): Promise<JoinMatchResponse> => {
  try {
    const response = await api.post<JoinMatchResponse>('/api/team-request/{teamId}', null, {
      params: {
        teamId: teamId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error joining match:', error);
    throw error;
  }
};

export const getTeamRequests = async (userId: string): Promise<GetTeamRequestsResponse> => {
  try {
    const response = await api.get<GetTeamRequestsResponse>('/api/team-request/userId', {
      params: {
        page: 1,
        size: 1000,
        field: 'createdDate',
        direction: 'desc',
        userId: userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching team requests:', error);
    throw error;
  }
};