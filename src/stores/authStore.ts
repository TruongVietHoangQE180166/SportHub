// src/stores/authStore.ts

import { create } from "zustand";
import {
  AuthStore,
  LoginCredentials,
  RegisterData,
  AuthUser,
} from "@/types/auth";
import { authService } from "@/services/authService";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  authMode: "login" as "login" | "register",
  users: [],
};

export const useAuthStore = create<
  AuthStore & {
    users: AuthUser[];
    fetchAllUsers: () => Promise<void>;
    updateProfile: (profileData: Partial<AuthUser>) => Promise<void>;
    changePassword: (params: {
      currentPassword: string;
      newPassword: string;
    }) => Promise<void>;
    sendOTP: (email: string) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<void>;
    resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
    fetchUserProfile: (userId: string) => Promise<AuthUser>;
    uploadImage: (file: File) => Promise<string>;
  }
>((set, get) => ({
  ...initialState,

  login: async (credentials: LoginCredentials) => {
    try {
      const result = await authService.login(credentials);
      set({ user: result.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    try {
      await authService.register(data);
    } catch (error) {
      throw error;
    }
  },

  sendOTP: async (email: string) => {
    try {
      await authService.sendOTP(email);
    } catch (error) {
      throw error;
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      await authService.verifyOTP(email, otp);
    } catch (error) {
      throw error;
    }
  },

  // Add resetPassword function implementation
  resetPassword: async (email: string, otp: string, newPassword: string) => {
    try {
      await authService.resetPassword(email, otp, newPassword);
    } catch (error) {
      throw error;
    }
  },

  // Add fetchUserProfile function implementation
  fetchUserProfile: async (userId: string) => {
    try {
      const user = await authService.fetchUserProfile(userId);
      // Update the user in the store with the full profile data
      set({ user });
      return user;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    // Clear sessionStorage on logout
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("userEmail");
    }
    set({ user: null, isAuthenticated: false });
  },

  fetchAllUsers: async () => {
    const users = await authService.fetchAllUsers();
    set({ users });
  },

  updateProfile: async (profileData: Partial<AuthUser>) => {
    try {
      // Get the current user ID
      const currentState = get();
      const userId = currentState.user?.id;
      
      if (!userId) {
        throw new Error("No authenticated user found");
      }
      
      // Call the authService updateProfile function
      const updatedUser = await authService.updateProfile(profileData);
      
      // Update the user in the store with the updated profile data
      set({ user: updatedUser });
    } catch (error) {
      throw error;
    }
  },
  
  // Add uploadImage function implementation
  uploadImage: async (file: File) => {
    try {
      const imageUrl = await authService.uploadImage(file);
      return imageUrl;
    } catch (error) {
      throw error;
    }
  },

  // Update changePassword function implementation
  changePassword: async ({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
    } catch (error) {
      throw error;
    }
  },

}));

// Function to rehydrate auth state from sessionStorage - should be called in a useEffect in components
export const rehydrateAuthState = () => {
  if (typeof window !== 'undefined') {
    const accessToken = sessionStorage.getItem("accessToken");
    const userId = sessionStorage.getItem("userId");
    const username = sessionStorage.getItem("username");
    const userEmail = sessionStorage.getItem("userEmail");
    
    if (accessToken && userId && username && userEmail) {
      useAuthStore.setState({
        user: {
          id: userId,
          name: username,
          email: userEmail,
          loyaltyPoints: 0, // Will be updated when full profile is fetched
        } as AuthUser,
        isAuthenticated: true,
      });
    }
  }
};
