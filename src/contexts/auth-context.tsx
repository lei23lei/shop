"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import {
  useLoginMutation,
  useVerifyQuery,
} from "@/services/endpoints/account-endpoints";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  is_superuser: boolean;
}

interface Tokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  tokens: Tokens | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [tokens, setTokens] = useState<Tokens | null>(() => {
    if (typeof window !== "undefined") {
      const access = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");
      return access && refresh ? { access, refresh } : null;
    }
    return null;
  });

  const [loginMutation] = useLoginMutation();
  const {
    data: verifyData,
    isLoading,
    error,
  } = useVerifyQuery(undefined, {
    skip: !tokens?.access, // Skip verify if no token
  });

  // Update user when verify data changes
  useEffect(() => {
    if (verifyData?.user) {
      setUser(verifyData.user);
      localStorage.setItem("user", JSON.stringify(verifyData.user));
    }
  }, [verifyData]);

  // Handle verify error
  useEffect(() => {
    if (error) {
      console.error("Token verification failed:", error);
      logout();
    }
  }, [error]);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginMutation({
        email,
        password,
      }).unwrap();

      setUser(response.user);
      setTokens(response.tokens);

      localStorage.setItem("access_token", response.tokens.access);
      localStorage.setItem("refresh_token", response.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
