"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Play, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface WorkflowExecutionProps {
  workflowId: string
  workflowName: string
}

export function WorkflowExecution({ workflowId, workflowName }: WorkflowExecutionProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleExecute = async () => {
    if (!session?.user?.id) return

    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please provide input for the workflow",
        variant: "destructive",
      })
      return
    }

    setIsExecuting(true)
    setOutput("")

    try {
      // Use the API route instead of direct server action to avoid bundling MongoDB in client
      const response = await fetch(`/api/workflows/${workflowId}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to execute workflow")
      }

      const result = await response.json()
      setOutput(result.output || "Execution completed successfully")

      toast({
        title: "Workflow executed",
        description: "The workflow has been executed successfully",
      })
    } catch (error) {
      console.error("Workflow execution failed:", error)

      setOutput(
        error instanceof Error ? `Execution failed: ${error.message}` : "Execution failed: An unknown error occurred",
      )

      toast({
        title: "Execution failed",
        description: "The workflow execution failed",
        variant: "destructive",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execute Workflow</CardTitle>
        <CardDescription>Run {workflowName} with your input</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <Textarea
            placeholder="Enter your input for the workflow..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            disabled={isExecuting}
          />
        </div>
        {(isExecuting || output) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Output</label>
            {isExecuting ? (
              <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Executing workflow...</span>
                </div>
              </div>
            ) : (
              <div className="rounded-md border p-4">
                <pre className="whitespace-pre-wrap text-sm">{output}</pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleExecute} disabled={isExecuting || !input.trim()} className="gap-2">
          {isExecuting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Execute Workflow
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
