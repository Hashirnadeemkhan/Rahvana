"use client"

import { Type, Pen, Square, ImageIcon, Highlighter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EditToolbarProps {
  activeTool: string | null
  onToolChange: (tool: string | null) => void
}

export function EditToolbar({ activeTool, onToolChange }: EditToolbarProps) {
  const tools = [
    { id: "text", label: "Edit Text", icon: Type },
    { id: "draw", label: "Draw", icon: Pen },
    { id: "shape", label: "Shape", icon: Square },
    { id: "highlight", label: "Highlight", icon: Highlighter },
    { id: "image", label: "Image", icon: ImageIcon },
  ]

  return (
    <div className="flex items-center gap-1 bg-white border-b px-4 py-3 overflow-x-auto">
      {tools.map((tool) => {
        const Icon = tool.icon
        return (
          <Button
            key={tool.id}
            onClick={() => onToolChange(activeTool === tool.id ? null : tool.id)}
            variant={activeTool === tool.id ? "default" : "ghost"}
            size="sm"
            title={tool.label}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">{tool.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
