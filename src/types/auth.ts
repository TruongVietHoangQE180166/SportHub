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
}
  
export interface RegisterData {
    name: string;
    email: string;
    password: string; 
}
  
export interface LoginCredentials {
    email: string;
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
}
  
export type AuthStore = AuthState & AuthActions;