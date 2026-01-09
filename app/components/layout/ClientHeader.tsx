"use client";

import { useAuth } from "@/app/context/AuthContext";
import { SiteHeader } from "./SiteHeader";
import { useRouter } from "next/navigation";

export function ClientHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleAuthToggle = async () => {
    if (user) {
      // User is signed in, sign them out
      await signOut();
    } else {
      // User is not signed in, redirect to login page
      router.push("/login");
    }
  };

  return (
    <SiteHeader
      isSignedIn={!!user}
      onToggleAuth={handleAuthToggle}
    />
  );
}
