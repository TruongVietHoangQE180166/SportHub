// src/services/authService.ts

import { AuthUser, LoginCredentials, RegisterData } from "@/types/auth";
import { api } from "@/config/api.config";

interface ApiResponse<T> {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: {
    field: string;
    message: string;
  }[];
  data: T;
  success: boolean;
}

interface LoginResponseData {
  accessToken: string;
  userId: string;
  username: string;
  email: string;
}

// Add interface for Google login response
interface GoogleLoginResponseData {
  username: string;
  password: string;
  email: string;
  status: string;
  role: string;
  userId: string;
  deleted: boolean;
}

interface RegisterResponseData {
  id: string;
  username: string;
  email: string;
  // Add other fields as needed
}

interface SendOTPResponseData {
  // Define the response structure for sendOTP if needed
  success: boolean;
}

// Add interface for reset password response
interface ResetPasswordResponseData {
  // Define the response structure for resetPassword if needed
  success: boolean;
}

// Add interface for user profile response based on the actual API response
interface UserProfileResponseData {
  id: string;
  createdDate: string;
  updatedDate: string;
  nickName: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  avatar: string;
  gender: string;
  addresses: {
    id: string;
    createdBy: string;
    updatedBy: string;
    createdDate: string;
    updatedDate: string;
    address: string;
    other: string;
    default: boolean;
  }[];
  information: {
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
  bankNo: string;
  accountNo: string;
  bankName: string;
  qrCode: string;
  userId: string;
  username: string;
}

// Add interface for update profile request
interface UpdateProfileRequest {
  nickName?: string;
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatar?: string;
  gender?: string;
  bankNo?: string;
  accountNo?: string;
  bankName?: string;
  addresses?: {
    address: string;
    other: string;
    default: boolean;
  }[];
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  zalo?: string;
  twitter?: string;
}

// Add interface for update profile response
interface UpdateProfileResponseData {
  id: string;
  createdDate: string;
  updatedDate: string;
  nickName: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  avatar: string;
  gender: string;
  addresses: {
    id: string;
    createdBy: string;
    updatedBy: string;
    createdDate: string;
    updatedDate: string;
    address: string;
    other: string;
    default: boolean;
  }[];
  information: {
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
  bankNo: string;
  accountNo: string;
  bankName: string;
  qrCode: string;
  userId: string;
  username: string;
}

// Add interface for change password response
interface ChangePasswordResponseData {
  success: boolean;
}

export const authService = {
  login: async (
    credentials: LoginCredentials
  ): Promise<{ user: AuthUser; accessToken: string }> => {
    try {
      const response = await api.post<ApiResponse<LoginResponseData>>(
        "/api/auth/login",
        credentials
      );

      // Save to sessionStorage
      sessionStorage.setItem("accessToken", response.data.data.accessToken);
      sessionStorage.setItem("userId", response.data.data.userId);
      sessionStorage.setItem("username", response.data.data.username);
      sessionStorage.setItem("userEmail", response.data.data.email);

      // Create AuthUser object from response
      const user: AuthUser = {
        id: response.data.data.userId,
        name: response.data.data.username,
        email: response.data.data.email,
        loyaltyPoints: 0, // Default value, will be updated when fetching user details
      };

      return { user, accessToken: response.data.data.accessToken };
    } catch (error: unknown) {
      // Return error message from server if available, otherwise use generic message
      const err = error as any;
      if (err.response?.data?.message?.messageDetail) {
        throw new Error(err.response.data.message.messageDetail);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else if (err.response?.status === 401) {
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
      }
      throw new Error("Đã có lỗi xảy ra khi đăng nhập");
    }
  },

  register: async (data: RegisterData): Promise<void> => {
    try {
      await api.post<ApiResponse<RegisterResponseData>>(
        "/api/auth/register",
        data
      );
    } catch (error: unknown) {
      // Return error message from server if available, otherwise use generic message
      const err = error as any;
      if (err.response?.data?.message?.messageDetail) {
        throw new Error(err.response.data.message.messageDetail);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else if (err.response?.status === 409) {
        throw new Error("Tên đăng nhập hoặc email đã được sử dụng");
      }
      throw new Error("Đã có lỗi xảy ra khi đăng ký");
    }
  },

  sendOTP: async (email: string): Promise<void> => {
    try {
      await api.post<ApiResponse<SendOTPResponseData>>("/api/auth/sendOTP", {
        email,
      });
    } catch (error: unknown) {
      // Return error message from server if available, otherwise use generic message
      const err = error as any;
      if (err.response?.data?.message?.messageDetail) {
        throw new Error(err.response.data.message.messageDetail);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error("Đã có lỗi xảy ra khi gửi mã OTP");
    }
  },

  verifyOTP: async (email: string, otp: string): Promise<void> => {
    try {
      await api.post("/api/auth/verifyOTP", { email, otp });
      // Nếu thành công thì thôi, không cần return gì cả
    } catch (error: unknown) {
      const err = error as any;
      if (err.response?.data?.message?.messageDetail) {
        throw new Error(err.response.data.message.messageDetail);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else if (err.response?.status === 401) {
        throw new Error("Mã OTP không chính xác");
      }
      throw new Error("Đã có lỗi xảy ra khi xác thực mã OTP");
    }
  },

  // Add new resetPassword function
  resetPassword: async (email: string, otp: string, newPassword: string): Promise<void> => {
    try {
      await api.post<ApiResponse<ResetPasswordResponseData>>("/api/user/reset-password", {
        otp,
        email,
        newPassword,
      });
    } catch (error: unknown) {
      // Return error message from server if available, otherwise use generic message
      const err = error as any;
      if (err.response?.data?.message?.messageDetail) {
        throw new Error(err.response.data.message.messageDetail);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error("Đã có lỗi xảy ra khi đặt lại mật khẩu");
    }
  },

  // Update fetchUserProfile function to properly map the response data
  fetchUserProfile: async (userId: string): Promise<AuthUser> => {
    try {
      const response = await api.get<ApiResponse<UserProfileResponseData>>(`/api/profile/user/${userId}`);
      
      // Create AuthUser object from response with only the required fields
      const user: AuthUser = {
        id: response.data.data.userId,
        name: response.data.data.username,
        email: response.data.data.nickName, // Using nickName as email since actual email field is not in response
        avatar: response.data.data.avatar || undefined,
        loyaltyPoints: 0, // This field is not in the response, defaulting to 0
        phone: response.data.data.phoneNumber || undefined,
        bio: response.data.data.fullName || undefined,
        facebook: response.data.data.information?.facebook || undefined,
        twitter: response.data.data.information?.twitter || undefined,
        instagram: response.data.data.information?.instagram || undefined,
        // Map only the requested additional fields from the API response
        nickName: response.data.data.nickName || undefined,
        fullName: response.data.data.fullName || undefined,
        dateOfBirth: response.data.data.dateOfBirth || undefined,
        gender: response.data.data.gender || undefined,
        addresses: response.data.data.addresses || undefined,
      };

      return user;
    } catch (error: unknown) {
      // Return error message from server if available, otherwise use generic message
      const err = error as any;
      if (err.response?.data?.message?.messageDetail) {
        throw new Error(err.response.data.message.messageDetail);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error("Đã có lỗi xảy ra khi lấy thông tin người dùng");
    }
  },

  // Update updateProfile function to remove userId from path
  updateProfile: async (data: UpdateProfileRequest): Promise<AuthUser> => {
    try {
      const response = await api.put<ApiResponse<UpdateProfileResponseData>>(
        `/api/profile`,
        data
      );

      // Create AuthUser object from response with only the required fields
      const user: AuthUser = {
        id: response.data.data.userId,
        name: response.data.data.username,
        email: response.data.data.nickName, // Using nickName as email since actual email field is not in response
        avatar: response.data.data.avatar || undefined,
        loyaltyPoints: 0, // This field is not in the response, defaulting to 0
        phone: response.data.data.phoneNumber || undefined,
        bio: response.data.data.fullName || undefined,
        facebook: response.data.data.information?.facebook || undefined,
        twitter: response.data.data.information?.twitter || undefined,
        instagram: response.data.data.information?.instagram || undefined,
        // Map only the requested additional fields from the API response
        nickName: response.data.data.nickName || undefined,
        fullName: response.data.data.fullName || undefined,
        dateOfBirth: response.data.data.dateOfBirth || undefined,
        gender: response.data.data.gender || undefined,
        addresses: response.data.data.addresses || undefined,
      };

      return user;
    } catch (error: unknown) {
      // Return error message from server if available, otherwise use generic message
      const err = error as any;
      if (err.response?.data?.message?.messageDetail) {
        throw new Error(err.response.data.message.messageDetail);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error("Đã có lỗi xảy ra khi cập nhật thông tin người dùng");
    }
  },

  fetchAllUsers: async (): Promise<AuthUser[]> => {
    try {
      const response = await api.get("/api/users");
      return response.data;
    } catch (error: unknown) {
      // Return error message from server if available, otherwise use generic message
      const err = error as any;
      if (err.response?.data?.message?.messageDetail) {
        throw new Error(err.response.data.message.messageDetail);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error("Đã có lỗi xảy ra khi lấy danh sách người dùng");
    }
  },

  // Add new image upload function
  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<ApiResponse<string>>(
        "/api/images/upload",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.data;
    } catch (error: unknown) {
      // Return error message from server if available, otherwise use generic message
      const err = error as any;
      if (err.response?.data?.message?.messageDetail) {
        throw new Error(err.response.data.message.messageDetail);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error("Đã có lỗi xảy ra khi tải ảnh lên");
    }
  },

  // Add new method for Google OAuth login
  loginGoogle: async (token: string): Promise<{ user: AuthUser; accessToken: string }> => {
    try {
      // Set the token in the authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Call the user info endpoint to get user details
      const response = await api.get<ApiResponse<GoogleLoginResponseData>>("/api/user/getme");
      
      // Save to sessionStorage
      sessionStorage.setItem("accessToken", token);
      sessionStorage.setItem("userId", response.data.data.userId);
      sessionStorage.setItem("username", response.data.data.username);
      sessionStorage.setItem("userEmail", response.data.data.email);

      // Create AuthUser object from response
      const user: AuthUser = {
        id: response.data.data.userId,
        name: response.data.data.username,
        email: response.data.data.email,
        loyaltyPoints: 0, // Default value, will be updated when fetching user details
      };

      return { user, accessToken: token };
    } catch (error: unknown) {
      // Return error message from server if available, otherwise use generic message
      const err = error as any;
      if (err.response?.data?.message?.messageDetail) {
        throw new Error(err.response.data.message.messageDetail);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error("Đã có lỗi xảy ra khi đăng nhập bằng Google");
    }
  },

  // Add new changePassword function
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.post<ApiResponse<ChangePasswordResponseData>>("/api/user/change-password", {
        oldPassword,
        newPassword,
      });
    } catch (error: unknown) {
      // Return error message from server if available, otherwise use generic message
      const err = error as any;
      if (err.response?.data?.message?.messageDetail) {
        throw new Error(err.response.data.message.messageDetail);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error("Đã có lỗi xảy ra khi thay đổi mật khẩu");
    }
  },
};