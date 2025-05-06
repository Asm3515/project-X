"use client"

import { Handle, Position } from "reactflow"
import { GitBranch } from "lucide-react"

interface ConditionNodeProps {
  data: {
    label: string
    condition?: string
  }
  selected: boolean
}

export function ConditionNode({ data, selected }: ConditionNodeProps) {
  return (
    <div className={`rounded-md border bg-background p-3 shadow-sm ${selected ? "ring-2 ring-primary" : ""}`}>
      <Handle type="target" position={Position.Top} className="!bg-orange-500" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-orange-500/10 p-1">
            <GitBranch className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-sm font-medium">{data.label}</div>
        </div>
        {data.condition && <div className="text-xs text-muted-foreground">If: {data.condition}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} id="true" className="!bg-green-500 !right-auto !left-[25%]" />
      <Handle type="source" position={Position.Bottom} id="false" className="!bg-red-500 !left-auto !right-[25%]" />
    </div>
  )
}
