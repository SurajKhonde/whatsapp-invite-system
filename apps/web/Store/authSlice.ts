import { createSlice } from "@reduxjs/toolkit";

type User = {
  userId: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  isEmailVerified?: boolean;
  isActive?: boolean;
  profileImageUrl?: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user and mark as authenticated
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    // Set authentication status
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    // Clear user and logout
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setAuthenticated, clearUser, logout } = authSlice.actions;
export default authSlice.reducer;