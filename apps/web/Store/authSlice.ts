import { createSlice } from "@reduxjs/toolkit";

type User = {
  userId: string;
  role: "user" | "admin";
};

const initialState: {
  user: User | null;
} = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
