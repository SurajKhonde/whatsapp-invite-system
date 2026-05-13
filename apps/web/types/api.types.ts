export interface ApiErrorResponse {
  message?: string;
}

export type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  isActive: boolean;
  profileImageUrl?: string | null;
};

export type MeResponse = {
  success: boolean;
  message: string;
  data: User;
  notify: boolean;
};
export interface LoginResponse {
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: "user" | "admin"; 
      isEmailVerified: boolean;
      isActive: boolean;
      profileImageUrl?: string;
    };
    token: string;
  };
}