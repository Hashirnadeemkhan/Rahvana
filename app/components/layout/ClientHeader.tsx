"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { SiteHeader } from "./SiteHeader";
import { useRouter, usePathname } from "next/navigation";

export function ClientHeader() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Hide header on admin pages, admin-login, login and signup pages
  const isExcludedPage =
    pathname.startsWith("/admin") || 
    pathname === "/admin-login" ||
    pathname === "/login" ||
    pathname === "/signup";

  if (isExcludedPage) {
    return null;
  }

  const handleAuthToggle = async () => {
    setIsAuthLoading(true);
    try {
      if (user) {
        // User is signed in, sign them out
        await signOut();
        router.push("/");
      } else {
        // User is not signed in, redirect to login page
        router.push("/login");
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <>
      <SiteHeader
        isSignedIn={!!user}
        onToggleAuth={handleAuthToggle}
        user={user}
        profile={profile}
      />
      
      {/* Global Auth Loading Overlay */}
      {isAuthLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/60 backdrop-blur-md transition-all duration-300">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary/10 border-b-primary rounded-full animate-spin-reverse" />
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">
              {user ? "Signing Out..." : "Redirecting to Login..."}
            </h2>
            <p className="text-muted-foreground animate-pulse">Please wait a moment</p>
          </div>
        </div>
      )}
    </>
  );
}
