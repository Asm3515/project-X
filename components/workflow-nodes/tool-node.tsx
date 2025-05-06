"use client"

import { Handle, Position } from "reactflow"
import { Wrench } from "lucide-react"

interface ToolNodeProps {
  data: {
    label: string
    description?: string
    toolType?: string
  }
  selected: boolean
}

export function ToolNode({ data, selected }: ToolNodeProps) {
  return (
    <div className={`rounded-md border bg-background p-3 shadow-sm ${selected ? "ring-2 ring-primary" : ""}`}>
      <Handle type="target" position={Position.Top} className="!bg-purple-500" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-purple-500/10 p-1">
            <Wrench className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-sm font-medium">{data.label}</div>
        </div>
        {data.description && <div className="text-xs text-muted-foreground">{data.description}</div>}
        {data.toolType && <div className="text-xs text-muted-foreground">Type: {data.toolType}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" />
    </div>
  )
}
