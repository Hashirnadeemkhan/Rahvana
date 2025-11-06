// "use client"
// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Progress } from "@/components/ui/progress"
// import { ArrowLeft } from "lucide-react"

// export default function FormWizard({ params }: any) {
//   const formCode = params.formCode
//   const [questions, setQuestions] = useState<any[]>([])
//   const [formData, setFormData] = useState<Record<string, any>>({})
//   const [step, setStep] = useState(0)
//   const [errors, setErrors] = useState<Record<string, string>>({})

//   useEffect(() => {
//     fetch(`/visa-forms/data/i130-form.json`)
//       .then((res) => res.json())
//       .then((data) => setQuestions(data.sections || []))
//   }, [])

//   const totalSteps = questions.length
//   const progress = ((step + 1) / totalSteps) * 100
//   const currentSection = questions[step]

//   const handleNext = () => {
//     const missing: any = {}
//     currentSection?.questions.forEach((q: any) => {
//       if (q.required && !formData[q.id]) {
//         missing[q.id] = `${q.label} is required`
//       }
//     })
//     setErrors(missing)
//     if (Object.keys(missing).length === 0) {
//       if (step + 1 < totalSteps) setStep(step + 1)
//       else window.location.href = `/visa-forms/${formCode}/review`
//     }
//   }

//   const handleBack = () => step > 0 && setStep(step - 1)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6 md:p-10">
//       <div className="max-w-2xl mx-auto">
//         <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/visa-forms')} className="mb-4">
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Forms
//         </Button>

//         <h1 className="text-3xl font-bold mb-2">{formCode}</h1>
//         <p className="text-muted-foreground mb-6">Step {step + 1} of {totalSteps}</p>

//         <Progress value={progress} className="h-2 mb-8" />

//         <Card className="border-2 border-primary/20">
//           <CardHeader>
//             <CardTitle>{currentSection?.title}</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6 pt-4">
//             {currentSection?.questions.map((q: any) => (
//               <div key={q.id} className="space-y-2">
//                 <Label>{q.label} {q.required && <span className="text-destructive">*</span>}</Label>
//                 <Input
//                   type={q.type}
//                   placeholder={q.placeholder}
//                   value={formData[q.id] || ""}
//                   onChange={(e) => setFormData({ ...formData, [q.id]: e.target.value })}
//                   className={errors[q.id] ? "border-destructive" : ""}
//                 />
//                 {errors[q.id] && <p className="text-sm text-destructive">{errors[q.id]}</p>}
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         <div className="flex gap-4 mt-8">
//           <Button variant="outline" onClick={handleBack} disabled={step === 0} className="flex-1">
//             Previous
//           </Button>
//           <Button onClick={handleNext} className="flex-1 bg-primary text-white">
//             {step + 1 === totalSteps ? "Review Form" : "Next"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }
