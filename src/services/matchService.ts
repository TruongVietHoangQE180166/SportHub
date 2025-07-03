import { Match } from '../types/match';
import { MOCK_MATCHES } from '../data/match';

let matches: Match[] = [...MOCK_MATCHES];

function updateMatchStatus(match: Match): Match {
  if (match.status === 'finished' || match.status === 'cancelled') {
    return match;
  }
  const approvedCount = match.joinRequests.filter(r => r.status === 'approved').length;
  const total = 1 + approvedCount;
  const status = total >= match.maxParticipants ? 'full' : 'open';
  return { ...match, status };
}

export const matchService = {
  fetchAllMatches: async (): Promise<Match[]> => {
    return matches.map(updateMatchStatus);
  },
  createMatch: async (match: Match): Promise<void> => {
    matches.push(updateMatchStatus(match));
  },
  joinMatch: async (matchId: number, user: string): Promise<void> => {
    matches = matches.map(m =>
      m.id === matchId && !m.joinRequests.some(r => r.user === user)
        ? updateMatchStatus({ ...m, joinRequests: [...m.joinRequests, { user, status: 'pending' }] })
        : updateMatchStatus(m)
    );
  },
  approveJoinRequest: async (matchId: number, user: string): Promise<void> => {
    matches = matches.map(m =>
      m.id === matchId
        ? updateMatchStatus({ ...m, joinRequests: m.joinRequests.map(r => r.user === user ? { ...r, status: 'approved' as const } : r) })
        : updateMatchStatus(m)
    );
  },
  rejectJoinRequest: async (matchId: number, user: string): Promise<void> => {
    matches = matches.map(m =>
      m.id === matchId
        ? updateMatchStatus({ ...m, joinRequests: m.joinRequests.filter(r => r.user !== user) })
        : updateMatchStatus(m)
    );
  },
  cancelMatch: async (matchId: number): Promise<void> => {
    matches = matches.map(m => m.id === matchId ? { ...m, status: 'cancelled' as const } : m);
  },
  deleteMatch: async (matchId: number): Promise<void> => {
    matches = matches.filter(m => m.id !== matchId);
  },
  leaveMatch: async (matchId: number, user: string): Promise<void> => {
    matches = matches.map(m =>
      m.id === matchId
        ? { ...m, joinRequests: m.joinRequests.filter(r => r.user !== user) }
        : m
    );
  },
};
