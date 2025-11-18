// app/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("authUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signup = (email: string, password: string) => {
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    // Save to registered users list
    const users = (JSON.parse(localStorage.getItem("registeredUsers") || "[]") as User[]);
    users.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    // Login user
    localStorage.setItem("authUser", JSON.stringify(newUser));
    setUser(newUser);
    router.push("/dashboard");
  };

  const login = (email: string, password: string): boolean => {
    const users = (JSON.parse(localStorage.getItem("registeredUsers") || "[]") as User[]);
    const found = users.find((u: User) => u.email === email && u.password === password);

    if (found) {
      localStorage.setItem("authUser", JSON.stringify(found));
      setUser(found);
      router.push("/dashboard");
      return true;
    }
    return false;
  };

  const loginWithGoogle = () => {
    const googleUser = {
      id: "google_" + Date.now(),
      email: "user@gmail.com",
      password: "",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("authUser", JSON.stringify(googleUser));
    setUser(googleUser);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};