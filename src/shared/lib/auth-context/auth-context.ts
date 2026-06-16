import { createContext } from "react";

interface AuthContextType {
  loading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  getToken: () => string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
