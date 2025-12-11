"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Download, RotateCcw, Check, Move, Crop } from "lucide-react"

interface SignaturePreviewProps {
  originalImage: string
  processedImage: string
  onDownload: () => void
  onReset: () => void
}

interface CropBox {
  x: number
  y: number
  width: number
  height: number
}

interface Corner {
  x: number
  y: number
}

export default function SignaturePreview({
  originalImage,
  processedImage,
  onDownload,
  onReset,
}: SignaturePreviewProps) {
  const [showPerspective, setShowPerspective] = useState(false)
  const [perspectiveCorrectedImage, setPerspectiveCorrectedImage] = useState<string | null>(null)
  const [corners, setCorners] = useState<Corner[]>([
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ])
  const [draggingCorner, setDraggingCorner] = useState<number | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0, y: 0, width: 100, height: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<"move" | "nw" | "ne" | "sw" | "se" | "rotate" | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [isRotating, setIsRotating] = useState(false)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)

  const previewRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const perspectiveCanvasRef = useRef<HTMLCanvasElement>(null)
  const perspectivePreviewRef = useRef<HTMLCanvasElement>(null)
  const perspectiveContainerRef = useRef<HTMLDivElement>(null)

  const currentImage = perspectiveCorrectedImage || processedImage

  useEffect(() => {
    if (processedImage) {
      const img = new Image()
      img.src = processedImage
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height })
      }
    }
  }, [processedImage])

  useEffect(() => {
    if (currentImage && imageRef.current && previewRef.current && !showPerspective) {
      detectSignatureBounds()
    }
  }, [currentImage, showPerspective])

  useEffect(() => {
    if (showPerspective && processedImage && imageDimensions) {
      setCorners([
        { x: 0, y: 0 },
        { x: imageDimensions.width, y: 0 },
        { x: imageDimensions.width, y: imageDimensions.height },
        { x: 0, y: imageDimensions.height },
      ])

      const canvas = perspectiveCanvasRef.current
      if (canvas) {
        canvas.width = imageDimensions.width
        canvas.height = imageDimensions.height
        const ctx = canvas.getContext("2d")
        if (ctx) {
          const img = new Image()
          img.src = processedImage
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
          }
        }
      }
    }
  }, [showPerspective, processedImage, imageDimensions])

  useEffect(() => {
    if (!showPerspective || !imageDimensions) return
    applyPerspective()
  }, [corners, showPerspective, imageDimensions])

  const applyPerspective = () => {
    const previewCanvas = perspectivePreviewRef.current
    const sourceCanvas = perspectiveCanvasRef.current
    if (!previewCanvas || !sourceCanvas || !imageDimensions) return

    const img = new Image()
    img.src = processedImage

    img.onload = () => {
      const ctx = previewCanvas.getContext("2d")
      if (!ctx) return

      const width = Math.max(Math.abs(corners[1].x - corners[0].x), Math.abs(corners[2].x - corners[3].x))
      const height = Math.max(Math.abs(corners[3].y - corners[0].y), Math.abs(corners[2].y - corners[1].y))

      previewCanvas.width = width
      previewCanvas.height = height
      ctx.clearRect(0, 0, width, height)

      try {
        const steps = 20
        for (let i = 0; i < steps; i++) {
          for (let j = 0; j < steps; j++) {
            const u = i / steps
            const v = j / steps

            const srcX =
              (1 - u) * (1 - v) * 0 +
              u * (1 - v) * imageDimensions.width +
              u * v * imageDimensions.width +
              (1 - u) * v * 0

            const srcY =
              (1 - u) * (1 - v) * 0 +
              u * (1 - v) * 0 +
              u * v * imageDimensions.height +
              (1 - u) * v * imageDimensions.height

            const dstX =
              (1 - u) * (1 - v) * corners[0].x +
              u * (1 - v) * corners[1].x +
              u * v * corners[2].x +
              (1 - u) * v * corners[3].x

            const dstY =
              (1 - u) * (1 - v) * corners[0].y +
              u * (1 - v) * corners[1].y +
              u * v * corners[2].y +
              (1 - u) * v * corners[3].y

            const cellWidth = imageDimensions.width / steps
            const cellHeight = imageDimensions.height / steps
            const targetWidth = width / steps
            const targetHeight = height / steps

            ctx.drawImage(
              img,
              srcX,
              srcY,
              cellWidth,
              cellHeight,
              i * targetWidth,
              j * targetHeight,
              targetWidth,
              targetHeight,
            )
          }
        }
      } catch (error) {
        console.error("Perspective error:", error)
      }
    }
  }

  const detectSignatureBounds = async () => {
    if (!currentImage || !imageRef.current || !previewRef.current) return

    const img = document.createElement("img")
    img.src = currentImage

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      let minX = canvas.width
      let minY = canvas.height
      let maxX = 0
      let maxY = 0

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4
          const alpha = data[i + 3]

          if (alpha > 50) {
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
          }
        }
      }

      const padding = Math.min(canvas.width, canvas.height) * 0.05
      minX = Math.max(0, minX - padding)
      minY = Math.max(0, minY - padding)
      maxX = Math.min(canvas.width, maxX + padding)
      maxY = Math.min(canvas.height, maxY + padding)

      if (imageRef.current) {
        const displayRect = imageRef.current.getBoundingClientRect()
        const scaleX = displayRect.width / canvas.width
        const scaleY = displayRect.height / canvas.height

        setCropBox({
          x: minX * scaleX,
          y: minY * scaleY,
          width: (maxX - minX) * scaleX,
          height: (maxY - minY) * scaleY,
        })
      }
    }
  }

  const handlePerspectiveMouseDown = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingCorner(index)
  }

  const handlePerspectiveMouseMove = (e: MouseEvent) => {
    if (draggingCorner === null || !perspectiveContainerRef.current || !imageDimensions) return

    const rect = perspectiveContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const scaleX = imageDimensions.width / rect.width
    const scaleY = imageDimensions.height / rect.height

    setCorners((prev) => {
      const newCorners = [...prev]
      newCorners[draggingCorner] = {
        x: Math.max(0, Math.min(imageDimensions.width, x * scaleX)),
        y: Math.max(0, Math.min(imageDimensions.height, y * scaleY)),
      }
      return newCorners
    })
  }

  const handlePerspectiveMouseUp = () => {
    setDraggingCorner(null)
  }

  useEffect(() => {
    if (draggingCorner !== null) {
      document.addEventListener("mousemove", handlePerspectiveMouseMove)
      document.addEventListener("mouseup", handlePerspectiveMouseUp)
      return () => {
        document.removeEventListener("mousemove", handlePerspectiveMouseMove)
        document.removeEventListener("mouseup", handlePerspectiveMouseUp)
      }
    }
  }, [draggingCorner, imageDimensions])

  const handleMouseDown = (e: React.MouseEvent, type: "move" | "nw" | "ne" | "sw" | "se" | "rotate") => {
    e.preventDefault()
    e.stopPropagation()

    if (type === "rotate") {
      setIsRotating(true)
      setDragType("rotate")
    } else {
      setIsDragging(true)
      setDragType(type)
    }

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if ((!isDragging && !isRotating) || !dragType || !previewRef.current) return

    if (dragType === "rotate") {
      const rect = previewRef.current.getBoundingClientRect()
      const centerX = rect.left + cropBox.x + cropBox.width / 2
      const centerY = rect.top + cropBox.y + cropBox.height / 2

      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
      const degrees = (angle * 180) / Math.PI

      setRotation(Math.round(degrees))
      return
    }

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    const containerRect = previewRef.current.getBoundingClientRect()

    setCropBox((prev) => {
      let newBox = { ...prev }
      const minSize = 50

      if (dragType === "move") {
        newBox.x = Math.max(0, Math.min(containerRect.width - prev.width, prev.x + deltaX))
        newBox.y = Math.max(0, Math.min(containerRect.height - prev.height, prev.y + deltaY))
      } else {
        if (dragType === "nw") {
          const newX = Math.max(0, prev.x + deltaX)
          const newY = Math.max(0, prev.y + deltaY)
          const newWidth = prev.width - (newX - prev.x)
          const newHeight = prev.height - (newY - prev.y)
          if (newWidth >= minSize && newHeight >= minSize) {
            newBox = { x: newX, y: newY, width: newWidth, height: newHeight }
          }
        } else if (dragType === "ne") {
          const newY = Math.max(0, prev.y + deltaY)
          const newWidth = Math.max(minSize, prev.width + deltaX)
          const newHeight = prev.height - (newY - prev.y)
          if (newHeight >= minSize) {
            newBox = { ...prev, y: newY, width: newWidth, height: newHeight }
          }
        } else if (dragType === "sw") {
          const newX = Math.max(0, prev.x + deltaX)
          const newWidth = prev.width - (newX - prev.x)
          const newHeight = Math.max(minSize, prev.height + deltaY)
          if (newWidth >= minSize) {
            newBox = { x: newX, y: prev.y, width: newWidth, height: newHeight }
          }
        } else if (dragType === "se") {
          newBox = {
            ...prev,
            width: Math.max(minSize, prev.width + deltaX),
            height: Math.max(minSize, prev.height + deltaY),
          }
        }
      }
      return newBox
    })

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsRotating(false)
    setDragType(null)
  }

  useEffect(() => {
    if (isDragging || isRotating) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isRotating, dragType, dragStart, cropBox])

  const applyCrop = async () => {
    if (!currentImage || !imageRef.current) return

    try {
      const img = document.createElement("img")
      img.src = currentImage

      await new Promise((resolve) => {
        img.onload = resolve
      })

      if (!imageRef.current) return

      const displayRect = imageRef.current.getBoundingClientRect()
      const scaleX = img.width / displayRect.width
      const scaleY = img.height / displayRect.height

      if (rotation !== 0) {
        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d")
        if (!tempCtx) return

        const radians = (rotation * Math.PI) / 180
        const cos = Math.abs(Math.cos(radians))
        const sin = Math.abs(Math.sin(radians))
        const newWidth = img.width * cos + img.height * sin
        const newHeight = img.width * sin + img.height * cos

        tempCanvas.width = newWidth
        tempCanvas.height = newHeight

        tempCtx.save()
        tempCtx.translate(newWidth / 2, newHeight / 2)
        tempCtx.rotate(radians)
        tempCtx.drawImage(img, -img.width / 2, -img.height / 2)
        tempCtx.restore()

        const cropX = cropBox.x * scaleX + (newWidth - img.width) / 2
        const cropY = cropBox.y * scaleY + (newHeight - img.height) / 2
        const cropWidth = cropBox.width * scaleX
        const cropHeight = cropBox.height * scaleY

        const finalCanvas = document.createElement("canvas")
        const finalCtx = finalCanvas.getContext("2d")
        if (!finalCtx) return

        finalCanvas.width = cropWidth
        finalCanvas.height = cropHeight

        finalCtx.drawImage(tempCanvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

        setCroppedImage(finalCanvas.toDataURL("image/png"))
      } else {
        const cropX = cropBox.x * scaleX
        const cropY = cropBox.y * scaleY
        const cropWidth = cropBox.width * scaleX
        const cropHeight = cropBox.height * scaleY

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = cropWidth
        canvas.height = cropHeight

        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

        setCroppedImage(canvas.toDataURL("image/png"))
      }
    } catch (error) {
      console.error("Crop error:", error)
      alert("Failed to crop image. Please try again.")
    }
  }

  const applyPerspectiveCorrection = () => {
    const canvas = perspectivePreviewRef.current
    if (canvas) {
      setPerspectiveCorrectedImage(canvas.toDataURL("image/png"))
      setShowPerspective(false)
      setCroppedImage(null)
      setRotation(0)
    }
  }

  const handleDownloadCropped = () => {
    const imageToDownload = croppedImage || currentImage
    const link = document.createElement("a")
    link.download = `signature-transparent-${new Date().getTime()}.png`
    link.href = imageToDownload
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onDownload()
  }

  const cornerLabels = ["Top Left", "Top Right", "Bottom Right", "Bottom Left"]

  if (showPerspective) {
    return (
      <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Move className="w-7 h-7 text-" />
            Fix Perspective Tilt
          </h2>
          <p className="text-gray-700">Drag the blue corner handles to straighten your signature</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 font-bold text-gray-900 text-lg flex items-center justify-between">
              <span>Adjust Corners</span>
              <button
                onClick={() => {
                  if (imageDimensions) {
                    setCorners([
                      { x: 0, y: 0 },
                      { x: imageDimensions.width, y: 0 },
                      { x: imageDimensions.width, y: imageDimensions.height },
                      { x: 0, y: imageDimensions.height },
                    ])
                  }
                }}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition text-sm flex items-center gap-2 font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
            <div
              ref={perspectiveContainerRef}
              className="relative p-6 bg-gray-50 flex items-center justify-center min-h-[500px]"
            >
              <canvas ref={perspectiveCanvasRef} className="max-w-full max-h-[450px] object-contain" />

              {imageDimensions &&
                corners.map((corner, index) => {
                  const rect = perspectiveContainerRef.current?.getBoundingClientRect()
                  const scaleX = rect ? rect.width / imageDimensions.width : 1
                  const scaleY = rect ? rect.height / imageDimensions.height : 1

                  return (
                    <div
                      key={index}
                      className="absolute w-8 h-8 bg-blue-600 border-4 border-white rounded-full cursor-move hover:scale-110 transition-transform shadow-lg z-10"
                      style={{
                        left: `${corner.x * scaleX}px`,
                        top: `${corner.y * scaleY}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onMouseDown={(e) => handlePerspectiveMouseDown(index, e)}
                      title={cornerLabels[index]}
                    />
                  )
                })}

              {imageDimensions && (
                <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
                  {corners.map((corner, index) => {
                    const rect = perspectiveContainerRef.current?.getBoundingClientRect()
                    const scaleX = rect ? rect.width / imageDimensions.width : 1
                    const scaleY = rect ? rect.height / imageDimensions.height : 1
                    const nextIndex = (index + 1) % 4

                    return (
                      <line
                        key={index}
                        x1={corner.x * scaleX}
                        y1={corner.y * scaleY}
                        x2={corners[nextIndex].x * scaleX}
                        y2={corners[nextIndex].y * scaleY}
                        stroke="#2563eb"
                        strokeWidth="3"
                        strokeDasharray="8,8"
                      />
                    )
                  })}
                </svg>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-6 py-4 font-bold text-gray-900 text-lg flex items-center gap-3">
              <Check className="w-6 h-6 text-green-600" />
              <span>Straightened Preview</span>
            </div>
            <div
              className="p-6 flex items-center justify-center min-h-[500px] bg-gray-50"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                  linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                  linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
                `,
                backgroundSize: "30px 30px",
                backgroundPosition: "0 0, 0 15px, 15px -15px, -15px 0px",
              }}
            >
              <canvas
                ref={perspectivePreviewRef}
                className="max-w-full max-h-[450px] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowPerspective(false)}
            className="px-10 py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-bold transition-all flex items-center gap-3 text-lg shadow-md"
          >
            <RotateCcw className="w-6 h-6" />
            Cancel
          </button>
          <button
            onClick={applyPerspectiveCorrection}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-3 text-lg shadow-md"
          >
            <Check className="w-6 h-6" />
            Apply & Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-4">
              <Check className="w-8 h-8 text-green-600" />
              Signature Ready!
            </h2>
            <p className="text-gray-700 text-lg font-medium">
              Professional quality • Transparent background • High resolution
            </p>
          </div>
          <button
            onClick={() => setShowPerspective(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-3 shadow-lg text-base"
          >
            <Move className="w-5 h-5" />
            Fix Perspective
          </button>
        </div>
      </div>

      {/* Before & After Comparison */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Original Image */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 px-6 py-4">
            <p className="text-gray-900 font-bold text-xl">Original Photo</p>
          </div>
          <div className="p-8 bg-white">
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
              <img
                src={originalImage || "/placeholder.svg"}
                alt="Original signature"
                className="w-full h-auto max-h-[400px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Image */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-300 px-6 py-4 flex items-center justify-between">
            <p className="text-gray-900 font-bold text-xl">Enhanced Version</p>
            {!croppedImage && (
              <button
                onClick={applyCrop}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all flex items-center gap-2 shadow-md text-sm"
              >
                <Crop className="w-4 h-4" />
                Apply Changes
              </button>
            )}
          </div>
          <div
            ref={previewRef}
            className="p-8 relative"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
              `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          >
            <div className="relative">
              <img
                ref={imageRef}
                src={croppedImage || currentImage}
                alt="Enhanced signature"
                className="w-full h-auto rounded-xl select-none max-h-[400px] object-contain border-2 border-gray-300 shadow-md"
                draggable={false}
                style={{
                  transform: croppedImage ? "none" : `rotate(${rotation}deg)`,
                  transition: isRotating ? "none" : "transform 0.1s ease-out",
                }}
              />

              {/* Crop Box Overlay */}
              {!croppedImage && (
                <>
                  <div
                    className="absolute border-3 border-blue-600 bg-blue-600/10 cursor-move"
                    style={{
                      left: `${cropBox.x}px`,
                      top: `${cropBox.y}px`,
                      width: `${cropBox.width}px`,
                      height: `${cropBox.height}px`,
                      boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.4)",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "move")}
                  >
                    {/* Corner Handles */}
                    <div
                      className="absolute -left-3 -top-3 w-6 h-6 bg-blue-600 border-3 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform z-10 shadow-lg"
                      onMouseDown={(e) => handleMouseDown(e, "nw")}
                    />
                    <div
                      className="absolute -right-3 -top-3 w-6 h-6 bg-blue-600 border-3 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform z-10 shadow-lg"
                      onMouseDown={(e) => handleMouseDown(e, "ne")}
                    />
                    <div
                      className="absolute -left-3 -bottom-3 w-6 h-6 bg-blue-600 border-3 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform z-10 shadow-lg"
                      onMouseDown={(e) => handleMouseDown(e, "sw")}
                    />
                    <div
                      className="absolute -right-3 -bottom-3 w-6 h-6 bg-blue-600 border-3 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform z-10 shadow-lg"
                      onMouseDown={(e) => handleMouseDown(e, "se")}
                    />

                    {/* Rotation Handle */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center cursor-grab active:cursor-grabbing z-20"
                      style={{ top: "-60px" }}
                      onMouseDown={(e) => handleMouseDown(e, "rotate")}
                    >
                      <div className="w-1 h-10 bg-blue-600 rounded-full"></div>
                      <div className="w-8 h-8 bg-blue-600 border-3 border-white rounded-full hover:scale-125 transition-transform shadow-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>
                      {isRotating && (
                        <div className="absolute -bottom-10 bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                          {rotation}°
                        </div>
                      )}
                    </div>

                    {/* Grid Lines */}
                    <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-white/50" />
                    <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-white/50" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-white/50" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-white/50" />
                  </div>

                  {/* Rotation Indicator */}
                  {rotation !== 0 && !isRotating && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-3 text-base">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Rotated {rotation}°
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setRotation(0)
                        }}
                        className="ml-2 text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition font-bold"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-5">
        <button
          onClick={handleDownloadCropped}
          className="bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-xl shadow-lg"
        >
          <Download className="w-7 h-7" />
          Download Signature
        </button>
        <button
          onClick={onReset}
          className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-12 py-5 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-xl shadow-lg"
        >
          <RotateCcw className="w-7 h-7" />
          Upload New
        </button>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">PNG Format</h3>
          <p className="text-gray-600 text-sm">Perfect for all uses</p>
        </div>
        
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Transparent</h3>
          <p className="text-gray-600 text-sm">No background included</p>
        </div>
        
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">High Resolution</h3>
          <p className="text-gray-600 text-sm">Crystal clear quality</p>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 shadow-md">
        <h3 className="font-bold text-gray-900 mb-6 text-2xl flex items-center gap-3">
          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to Use Your Signature
        </h3>
        <ul className="space-y-4 text-gray-800 text-base">
          <li className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm">
            <span className="text-blue-600 font-bold text-2xl">•</span>
            <span className="font-medium">Insert into PDF documents and contracts</span>
          </li>
          <li className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm">
            <span className="text-blue-600 font-bold text-2xl">•</span>
            <span className="font-medium">Add to email signatures and business cards</span>
          </li>
          <li className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm">
            <span className="text-blue-600 font-bold text-2xl">•</span>
            <span className="font-medium">Use in digital signing applications</span>
          </li>
          <li className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm">
            <span className="text-blue-600 font-bold text-2xl">•</span>
            <span className="font-medium">Add watermark to creative work</span>
          </li>
        </ul>
      </div>
    </div>
  )
}