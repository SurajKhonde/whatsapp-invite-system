"use client";

import { useGetMeQuery } from "@/store/apiSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "@/store/slices/authSlice";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useGetMeQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  return <>{children}</>;
}
