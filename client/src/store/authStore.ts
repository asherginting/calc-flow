import { create } from 'zustand';
import type { User } from '../types';
import axiosClient from '../api/axiosClient';

interface AuthState {
  user: User | null;
  isLoading: boolean;

  login: (userData: User) => void;
  logout: () => Promise<void>;
 
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isLoading: false,
  isAuthModalOpen: false,

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  login: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData, isAuthModalOpen: false });
  },

  logout: async () => {
    try {
      await axiosClient.post("/auth/logout"); 
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("user");
      set({ user: null });
    }
  },
}));