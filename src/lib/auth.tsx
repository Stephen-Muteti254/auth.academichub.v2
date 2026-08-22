import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchCurrentUser,
  logout as apiLogout,
  type AuthUser,
} from "./api";

const AUTH_QUERY_KEY = ["auth", "me"] as const;

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  /** Seed the session cache right after a successful login/register. */
  setUser: (user: AuthUser) => void;
  /** Re-validate the session with the backend. */
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const value: AuthContextValue = {
    user: data ?? null,
    isLoading,
    setUser: (user) => queryClient.setQueryData(AUTH_QUERY_KEY, user),
    refresh: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
    signOut: async () => {
      await queryClient.cancelQueries();
      await apiLogout();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
