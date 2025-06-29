import axios from "axios";
import { create } from "zustand";

const API_URL = "http://localhost:5001/api/auth";

axios.defaults.withCredentials = true; // Enable sending cookies with requests

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (email, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
        const response = await axios.post(`${API_URL}/signup`, {email, password, fullName});
        set({user:response.data.user, isAuthenticated:true, isLoading:false, error:null});
    } catch (error) {
        set({
            error: error.response?.data?.message || "An error occurred during signup",
            isLoading: false,
        });
        throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
        const response = await axios.post(`${API_URL}/verify`, { code });
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        return response.data
    } catch (error) {
        set({error: error.response.data.message || "Error verifying email", isLoading: false });
        throw error;
    }
  },

  checkAuth: async (code) => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false, });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false});
    }
  }
}));