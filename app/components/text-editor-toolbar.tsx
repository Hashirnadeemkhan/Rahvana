"use client"

import { useState } from "react"
import { usePDFStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"

export function TextEditorToolbar() {
  const [text, setText] = useState("")
  const [fontSize, setFontSize] = useState(12)
  const [color, setColor] = useState("#000000")
  const [x, setX] = useState(50)
  const [y, setY] = useState(50)

  const { currentPage, addAnnotation, selectedAnnotation, deleteAnnotation,  getPageAnnotations } =
    usePDFStore()

  const handleAddText = () => {
    if (!text.trim()) return

    const id = `${Date.now()}-${Math.random()}`
    addAnnotation({
      id,
      pageIndex: currentPage,
      x,
      y,
      text,
      fontSize,
      color,
    })

    setText("")
  }

  const handleDeleteSelected = () => {
    if (selectedAnnotation) {
      deleteAnnotation(selectedAnnotation)
    }
  }

  const pageAnnotations = getPageAnnotations(currentPage)

  return (
    <div className="space-y-4 bg-white border-l p-4 overflow-y-auto h-full">
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-gray-900">Add Text</h3>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Text Content</label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            onKeyPress={(e) => e.key === "Enter" && handleAddText()}
            className="text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Font Size</label>
            <Input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              min="8"
              max="72"
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-12 cursor-pointer p-1"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">X Position</label>
            <Input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} min="0" className="text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Y Position</label>
            <Input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} min="0" className="text-sm" />
          </div>
        </div>

        <Button onClick={handleAddText} className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="h-4 w-4" />
          Add Text
        </Button>
      </div>

      {pageAnnotations.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <h3 className="font-semibold text-sm text-gray-900">Annotations on this page</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {pageAnnotations.map((ann) => (
              <div
                key={ann.id}
                className="flex items-center justify-between gap-2 rounded bg-gray-50 p-2 text-xs hover:bg-gray-100"
              >
                <span className="truncate">{ann.text.substring(0, 20)}</span>
                <Button onClick={() => deleteAnnotation(ann.id)} variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
