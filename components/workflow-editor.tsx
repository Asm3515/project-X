"use client"

import type React from "react"

import { useCallback, useState, useRef } from "react"
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  useEdgesState,
  useNodesState,
  Panel,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { AgentNode } from "./workflow-nodes/agent-node"
import { InputNode } from "./workflow-nodes/input-node"
import { OutputNode } from "./workflow-nodes/output-node"
import { ConditionNode } from "./workflow-nodes/condition-node"
import { ToolNode } from "./workflow-nodes/tool-node"
import { Button } from "./ui/button"
import { Trash2, Save, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

const nodeTypes: NodeTypes = {
  agent: AgentNode,
  input: InputNode,
  output: OutputNode,
  condition: ConditionNode,
  tool: ToolNode,
}

interface WorkflowEditorProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  readOnly?: boolean
  onSave?: (nodes: Node[], edges: Edge[]) => void
}

export function WorkflowEditor({ initialNodes, initialEdges, readOnly = false, onSave }: WorkflowEditorProps) {
  const defaultNodes: Node[] = initialNodes || [
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
        label: "Research Agent",
        description: "Searches and analyzes information",
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
  ]

  const defaultEdges: Edge[] = initialEdges || [
    {
      id: "e-input-agent",
      source: "input-1",
      target: "agent-1",
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: "e-agent-output",
      source: "agent-1",
      target: "output-1",
      markerEnd: { type: MarkerType.ArrowClosed },
    },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}`,
        markerEnd: { type: MarkerType.ArrowClosed },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges],
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow/type")
      const nodeData = JSON.parse(event.dataTransfer.getData("application/reactflow/data") || "{}")

      // Check if the dropped element is valid
      if (!type) return

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      const newNode: Node = {
        id: `${type}-${uuidv4().slice(0, 8)}`,
        type,
        position,
        data: nodeData,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes],
  )

  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
      setSelectedNode(null)
    }
  }, [selectedNode, setNodes, setEdges])

  const handleSaveWorkflow = useCallback(() => {
    if (onSave) {
      onSave(nodes, edges)
    }

    toast({
      title: "Workflow saved",
      description: "Your workflow has been saved successfully.",
    })
  }, [nodes, edges, onSave, toast])

  const handleRunWorkflow = useCallback(() => {
    toast({
      title: "Workflow execution started",
      description: "Your workflow is now running. Check the executions page for results.",
    })
  }, [toast])

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        minZoom={0.5}
        maxZoom={2}
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.ArrowClosed },
        }}
      >
        <Background />
        <Controls />

        {!readOnly && (
          <Panel position="top-right" className="flex gap-2">
            {selectedNode && (
              <Button variant="destructive" size="sm" onClick={handleDeleteNode} className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                Delete Node
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleSaveWorkflow} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button size="sm" onClick={handleRunWorkflow} className="flex items-center gap-1">
              <Play className="h-4 w-4" />
              Run
            </Button>
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}
