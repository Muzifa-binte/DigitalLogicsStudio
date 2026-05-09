import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import progressService from "../services/progressService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await authService.getCurrentUser();

        if (isMounted) {
          setUser(response.user);
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    return response.user;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const response = await authService.getCurrentUser();
    setUser(response.user);
    return response.user;
  };

  const markProblemSolved = async (problemId) => {
    const response = await progressService.completeProblem(problemId);
    setUser(response.user);
    return response.user;
  };

  const hasSolvedProblem = (problemId) => {
    return Boolean(user?.solvedProblems?.includes(problemId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refreshUser,
        markProblemSolved,
        hasSolvedProblem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
