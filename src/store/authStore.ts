import { create } from "zustand";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  username: string | null;
  role: string | null;
  setAuth: (username: string, role: string | any, token: string, refreshToken: string) => void;
  setAuthToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null,
  username: typeof window !== "undefined" ? localStorage.getItem("username") : null,
  role: typeof window !== "undefined" ? localStorage.getItem("role") : null,


  setAuth: (username, role, token, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    set({ token, role, username, refreshToken });
  },

  setAuthToken: (token: string) => {
    localStorage.setItem("token", token);
    set({token})
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    set({ token: null, role: null, username: null });
  },
}));
