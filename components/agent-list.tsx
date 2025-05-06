import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, MoreHorizontal, Play, Edit } from "lucide-react"
import Link from "next/link"

export function AgentList() {
  const agents = [
    {
      id: "1",
      name: "Research Agent",
      description: "Performs web searches and summarizes information",
      model: "gpt-4o",
      status: "Active",
      lastUsed: "1 hour ago",
    },
    {
      id: "2",
      name: "Customer Support Agent",
      description: "Answers customer queries using RAG",
      model: "gpt-4o",
      status: "Active",
      lastUsed: "30 minutes ago",
    },
    {
      id: "3",
      name: "Data Analyst Agent",
      description: "Analyzes data and generates insights",
      model: "claude-3-opus",
      status: "Inactive",
      lastUsed: "2 days ago",
    },
    {
      id: "4",
      name: "Content Writer",
      description: "Generates blog posts and articles",
      model: "gpt-4o",
      status: "Active",
      lastUsed: "3 hours ago",
    },
    {
      id: "5",
      name: "Code Assistant",
      description: "Helps with coding tasks and debugging",
      model: "claude-3-sonnet",
      status: "Draft",
      lastUsed: "Never",
    },
  ]

  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <div key={agent.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-start gap-4">
            <div className="rounded-md bg-primary/10 p-2">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/agents/${agent.id}`}>
                  <h3 className="font-medium hover:underline">{agent.name}</h3>
                </Link>
                <Badge
                  variant={agent.status === "Active" ? "default" : agent.status === "Draft" ? "outline" : "secondary"}
                >
                  {agent.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{agent.description}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Model: {agent.model}</span>
                <span>•</span>
                <span>Last used: {agent.lastUsed}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Play className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
