// app/(main)/dashboard/page.tsx
"use client";

import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define TypeScript interfaces for profile data
interface InitialQuestions {
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
}

interface CompleteProfile {
  fullLegalName: string;
  phoneNumber: string;
  cnic: string;
  passportNumber: string;
  currentEmployer: string;
  position: string;
}

interface UserProfile {
  initialQuestions?: InitialQuestions;
  completeProfile?: CompleteProfile;
}

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("userProfile");
    if (data) {
      setProfile(JSON.parse(data));
    }
    setLoadingProfile(false);
  }, []);

  const hasInitialQuestions = profile?.initialQuestions;
  const hasCompleteProfile = profile?.completeProfile;
  const completionPercentage = hasCompleteProfile ? 100 : hasInitialQuestions ? 50 : 0;

  const handleEditProfile = () => {
    router.push("/initial-questions");
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Get user display info
  const getUserDisplayName = () => {
    if (!user) return "User";

    // Check for Google provider metadata
    const metadata = user.user_metadata;
    if (metadata?.full_name) return metadata.full_name;
    if (metadata?.name) return metadata.name;

    // Fallback to email
    return user.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    const metadata = user?.user_metadata;
    return metadata?.avatar_url || metadata?.picture || null;
  };

  const getLoginMethod = () => {
    if (!user) return "Unknown";

    const provider = user.app_metadata?.provider;
    if (provider === "google") return "Google Sign-In";
    return "Email + Password";
  };

  if (loadingProfile || isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              {getUserAvatar() ? (
                <img
                  src={getUserAvatar()!}
                  alt="Profile"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Welcome, {getUserDisplayName()}!
                </h1>
                <p className="text-slate-600 mt-1">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/settings")}
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>

          {/* Profile Completion Alerts */}
          {completionPercentage < 100 && (
            <div className="space-y-4 mb-8">
              {!hasInitialQuestions && (
                <Card className="p-6 bg-blue-50 border border-blue-100 shadow-sm rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Complete Your Profile
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Answer a few quick questions to personalize your immigration journey.
                      </p>
                      <Button
                        onClick={handleEditProfile}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                      >
                        Start Now
                      </Button>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                  </div>
                </Card>
              )}

              {hasInitialQuestions && !hasCompleteProfile && (
                <Card className="p-6 bg-amber-50 border border-amber-100 shadow-sm rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-900 mb-2">
                        Complete Detailed Profile
                      </h3>
                      <p className="text-amber-700 mb-4">
                        Finish your full profile to unlock all features.
                      </p>
                      <Button
                        onClick={() => router.push("/complete-profile")}
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                      >
                        Continue
                      </Button>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Profile Progress Bar */}
          <Card className="p-8 bg-white shadow-lg border-0 mb-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Profile Completion</h2>
                <p className="text-slate-600 mt-1">Your profile is {completionPercentage}% complete</p>
              </div>
              <div className="text-3xl font-bold text-slate-900">{completionPercentage}%</div>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-slate-700 to-slate-900 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </Card>

          {/* Account Info */}
          <Card className="p-6 bg-white shadow-lg border-0 mb-8 rounded-2xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Email Address</p>
                <p className="font-medium text-slate-900">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Member Since</p>
                <p className="font-medium text-slate-900">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Just now"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Login Method</p>
                <div className="flex items-center gap-2">
                  {getLoginMethod() === "Google Sign-In" ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  <p className="font-medium text-slate-900">{getLoginMethod()}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Account Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Initial Questions */}
          {hasInitialQuestions && (
            <Card className="p-6 bg-white shadow-lg border-0 mb-8 rounded-2xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Initial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Date of Birth</p>
                  <p className="font-medium text-slate-900">{profile?.initialQuestions?.dateOfBirth}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Gender</p>
                  <p className="font-medium text-slate-900 capitalize">{profile?.initialQuestions?.gender}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Nationality</p>
                  <p className="font-medium text-slate-900">{profile?.initialQuestions?.nationality}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Marital Status</p>
                  <p className="font-medium text-slate-900 capitalize">{profile?.initialQuestions?.maritalStatus}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Complete Profile */}
          {hasCompleteProfile && (
            <Card className="p-6 bg-white shadow-lg border-0 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Complete Profile Data</h3>
                <Button
                  onClick={handleEditProfile}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Full Legal Name</p>
                  <p className="font-medium text-slate-900">{profile?.completeProfile?.fullLegalName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Phone Number</p>
                  <p className="font-medium text-slate-900">{profile?.completeProfile?.phoneNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">CNIC</p>
                  <p className="font-medium text-slate-900">{profile?.completeProfile?.cnic}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Passport Number</p>
                  <p className="font-medium text-slate-900">{profile?.completeProfile?.passportNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Current Employer</p>
                  <p className="font-medium text-slate-900">{profile?.completeProfile?.currentEmployer}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Position</p>
                  <p className="font-medium text-slate-900">{profile?.completeProfile?.position}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
