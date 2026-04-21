import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request interceptor to add auth headers
api.interceptors.request.use(
  (config) => {
    const { user } = useAuthStore.getState();
    if (user) {
      config.headers["x-user-id"] = user.id;
      config.headers["x-user-role"] = user.role;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Sesión expirada detectada por Interceptor");
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  },
);

export default api;
