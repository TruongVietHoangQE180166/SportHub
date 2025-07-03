import { create } from 'zustand';
import { Match } from '../types/match';
import { matchService } from '../services/matchService';

interface MatchStore {
  matches: Match[];
  fetchAllMatches: () => Promise<void>;
  createMatch: (match: Match) => Promise<void>;
  joinMatch: (matchId: number, user: string) => Promise<void>;
  approveJoinRequest: (matchId: number, user: string) => Promise<void>;
  rejectJoinRequest: (matchId: number, user: string) => Promise<void>;
  cancelMatch: (matchId: number) => void;
  deleteMatch: (matchId: number) => void;
  leaveMatch: (matchId: number, userName: string) => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  matches: [],
  fetchAllMatches: async () => {
    const data = await matchService.fetchAllMatches();
    set({ matches: data });
  },
  createMatch: async (match) => {
    await matchService.createMatch(match);
    const data = await matchService.fetchAllMatches();
    set({ matches: data });
  },
  joinMatch: async (matchId, user) => {
    await matchService.joinMatch(matchId, user);
    const data = await matchService.fetchAllMatches();
    set({ matches: data });
  },
  approveJoinRequest: async (matchId, user) => {
    await matchService.approveJoinRequest(matchId, user);
    const data = await matchService.fetchAllMatches();
    set({ matches: data });
  },
  rejectJoinRequest: async (matchId, user) => {
    await matchService.rejectJoinRequest(matchId, user);
    const data = await matchService.fetchAllMatches();
    set({ matches: data });
  },
  cancelMatch: (matchId: number) => set((state) => ({
    matches: state.matches.map(m => m.id === matchId ? { ...m, status: 'cancelled' } : m)
  })),
  deleteMatch: (matchId: number) => set((state) => ({
    matches: state.matches.filter(m => m.id !== matchId)
  })),
  leaveMatch: (matchId: number, userName: string) => set((state) => ({
    matches: state.matches.map(m => m.id === matchId ? {
      ...m,
      joinRequests: m.joinRequests.filter(jr => !(jr.user === userName && jr.status === 'approved'))
    } : m)
  })),
}));
