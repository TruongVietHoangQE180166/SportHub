// src/services/authService.ts

import { AuthUser, LoginCredentials, RegisterData } from "@/types/auth";
import { MOCK_USERS } from "@/data/auth";

const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    await simulateApiDelay();
    const user = MOCK_USERS.find(u => u.email === credentials.email);
    if (!user || user.password !== credentials.password) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    const { password, ...safeUser } = user;
    return safeUser;
  },
  
  register: async (data: RegisterData): Promise<AuthUser> => {
    await simulateApiDelay();
    const emailExists = MOCK_USERS.some(u => u.email === data.email);
    if (emailExists) {
      throw new Error('Email đã được sử dụng');
    }
    const newUser: AuthUser = {
      id: (MOCK_USERS.length + 1).toString(),
      name: data.name,
      email: data.email,
      loyaltyPoints: 0,
    };
    return newUser;
  },

  fetchAllUsers: async (): Promise<AuthUser[]> => {
    return MOCK_USERS.map(({ password, ...user }) => user);
  }
};