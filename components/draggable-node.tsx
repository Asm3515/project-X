"use client"

import type React from "react"

import { useState } from "react"

interface DraggableNodeProps {
  type: string
  label: string
  data?: Record<string, any>
}

export function DraggableNode({ type, label, data = {} }: DraggableNodeProps) {
  const [isDragging, setIsDragging] = useState(false)

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/reactflow/type", type)
    event.dataTransfer.setData("application/reactflow/data", JSON.stringify(data))
    event.dataTransfer.effectAllowed = "move"
    setIsDragging(true)
  }

  const onDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      className={`flex items-center justify-center rounded-md border border-dashed p-2 text-sm cursor-move transition-opacity ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {label}
    </div>
  )
}
