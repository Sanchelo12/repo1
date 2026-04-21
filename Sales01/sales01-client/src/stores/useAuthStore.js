import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logout as logoutService } from "../services/auth.js";

const validateUser = (user) => {
  return (
    user && typeof user.id === "number" && typeof user.username === "string"
  );
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => {
        if (validateUser(userData)) {
          set({
            user: userData,
            isAuthenticated: true,
          });
        }
      },

      logout: async () => {
        try {
          await logoutService();
        } catch (error) {
          console.error("Error al avisar al backend del logout", error);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      clearSession: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "user-data-storage",
    },
  ),
);
