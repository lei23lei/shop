"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import {
  useLoginMutation,
  useVerifyQuery,
} from "@/services/endpoints/account-endpoints";
import { getLocalCart, clearLocalCart } from "@/lib/cart-utils";
import { toast } from "sonner";

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
      // Get guest cart from localStorage before login
      const guestCart = getLocalCart();
      const hasGuestItems = guestCart.items.length > 0;

      const loginData = {
        email,
        password,
        ...(hasGuestItems && { guest_cart: guestCart }),
      };

      const response = await loginMutation(loginData).unwrap();

      setUser(response.user);
      setTokens(response.tokens);

      localStorage.setItem("access_token", response.tokens.access);
      localStorage.setItem("refresh_token", response.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Handle cart merge feedback
      if (response.cart_merge && hasGuestItems) {
        const { added_items, updated_items, failed_items, message } =
          response.cart_merge;

        // Show success message
        toast.success(message);

        // Show details if there were updates or failures
        if (updated_items.length > 0) {
          toast.info(
            `Updated ${updated_items.length} existing item${
              updated_items.length > 1 ? "s" : ""
            } in your cart`
          );
        }

        if (failed_items.length > 0) {
          toast.warning(
            `${failed_items.length} item${
              failed_items.length > 1 ? "s" : ""
            } couldn't be added due to stock limitations`
          );
        }

        // Clear guest cart after successful merge
        clearLocalCart();
      }
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
