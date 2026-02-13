"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import CompleteProfileForm from "@/app/components/forms/auth/CompleteProfileForm";
import { Loader2 } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to signup if not authenticated
    if (!isLoading && !user) {
      router.push("/signup");
    }
  }, [user, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
      </div>
    );
  }

  // Don't render if no user
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Complete Your Profile
              </h1>
              <p className="text-slate-600 mt-2">
                Provide detailed information to enable auto-fill across all tools
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">Step 2 of 3</div>
              <div className="w-32 h-2 bg-slate-200 rounded-full mt-2">
                <div className="w-2/3 h-full bg-slate-900 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <CompleteProfileForm />
      </div>
    </div>
  );
}
