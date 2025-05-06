"use client"

import { Handle, Position } from "reactflow"
import { ArrowUpToLine } from "lucide-react"

interface OutputNodeProps {
  data: {
    label: string
  }
  selected: boolean
}

export function OutputNode({ data, selected }: OutputNodeProps) {
  return (
    <div className={`rounded-md border bg-background p-3 shadow-sm ${selected ? "ring-2 ring-primary" : ""}`}>
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-blue-500/10 p-1">
          <ArrowUpToLine className="h-4 w-4 text-blue-500" />
        </div>
        <div className="text-sm font-medium">{data.label}</div>
      </div>
    </div>
  )
}
