"use client"

import { Handle, Position } from "reactflow"
import { ArrowDownToLine } from "lucide-react"

interface InputNodeProps {
  data: {
    label: string
  }
  selected: boolean
}

export function InputNode({ data, selected }: InputNodeProps) {
  return (
    <div className={`rounded-md border bg-background p-3 shadow-sm ${selected ? "ring-2 ring-primary" : ""}`}>
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-green-500/10 p-1">
          <ArrowDownToLine className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </div>
  )
}
