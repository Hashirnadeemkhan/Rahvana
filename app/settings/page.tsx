// "use client"

// import type React from "react"

// import { useRouter } from "next/navigation"
// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card } from "@/components/ui/card"

// interface User {
//   id: string
//   email: string
//   passwordSet?: boolean
//   createdAt: string
// }

// export default function SettingsPage() {
//   const router = useRouter()
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [password, setPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const [savingPassword, setSavingPassword] = useState(false)

//   useEffect(() => {
//     const userData = localStorage.getItem("user")
//     if (!userData) {
//       router.push("/signup")
//     } else {
//       setUser(JSON.parse(userData))
//     }
//     setLoading(false)
//   }, [router])

//   const handleSetPassword = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setSuccess("")
//     setSavingPassword(true)

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters")
//       setSavingPassword(false)
//       return
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match")
//       setSavingPassword(false)
//       return
//     }

//     // Save password to localStorage
//     localStorage.setItem("userPassword", password)

//     // Update user object to mark password as set
//     const updatedUser = { ...user, passwordSet: true }
//     localStorage.setItem("user", JSON.stringify(updatedUser))
//     setUser(updatedUser)

//     setSuccess("Password set successfully!")
//     setPassword("")
//     setConfirmPassword("")
//     setSavingPassword(false)
//   }

//   if (loading) return null
//   if (!user) return null

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
//             <p className="text-slate-600 mt-2">Manage your account</p>
//           </div>
//           <Button
//             onClick={() => router.push("/dashboard")}
//             variant="outline"
//             className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
//           >
//             Back to Dashboard
//           </Button>
//         </div>

//         {/* Account Information */}
//         <Card className="p-6 bg-white shadow-lg border-0 mb-8">
//           <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
//           <div className="space-y-3">
//             <div>
//               <p className="text-sm text-slate-600">Email</p>
//               <p className="font-medium text-slate-900">{user.email}</p>
//             </div>
//             <div>
//               <p className="text-sm text-slate-600">Member Since</p>
//               <p className="font-medium text-slate-900">{new Date(user.createdAt).toLocaleDateString()}</p>
//             </div>
//           </div>
//         </Card>

//         {/* Password Settings */}
//         <Card className="p-6 bg-white shadow-lg border-0">
//           <h3 className="text-lg font-semibold text-slate-900 mb-4">
//             {user.passwordSet ? "Change Password" : "Set Password"}
//           </h3>
//           <p className="text-slate-600 mb-6">
//             {user.passwordSet
//               ? "Update your password to keep your account secure"
//               : "Set a password to secure your account"}
//           </p>

//           <form onSubmit={handleSetPassword} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
//               <Input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
//               <Input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full"
//               />
//             </div>

//             {error && (
//               <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
//             )}

//             {success && (
//               <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>
//             )}

//             <Button
//               type="submit"
//               disabled={savingPassword}
//               className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg transition"
//             >
//               {savingPassword ? "Saving..." : "Save Password"}
//             </Button>
//           </form>
//         </Card>
//       </div>
//     </div>
//   )
// }
