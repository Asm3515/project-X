"use client"

import { CardDescription } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { WorkflowEditor } from "@/components/workflow-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Play, AlertCircle } from "lucide-react"
import Link from "next/link"
import { DraggableNode } from "@/components/draggable-node"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Node, Edge } from "reactflow"
import { Badge } from "@/components/ui/badge"
import { WorkflowExecution } from "@/components/workflow-execution"
import { fetchWorkflowById, saveWorkflow } from "@/lib/actions/workflow-actions"
import { useSession } from "next-auth/react"

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Active")
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [initialNodes, setInitialNodes] = useState<Node[]>([])
  const [initialEdges, setInitialEdges] = useState<Edge[]>([])
  const [activeTab, setActiveTab] = useState("edit")
  const [loadError, setLoadError] = useState<string | null>(null)
  const { data: session } = useSession()

  // Validate MongoDB ObjectId format
  const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id)

  // Fetch workflow data
  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!session?.user?.id) return

      setIsLoading(true)
      try {
        // Validate ID format first
        if (!isValidObjectId(params.id)) {
          setLoadError("Invalid workflow ID format")
          setIsLoading(false)
          return
        }

        const result = await fetchWorkflowById(params.id, session.user.id)

        if (result.error) {
          setLoadError(result.error)
          setIsLoading(false)
          return
        }

        const workflow = result.workflow

        setName(workflow.name)
        setDescription(workflow.description)
        setStatus(workflow.status)

        if (workflow.nodes && workflow.edges) {
          setInitialNodes(workflow.nodes)
          setInitialEdges(workflow.edges)
        } else {
          // Set default nodes and edges if none exist
          setInitialNodes([
            {
              id: "input-1",
              type: "input",
              data: { label: "User Input" },
              position: { x: 250, y: 25 },
            },
            {
              id: "agent-1",
              type: "agent",
              data: {
                label: "Processing Agent",
                description: "Processes user input",
                model: "gpt-4o",
              },
              position: { x: 250, y: 150 },
            },
            {
              id: "output-1",
              type: "output",
              data: { label: "Final Output" },
              position: { x: 250, y: 300 },
            },
          ])
          setInitialEdges([
            { id: "e-input-agent", source: "input-1", target: "agent-1", markerEnd: { type: "arrowclosed" } },
            { id: "e-agent-output", source: "agent-1", target: "output-1", markerEnd: { type: "arrowclosed" } },
          ])
        }
      } catch (error) {
        console.error("Error fetching workflow:", error)
        setLoadError(error instanceof Error ? error.message : "Failed to load workflow")
        toast({
          title: "Error",
          description: "Failed to load workflow",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchWorkflow()
    }
  }, [params.id, session, toast])

  const handleSaveWorkflow = async (nodes: Node[], edges: Edge[]) => {
    if (!session?.user?.id) return

    try {
      if (!isValidObjectId(params.id)) {
        toast({
          title: "Error",
          description: "Invalid workflow ID format",
          variant: "destructive",
        })
        return
      }

      const result = await saveWorkflow(params.id, session.user.id, {
        name,
        description,
        status,
        nodes,
        edges,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Workflow saved",
        description: "Your workflow has been saved successfully",
      })
    } catch (error) {
      console.error("Error saving workflow:", error)
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive",
      })
    }
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Error Loading Workflow</CardTitle>
            </div>
            <CardDescription>There was a problem loading this workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{loadError}</p>
            <div className="flex justify-end">
              <Link href="/dashboard/workflows">
                <Button>Return to Workflows</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Workflow</CardTitle>
            <CardDescription>Please wait while we load your workflow</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/workflows">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={status === "Active" ? "default" : status === "Draft" ? "outline" : "secondary"}>
                {status}
              </Badge>
              <span className="text-xs text-muted-foreground">ID: {params.id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1" onClick={() => setActiveTab("execute")}>
            <Play className="h-4 w-4" /> Run Workflow
          </Button>
          <Button className="gap-1" onClick={() => handleSaveWorkflow(initialNodes, initialEdges)}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="edit">Edit Workflow</TabsTrigger>
          <TabsTrigger value="execute">Execute</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="pt-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4 md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Workflow Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="nodes">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="nodes">Nodes</TabsTrigger>
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="nodes" className="space-y-4 pt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Agent Nodes</h3>
                        <p className="text-xs text-muted-foreground">Drag and drop to add to workflow</p>
                        <div className="grid grid-cols-2 gap-2">
                          <DraggableNode
                            type="agent"
                            label="LLM Agent"
                            data={{
                              label: "LLM Agent",
                              description: "General purpose LLM agent",
                              model: "gpt-4o",
                            }}
                          />
                          <DraggableNode
                            type="agent"
                            label="RAG Agent"
                            data={{
                              label: "RAG Agent",
                              description: "Retrieval augmented generation",
                              model: "gpt-4o",
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Process Nodes</h3>
                        <p className="text-xs text-muted-foreground">Drag and drop to add to workflow</p>
                        <div className="grid grid-cols-2 gap-2">
                          <DraggableNode
                            type="condition"
                            label="Condition"
                            data={{
                              label: "Condition",
                              condition: "result.confidence > 0.8",
                            }}
                          />
                          <DraggableNode
                            type="tool"
                            label="Tool"
                            data={{
                              label: "Tool",
                              description: "External tool or API",
                              toolType: "API",
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="tools" className="space-y-4 pt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Available Tools</h3>
                        <p className="text-xs text-muted-foreground">Tools your agents can use</p>
                        <div className="space-y-2">
                          {[
                            { name: "Web Search", description: "Search the web for information" },
                            { name: "Web Browser", description: "Browse and extract content from websites" },
                            { name: "File Reader", description: "Read and parse document files" },
                          ].map((tool) => (
                            <div
                              key={tool.name}
                              className="flex items-center justify-between rounded-md border p-2 text-sm"
                            >
                              <div>
                                <div className="font-medium">{tool.name}</div>
                                <div className="text-xs text-muted-foreground">{tool.description}</div>
                              </div>
                              <DraggableNode
                                type="tool"
                                label="Add"
                                data={{
                                  label: tool.name,
                                  description: tool.description,
                                  toolType: tool.name,
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4 pt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="model">Default LLM Model</Label>
                          <Input id="model" defaultValue="gpt-4o" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="memory">Memory Type</Label>
                          <Input id="memory" defaultValue="Buffer Memory" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeout">Execution Timeout (seconds)</Label>
                          <Input id="timeout" type="number" defaultValue="300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="md:col-span-2">
              <Card className="h-[calc(100vh-12rem)]">
                <CardContent className="p-0 h-full">
                  <WorkflowEditor initialNodes={initialNodes} initialEdges={initialEdges} onSave={handleSaveWorkflow} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="execute" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <WorkflowExecution workflowId={params.id} workflowName={name} />
            <Card>
              <CardHeader>
                <CardTitle>Execution History</CardTitle>
                <CardDescription>Recent executions of this workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">
                    <p>Execute the workflow to see execution history</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
