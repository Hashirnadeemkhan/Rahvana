// app/dashboard/page.tsx
"use client";

import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Profile data (tum already use kar rahe ho)
  const profileData = localStorage.getItem("userProfile");
  const profile = profileData ? JSON.parse(profileData) : null;

  const hasInitialQuestions = profile?.initialQuestions;
  const hasCompleteProfile = profile?.completeProfile;
  const completionPercentage = hasCompleteProfile ? 100 : hasInitialQuestions ? 50 : 0;

  const handleEditProfile = () => {
    router.push("/initial-questions");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Welcome!</h1>
              <p className="text-slate-600 mt-2">{user?.email}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/settings")}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
              >
                Settings
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Secure Account Alert (for Google users) */}
          {!user?.password && (
            <Card className="p-6 bg-amber-50 border border-amber-200 shadow-md mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">Secure Your Account</h3>
                  <p className="text-amber-700 mb-4">
                    You signed in with Google. Set a password to protect your account and enable email login.
                  </p>
                  <Button onClick={() => router.push("/settings")} className="bg-amber-600 hover:bg-amber-700 text-white">
                    Set Password Now
                  </Button>
                </div>
                <div className="text-4xl">Lock</div>
              </div>
            </Card>
          )}

          {/* Profile Completion Alerts */}
          {completionPercentage < 100 && (
            <div className="space-y-4 mb-8">
              {!hasInitialQuestions && (
                <Card className="p-6 bg-blue-50 border border-blue-200 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Complete Your Profile</h3>
                      <p className="text-blue-700 mb-4">
                        Answer a few quick questions to personalize your experience.
                      </p>
                      <Button onClick={handleEditProfile} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Start Now
                      </Button>
                    </div>
                    <div className="text-4xl">Clipboard</div>
                  </div>
                </Card>
              )}

              {hasInitialQuestions && !hasCompleteProfile && (
                <Card className="p-6 bg-amber-50 border border-amber-200 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-900 mb-2">Complete Detailed Profile</h3>
                      <p className="text-amber-700 mb-4">
                        Finish your full profile to unlock all features.
                      </p>
                      <Button
                        onClick={() => router.push("/complete-profile")}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Continue
                      </Button>
                    </div>
                    <div className="text-4xl">Pen</div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Profile Completion Progress */}
          <Card className="p-8 bg-white shadow-lg border-0 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Profile Completion</h2>
                <p className="text-slate-600 mt-1">Your profile is {completionPercentage}% complete</p>
              </div>
              <div className="text-4xl font-bold text-slate-900">{completionPercentage}%</div>
            </div>
            <div className="w-full h-4 bg-slate-200 rounded-full mb-6">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            {completionPercentage < 100 && (
              <p className="text-sm text-slate-600">
                {!hasInitialQuestions
                  ? "Start by answering initial questions"
                  : "Complete your detailed profile to finish setup"}
              </p>
            )}
            {completionPercentage === 100 && (
              <p className="text-sm text-green-600 font-medium">Your profile is complete!</p>
            )}
          </Card>

          {/* Account Information */}
          <Card className="p-6 bg-white shadow-lg border-0 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium text-slate-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Member Since</p>
                <p className="font-medium text-slate-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Login Method</p>
                <p className="font-medium text-slate-900">
                  {user?.password ? "Email + Password" : "Google Sign-In"}
                </p>
              </div>
            </div>
          </Card>

          {/* Initial Questions Summary */}
          {hasInitialQuestions && (
            <Card className="p-6 bg-white shadow-lg border-0 mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Initial Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Date of Birth</p>
                  <p className="font-medium text-slate-900">{profile?.initialQuestions?.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Gender</p>
                  <p className="font-medium text-slate-900 capitalize">{profile?.initialQuestions?.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Nationality</p>
                  <p className="font-medium text-slate-900">{profile?.initialQuestions?.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Marital Status</p>
                  <p className="font-medium text-slate-900 capitalize">{profile?.initialQuestions?.maritalStatus}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Complete Profile Summary */}
          {hasCompleteProfile && (
            <Card className="p-6 bg-white shadow-lg border-0">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Complete Profile Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><p className="text-sm text-slate-600">Full Legal Name</p><p className="font-medium text-slate-900">{profile?.completeProfile?.fullLegalName}</p></div>
                <div><p className="text-sm text-slate-600">Phone Number</p><p className="font-medium text-slate-900">{profile?.completeProfile?.phoneNumber}</p></div>
                <div><p className="text-sm text-slate-600">CNIC</p><p className="font-medium text-slate-900">{profile?.completeProfile?.cnic}</p></div>
                <div><p className="text-sm text-slate-600">Passport Number</p><p className="font-medium text-slate-900">{profile?.completeProfile?.passportNumber}</p></div>
                <div><p className="text-sm text-slate-600">Current Employer</p><p className="font-medium text-slate-900">{profile?.completeProfile?.currentEmployer}</p></div>
                <div><p className="text-sm text-slate-600">Position</p><p className="font-medium text-slate-900">{profile?.completeProfile?.position}</p></div>
              </div>
              <Button
                onClick={handleEditProfile}
                variant="outline"
                className="mt-6 border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
              >
                Edit Profile
              </Button>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}