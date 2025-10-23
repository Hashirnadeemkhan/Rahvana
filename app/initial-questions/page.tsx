"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import InitialQuestionsForm from "../components/initial-questions-form"

export default function InitialQuestionsPage() {
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Lets Get Started</h1>
              <p className="text-slate-600 mt-2">Answer a few quick questions to set up your profile</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">Step 1 of 3</div>
              <div className="w-32 h-2 bg-slate-200 rounded-full mt-2">
                <div className="w-1/3 h-full bg-slate-900 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <InitialQuestionsForm />
      </div>
    </div>
  )
}
