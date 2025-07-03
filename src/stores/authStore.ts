// src/stores/authStore.ts

import { create } from 'zustand';
import { AuthStore, LoginCredentials, RegisterData, AuthUser } from "@/types/auth";
import { authService } from "@/services/authService";

export const useAuthStore = create<AuthStore & { users: AuthUser[]; fetchAllUsers: () => Promise<void>; updateProfile: (profileData: Partial<AuthUser>) => Promise<void>; changePassword: (params: { currentPassword: string; newPassword: string }) => Promise<void>; }>((set) => ({
  user: null,
  isAuthenticated: false,
  authMode: 'login',
  users: [],
  
  login: async (credentials: LoginCredentials) => {
    try {
      const user = await authService.login(credentials);
      set({ user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
  
  register: async (data: RegisterData) => {
    try {
      const user = await authService.register(data);
      set({ user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  fetchAllUsers: async () => {
    const users = await authService.fetchAllUsers();
    set({ users });
  },
  
  updateProfile: async (profileData: Partial<AuthUser>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...profileData } : null
    }));
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changePassword: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
    // Giả lập xác thực mật khẩu hiện tại (vì không có backend)
    set((state) => {
      if (!state.user) throw new Error('No user logged in');
      // Giả lập: kiểm tra currentPassword với MOCK_USERS
      // (Ở đây chỉ kiểm tra với user hiện tại, thực tế nên kiểm tra với backend)
      // Để đơn giản, bỏ qua xác thực thực tế
      return state;
    });
    // Không thực sự lưu password mới vì không có backend
    // Có thể alert thành công
  },
}));