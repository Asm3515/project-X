"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, GitBranch, MoreHorizontal, Play, Edit, Copy, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface WorkflowListProps {
  extended?: boolean
}

export function WorkflowList({ extended = false }: WorkflowListProps) {
  const { toast } = useToast()
  const [workflows, setWorkflows] = useState([
    {
      id: "1",
      name: "Research Assistant",
      description: "Researches topics and generates reports",
      status: "Active",
      lastRun: "2 hours ago",
      type: "Research",
      agents: ["Research Agent", "Content Writer"],
      tools: ["Web Search", "Document Reader"],
      createdAt: "2023-04-15",
    },
    {
      id: "2",
      name: "Customer Support Agent",
      description: "Answers customer queries using knowledge base",
      status: "Active",
      lastRun: "30 minutes ago",
      type: "Support",
      agents: ["Support Agent", "Knowledge Base Agent"],
      tools: ["Database Query", "Email Sender"],
      createdAt: "2023-04-20",
    },
    {
      id: "3",
      name: "LinkedIn Lead Generator",
      description: "Identifies potential leads and crafts outreach messages",
      status: "Inactive",
      lastRun: "2 days ago",
      type: "Marketing",
      agents: ["Lead Finder", "Message Composer"],
      tools: ["LinkedIn API", "Email Sender"],
      createdAt: "2023-04-25",
    },
    {
      id: "4",
      name: "Data Cleaning Pipeline",
      description: "Cleans and normalizes data sets",
      status: "Active",
      lastRun: "1 hour ago",
      type: "Data",
      agents: ["Data Processor", "Quality Checker"],
      tools: ["CSV Parser", "Database Writer"],
      createdAt: "2023-05-01",
    },
    {
      id: "5",
      name: "Content Summarizer",
      description: "Summarizes articles and documents",
      status: "Draft",
      lastRun: "Never",
      type: "Content",
      agents: ["Content Analyzer"],
      tools: ["Document Reader", "Text Processor"],
      createdAt: "2023-05-03",
    },
  ])

  const handleRunWorkflow = (id: string) => {
    toast({
      title: "Workflow started",
      description: `Workflow ${id} is now running. Check executions for results.`,
    })
  }

  const handleDuplicateWorkflow = (id: string) => {
    const workflowToDuplicate = workflows.find((w) => w.id === id)
    if (!workflowToDuplicate) return

    const newWorkflow = {
      ...workflowToDuplicate,
      id: `${Number.parseInt(workflowToDuplicate.id) + workflows.length}`,
      name: `${workflowToDuplicate.name} (Copy)`,
      status: "Draft",
      lastRun: "Never",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setWorkflows([...workflows, newWorkflow])

    toast({
      title: "Workflow duplicated",
      description: `Created a copy of ${workflowToDuplicate.name}`,
    })
  }

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((w) => w.id !== id))

    toast({
      title: "Workflow deleted",
      description: "The workflow has been deleted successfully.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-4">
      {workflows.slice(0, extended ? undefined : 4).map((workflow) => (
        <div key={workflow.id} className="flex flex-col rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-primary/10 p-2">
                {workflow.type === "Research" ? (
                  <GitBranch className="h-5 w-5 text-primary" />
                ) : (
                  <Bot className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/workflows/${workflow.id}`}>
                    <h3 className="font-medium hover:underline">{workflow.name}</h3>
                  </Link>
                  <Badge
                    variant={
                      workflow.status === "Active" ? "default" : workflow.status === "Draft" ? "outline" : "secondary"
                    }
                  >
                    {workflow.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{workflow.description}</p>
                <div className="mt-1 text-xs text-muted-foreground">Last run: {workflow.lastRun}</div>

                {extended && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {workflow.agents.map((agent) => (
                      <Badge key={agent} variant="secondary" className="text-xs">
                        {agent}
                      </Badge>
                    ))}
                    {workflow.tools.map((tool) => (
                      <Badge key={tool} variant="outline" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleRunWorkflow(workflow.id)}>
                <Play className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={`/dashboard/workflows/${workflow.id}`}>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => handleDuplicateWorkflow(workflow.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDeleteWorkflow(workflow.id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
