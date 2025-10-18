import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPinned, PlayCircle } from "lucide-react"
import Link from "next/link"

type Props = {
  title: string
  description: string
  videoLabel: string
  roadmapLabel: string
}

export function IRItemRow({ title, description, videoLabel, roadmapLabel }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Left: Text content */}
      <div className="space-y-5">
        <Card className="border-blue-100 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="text-2xl font-semibold text-blue-700">{title}</div>
            <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>
          </CardContent>
        </Card>

   <Button
  asChild
  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
>
  <Link href="/ir-1-roadmap">
    <MapPinned className="h-4 w-4" />
    {roadmapLabel}
  </Link>
</Button>

      </div>

      {/* Right: Video placeholder */}
      <Card className="hover:shadow-lg border-blue-100 transition-all duration-200">
        <CardContent className="p-4">
          <div
            className="aspect-video w-full rounded-md bg-gradient-to-br from-gray-100 to-blue-50 grid place-items-center text-sm text-gray-500"
            aria-label={`${title} explainer video placeholder`}
          >
            <div className="flex flex-col items-center gap-2">
              <PlayCircle className="h-8 w-8 text-blue-500" aria-hidden="true" />
              <span className="font-medium">{videoLabel}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
