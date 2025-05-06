"use client"

import { create } from "zustand"
import type { WorkflowConfig, WorkflowNode, WorkflowEdge } from "@/lib/agent-utils"

interface WorkflowState {
  workflows: WorkflowConfig[]
  currentWorkflow: WorkflowConfig | null
  setCurrentWorkflow: (workflow: WorkflowConfig) => void
  addWorkflow: (workflow: WorkflowConfig) => void
  updateWorkflow: (id: string, workflow: Partial<WorkflowConfig>) => void
  deleteWorkflow: (id: string) => void
  addNode: (node: WorkflowNode) => void
  updateNode: (id: string, data: Partial<WorkflowNode>) => void
  deleteNode: (id: string) => void
  addEdge: (edge: WorkflowEdge) => void
  deleteEdge: (id: string) => void
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflows: [],
  currentWorkflow: null,

  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),

  addWorkflow: (workflow) =>
    set((state) => ({
      workflows: [...state.workflows, workflow],
    })),

  updateWorkflow: (id, updatedWorkflow) =>
    set((state) => ({
      workflows: state.workflows.map((workflow) =>
        workflow.id === id ? { ...workflow, ...updatedWorkflow } : workflow,
      ),
      currentWorkflow:
        state.currentWorkflow?.id === id ? { ...state.currentWorkflow, ...updatedWorkflow } : state.currentWorkflow,
    })),

  deleteWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((workflow) => workflow.id !== id),
      currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow,
    })),

  addNode: (node) =>
    set((state) => {
      if (!state.currentWorkflow) return state

      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          nodes: [...state.currentWorkflow.nodes, node],
        },
      }
    }),

  updateNode: (id, data) =>
    set((state) => {
      if (!state.currentWorkflow) return state

      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          nodes: state.currentWorkflow.nodes.map((node) => (node.id === id ? { ...node, ...data } : node)),
        },
      }
    }),

  deleteNode: (id) =>
    set((state) => {
      if (!state.currentWorkflow) return state

      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          nodes: state.currentWorkflow.nodes.filter((node) => node.id !== id),
          edges: state.currentWorkflow.edges.filter((edge) => edge.source !== id && edge.target !== id),
        },
      }
    }),

  addEdge: (edge) =>
    set((state) => {
      if (!state.currentWorkflow) return state

      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          edges: [...state.currentWorkflow.edges, edge],
        },
      }
    }),

  deleteEdge: (id) =>
    set((state) => {
      if (!state.currentWorkflow) return state

      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          edges: state.currentWorkflow.edges.filter((edge) => edge.id !== id),
        },
      }
    }),
}))
