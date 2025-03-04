import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchData = async (url: string, limit = 10, offset = 0) => {
  const response = await api.get(`${url}?limit=${limit}&offset=${offset}`);
  return response.data;
};

api.interceptors.request.use(async (config) => {
  let token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.response?.data?.detail === "Token expired, please refresh") {
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await api.post(`/refresh`, { refresh_token: refreshToken });

        const newToken = response.data.access_token;
        
        useAuthStore.getState().setAuthToken(newToken);
        error.config.headers.Authorization = `Bearer ${newToken}`;

        return axios(error.config);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
