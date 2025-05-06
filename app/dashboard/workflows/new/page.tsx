"use client"

import { WorkflowEditor } from "@/components/workflow-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { DraggableNode } from "@/components/draggable-node"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Node, Edge } from "reactflow"

export default function NewWorkflowPage() {
  const [name, setName] = useState("My New Workflow")
  const [description, setDescription] = useState("An AI workflow that...")
  const router = useRouter()
  const { toast } = useToast()

  const handleSaveWorkflow = (nodes: Node[], edges: Edge[]) => {
    // In a real app, this would save to a database
    console.log("Saving workflow:", { name, description, nodes, edges })

    toast({
      title: "Workflow saved",
      description: "Your workflow has been saved successfully.",
    })

    // Navigate to the workflows list
    router.push("/dashboard/workflows")
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
          <h1 className="text-2xl font-bold">Create New Workflow</h1>
        </div>
        <Button
          className="gap-1"
          onClick={() => {
            toast({
              title: "Workflow saved",
              description: "Your workflow has been saved successfully.",
            })
            router.push("/dashboard/workflows")
          }}
        >
          <Save className="h-4 w-4" /> Save Workflow
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input
                    id="name"
                    placeholder="My Research Agent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="An agent that researches topics and generates reports"
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
                      <DraggableNode
                        type="agent"
                        label="Tool Agent"
                        data={{
                          label: "Tool Agent",
                          description: "Specialized for tool usage",
                          model: "gpt-4o",
                        }}
                      />
                      <DraggableNode
                        type="agent"
                        label="Router Agent"
                        data={{
                          label: "Router Agent",
                          description: "Routes tasks to other agents",
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
                      <DraggableNode type="input" label="Input" data={{ label: "User Input" }} />
                      <DraggableNode type="output" label="Output" data={{ label: "Final Output" }} />
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
                        { name: "Database", description: "Query and update database records" },
                        { name: "API Call", description: "Make calls to external APIs" },
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
                      <Input id="model" placeholder="gpt-4o" defaultValue="gpt-4o" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memory">Memory Type</Label>
                      <Input id="memory" placeholder="Buffer Memory" defaultValue="Buffer Memory" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeout">Execution Timeout (seconds)</Label>
                      <Input id="timeout" type="number" placeholder="300" defaultValue="300" />
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
              <WorkflowEditor onSave={handleSaveWorkflow} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
