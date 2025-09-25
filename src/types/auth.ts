// src/types/auth.ts

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    loyaltyPoints: number;
    phone?: string;
    bio?: string;
    country?: string;
    cityState?: string;
    postalCode?: string;
    taxId?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    // Additional fields based on API response
    createdDate?: string;
    updatedDate?: string;
    nickName?: string;
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    addresses?: {
        id: string;
        createdBy: string;
        updatedBy: string;
        createdDate: string;
        updatedDate: string;
        address: string;
        other: string;
        default: boolean;
    }[];
    information?: {
        id: string;
        createdBy: string;
        updatedBy: string;
        createdDate: string;
        updatedDate: string;
        facebook: string;
        instagram: string;
        tiktok: string;
        zalo: string;
        twitter: string;
    };
    bankNo?: string;
    accountNo?: string;
    bankName?: string;
    qrCode?: string;
    userId?: string;
}
  
export interface RegisterData {
    username: string;
    password: string; 
    email: string;
}
  
export interface LoginCredentials {
    username: string;
    password: string;
}
  
export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    authMode: 'login' | 'register';
}
  
export interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfile: (profileData: Partial<AuthUser>) => Promise<void>;
    changePassword: (params: { currentPassword: string; newPassword: string }) => Promise<void>;
    sendOTP: (email: string) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<void>;
}
  
export type AuthStore = AuthState & AuthActions;