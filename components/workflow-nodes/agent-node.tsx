"use client"

import { Handle, Position } from "reactflow"
import { Bot } from "lucide-react"

interface AgentNodeProps {
  data: {
    label: string
    description: string
    model: string
  }
  selected: boolean
}

export function AgentNode({ data, selected }: AgentNodeProps) {
  return (
    <div className={`rounded-md border bg-background p-3 shadow-sm ${selected ? "ring-2 ring-primary" : ""}`}>
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-1">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm font-medium">{data.label}</div>
        </div>
        <div className="text-xs text-muted-foreground">{data.description}</div>
        <div className="text-xs text-muted-foreground">Model: {data.model}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  )
}
