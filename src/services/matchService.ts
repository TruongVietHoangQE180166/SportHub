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

export interface Join {
  id: string;
  teamId: string;
  nameMatch: string;
  nameSport: string;
  userId: string;
  username: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
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
  teamJoinRequest: Join[];
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

// Define the response interface for team join request approval/rejection
export interface TeamJoinRequestResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: null;
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

// Add the new function to remove a member from a team
export const removeTeamMember = async (
  teamId: string,
  userId: string,
  isKick: boolean
): Promise<TeamJoinRequestResponse> => {
  try {
    const response = await api.delete<TeamJoinRequestResponse>(
      `/api/team-request/${teamId}/members/${userId}`,
      {
        params: {
          isKick: isKick
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error removing team member:', error);
    throw error;
  }
};

// Add the new function to approve/reject team join requests
export const updateTeamJoinRequest = async (
  teamJoinRequestId: string, 
  status: 'APPROVED' | 'REJECTED'
): Promise<TeamJoinRequestResponse> => {
  try {
    const response = await api.post<TeamJoinRequestResponse>(
      `/api/team-request/join-requests/${teamJoinRequestId}`,
      null, // No body required
      {
        params: {
          status: status
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating team join request:', error);
    throw error;
  }
};
