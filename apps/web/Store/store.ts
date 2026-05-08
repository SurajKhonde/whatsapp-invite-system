import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authReducer from "./authSlice";
import createEventReducer from "./slices/createEventSlice"; // ← ADD THIS

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    createEvent: createEventReducer, // ← ADD THIS
  },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});

// ← ADD THESE 2 LINES
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
