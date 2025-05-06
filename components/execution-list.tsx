import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MoreHorizontal, Play, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export function ExecutionList() {
  const executions = [
    {
      id: "1",
      workflowName: "Research Assistant",
      status: "Completed",
      startTime: "2023-05-06T10:30:00Z",
      duration: "2m 15s",
      agent: "Research Agent",
    },
    {
      id: "2",
      workflowName: "Customer Support Agent",
      status: "Running",
      startTime: "2023-05-06T11:45:00Z",
      duration: "1m 30s",
      agent: "Support Agent",
    },
    {
      id: "3",
      workflowName: "LinkedIn Lead Generator",
      status: "Failed",
      startTime: "2023-05-06T09:15:00Z",
      duration: "0m 45s",
      agent: "Lead Gen Agent",
    },
    {
      id: "4",
      workflowName: "Data Cleaning Pipeline",
      status: "Completed",
      startTime: "2023-05-06T08:00:00Z",
      duration: "5m 20s",
      agent: "Data Agent",
    },
    {
      id: "5",
      workflowName: "Content Summarizer",
      status: "Completed",
      startTime: "2023-05-05T16:30:00Z",
      duration: "1m 10s",
      agent: "Content Agent",
    },
  ]

  return (
    <div className="space-y-4">
      {executions.map((execution) => (
        <div key={execution.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-start gap-4">
            <div className="rounded-md bg-primary/10 p-2">
              {execution.status === "Completed" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : execution.status === "Running" ? (
                <Play className="h-5 w-5 text-blue-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/executions/${execution.id}`}>
                  <h3 className="font-medium hover:underline">{execution.workflowName}</h3>
                </Link>
                <Badge
                  variant={
                    execution.status === "Completed"
                      ? "default"
                      : execution.status === "Running"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {execution.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Agent: {execution.agent}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{new Date(execution.startTime).toLocaleString()}</span>
                <span>•</span>
                <span>Duration: {execution.duration}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Logs
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
