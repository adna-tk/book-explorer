import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, type LoginCredentials } from "../api/auth";

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authAPI.login(credentials);
      
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);
      
      navigate("/");
      
      return response;
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.error?.message ||
        err.response?.data?.detail || 
        err.response?.data?.message || 
        "Invalid username or password";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }, [navigate]);

  const isAuthenticated = useMemo(() => {
    return !!localStorage.getItem("access_token");
  }, []);

  return {
    login,
    logout,
    isAuthenticated,
    isLoading,
    error,
  };
};
