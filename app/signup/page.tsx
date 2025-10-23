"use client"
import SignupForm from "../components/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Profile</h1>
          <p className="text-slate-600">Start your journey with us today</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
