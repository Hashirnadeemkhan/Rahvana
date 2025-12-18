"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import CompleteProfileForm from "../components/forms/auth/CompleteProfileForm"

export default function CompleteProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/signup")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Complete Your Profile</h1>
              <p className="text-slate-600 mt-2">Provide detailed information for your application</p>
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
  )
}
