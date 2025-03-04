import { create } from "zustand";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  username: string | null;
  setAuth: (username: string, token: string, refreshToken: string) => void;
  setAuthToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null,
  username: typeof window !== "undefined" ? localStorage.getItem("username") : null,


  setAuth: (username, token, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("username", username);
    set({ token, username, refreshToken });
  },

  setAuthToken: (token: string) => {
    localStorage.setItem("token", token);
    set({token})
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    set({ token: null, username: null });
  },
}));
