export interface ApiErrorResponse {
  message?: string;
}

export type MeResponse = {
  success: boolean;
  data: User;
};
export type User = {
  userId: string;
  role: "user" | "admin";
};
