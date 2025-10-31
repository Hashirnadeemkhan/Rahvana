"use client"

import { Check, X } from "lucide-react"
import PhotoExample from "./photo-example"

interface Category {
  id: string
  title: string
  description: string
}

interface PhotoGuideCategoryProps {
  category: Category
}

const examplesByCategory: Record<string, any[]> = {
  lighting: [
    {
      type: "good",
      title: "Even Lighting",
      description: "Soft, even lighting across the face with no shadows",
      image: "/professional-headshot-even-lighting-white-backgrou.jpg",
    },
    {
      type: "good",
      title: "Natural Light",
      description: "Natural daylight from front, no harsh shadows",
      image: "/passport-photo-natural-lighting.jpg",
    },
    {
      type: "bad",
      title: "Harsh Shadows",
      description: "Strong shadows on face from side lighting",
      image: "/photo-with-harsh-shadows-on-face.jpg",
    },
    {
      type: "bad",
      title: "Backlighting",
      description: "Light from behind creates silhouette effect",
      image: "/backlit-photo-silhouette.jpg",
    },
  ],
  positioning: [
    {
      type: "good",
      title: "Centered Head",
      description: "Head centered in frame, proper distance",
      image: "/centered-headshot-portrait.jpg",
    },
    {
      type: "good",
      title: "Correct Size",
      description: "Face fills 50-70% of frame, head to shoulders visible",
      image: "/proper-headshot-framing.jpg",
    },
    {
      type: "bad",
      title: "Too Close",
      description: "Face too close to camera, distorted proportions",
      image: "/extreme-close-up-face-distorted.jpg",
    },
    {
      type: "bad",
      title: "Too Far",
      description: "Face too small in frame, hard to see details",
      image: "/person-too-far-away-small-in-frame.jpg",
    },
  ],
  quality: [
    {
      type: "good",
      title: "Sharp and Clear",
      description: "High resolution, sharp focus on face",
      image: "/high-resolution-sharp-portrait.jpg",
    },
    {
      type: "good",
      title: "Good Contrast",
      description: "Clear details, good color reproduction",
      image: "/professional-quality-headshot.jpg",
    },
    {
      type: "bad",
      title: "Blurry Photo",
      description: "Out of focus, motion blur, or low resolution",
      image: "/blurry-out-of-focus-photo.jpg",
    },
    {
      type: "bad",
      title: "Pixelated",
      description: "Low resolution, pixelated appearance",
      image: "/low-resolution-pixelated-image.jpg",
    },
  ],
  digital: [
    {
      type: "good",
      title: "Original Photo",
      description: "Unedited, no filters or alterations",
      image: "/natural-unedited-portrait.jpg",
    },
    {
      type: "good",
      title: "Minimal Adjustment",
      description: "Only basic exposure/contrast if needed",
      image: "/natural-portrait-minimal-editing.jpg",
    },
    {
      type: "bad",
      title: "Heavy Filters",
      description: "Beauty filters, color filters, or effects applied",
      image: "/photo-with-heavy-beauty-filters.jpg",
    },
    {
      type: "bad",
      title: "AI Generated",
      description: "AI-altered or generated face",
      image: "/placeholder.svg?height=300&width=250",
    },
  ],
  pose: [
    {
      type: "good",
      title: "Straight On",
      description: "Face directly facing camera, no tilt",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "good",
      title: "Neutral Expression",
      description: "Relaxed face, slight smile or neutral",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "bad",
      title: "Head Tilt",
      description: "Head tilted or turned to the side",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "bad",
      title: "Extreme Expression",
      description: "Exaggerated smile, frown, or unusual expression",
      image: "/placeholder.svg?height=300&width=250",
    },
  ],
  attire: [
    {
      type: "good",
      title: "Plain Clothing",
      description: "Simple, solid-colored clothing",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "good",
      title: "No Accessories",
      description: "No glasses, hats, or distracting jewelry",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "bad",
      title: "Sunglasses",
      description: "Wearing sunglasses or dark glasses",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "bad",
      title: "Hat or Cap",
      description: "Wearing hat, cap, or head covering",
      image: "/placeholder.svg?height=300&width=250",
    },
  ],
  background: [
    {
      type: "good",
      title: "Plain White",
      description: "Clean white background, no shadows or texture",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "good",
      title: "Off-White",
      description: "Light neutral background, uniform color",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "bad",
      title: "Textured Background",
      description: "Patterned or textured background visible",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "bad",
      title: "Objects in Background",
      description: "Furniture, people, or objects visible behind",
      image: "/placeholder.svg?height=300&width=250",
    },
  ],
  children: [
    {
      type: "good",
      title: "Child Centered",
      description: "Child centered, same requirements as adults",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "good",
      title: "Natural Expression",
      description: "Relaxed, natural expression on child",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "bad",
      title: "Distracted Child",
      description: "Child looking away or distracted",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      type: "bad",
      title: "Crying or Upset",
      description: "Child crying, upset, or making faces",
      image: "/placeholder.svg?height=300&width=250",
    },
  ],
}

export default function PhotoGuideCategory({ category }: PhotoGuideCategoryProps) {
  const examples = examplesByCategory[category.id] || []
  const goodExamples = examples.filter((ex) => ex.type === "good")
  const badExamples = examples.filter((ex) => ex.type === "bad")

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{category.title}</h2>
        <p className="text-slate-400 text-lg">{category.description}</p>
      </div>

      {/* Good Examples */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500">
            <Check className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-white">Acceptable</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goodExamples.map((example, idx) => (
            <PhotoExample key={`good-${idx}`} example={example} />
          ))}
        </div>
      </div>

      {/* Bad Examples */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500">
            <X className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-white">Not Acceptable</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {badExamples.map((example, idx) => (
            <PhotoExample key={`bad-${idx}`} example={example} />
          ))}
        </div>
      </div>

      {/* Photo Tip */}
      <div className="mt-12 bg-slate-700 border border-slate-600 rounded-lg p-6">
        <div className="flex gap-3">
          <div className="text-amber-400 text-2xl flex-shrink-0">📸</div>
          <div>
            <h4 className="font-semibold text-white mb-2">Photo Tip</h4>
            <p className="text-slate-300">
              Your photo should be 2 inches by 2 inches (51 x 51 mm) with the head centered and sized between 1 inch and
              1.4 inches (25 and 35 mm). Ensure even lighting, a plain background, and a neutral expression for the best
              results.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
