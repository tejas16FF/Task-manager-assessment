import { create } from "zustand";
import { api, getErrorMessage, setAuthToken } from "../utils/api";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("currentUser");

if (storedToken) {
  setAuthToken(storedToken);
}

export const useAuthStore = create((set, get) => ({
  currentUser: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || "",
  loading: false,
  error: "",

  login: async (credentials) => {
    set({ loading: true, error: "" });

    try {
      const response = await api.post("/auth/login", credentials);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setAuthToken(token);

      set({ currentUser: user, token, loading: false });
      return user;
    } catch (error) {
      const message = getErrorMessage(error, "Login failed");
      set({ error: message, loading: false });
      throw new Error(message, { cause: error });
    }
  },

  register: async (userData) => {
    set({ loading: true, error: "" });

    try {
      const response = await api.post("/auth/register", userData);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setAuthToken(token);

      set({ currentUser: user, token, loading: false });
      return user;
    } catch (error) {
      const message = getErrorMessage(error, "Registration failed");
      set({ error: message, loading: false });
      throw new Error(message, { cause: error });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setAuthToken("");
    set({ currentUser: null, token: "", error: "" });
  },

  refreshCurrentUser: async () => {
    if (!get().token) {
      return null;
    }

    try {
      const response = await api.get("/auth/me");
      const user = response.data.user;

      localStorage.setItem("currentUser", JSON.stringify(user));
      set({ currentUser: user });
      return user;
    } catch {
      get().logout();
      return null;
    }
  },

  clearError: () => set({ error: "" }),
}));
