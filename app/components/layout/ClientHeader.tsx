"use client";

import { useAuth } from "@/app/context/AuthContext";
import { SiteHeader } from "./SiteHeader";
import { useRouter, usePathname } from "next/navigation";

export function ClientHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Hide header on admin pages and admin-login page
  const isAdminPage =
    pathname.startsWith("/admin") || pathname === "/admin-login";

  if (isAdminPage) {
    return null;
  }

  const handleAuthToggle = async () => {
    if (user) {
      // User is signed in, sign them out
      await signOut();
    } else {
      // User is not signed in, redirect to login page
      router.push("/login");
    }
  };

  return <SiteHeader isSignedIn={!!user} onToggleAuth={handleAuthToggle} />;
}
