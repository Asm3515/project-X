"use client"

import { create } from "zustand"
import type { AgentConfig, AgentTool } from "@/lib/agent-utils"

interface AgentState {
  agents: AgentConfig[]
  currentAgent: AgentConfig | null
  setCurrentAgent: (agent: AgentConfig) => void
  addAgent: (agent: AgentConfig) => void
  updateAgent: (id: string, agent: Partial<AgentConfig>) => void
  deleteAgent: (id: string) => void
  addTool: (agentId: string, tool: AgentTool) => void
  updateTool: (agentId: string, toolId: string, tool: Partial<AgentTool>) => void
  deleteTool: (agentId: string, toolId: string) => void
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  currentAgent: null,

  setCurrentAgent: (agent) => set({ currentAgent: agent }),

  addAgent: (agent) =>
    set((state) => ({
      agents: [...state.agents, agent],
    })),

  updateAgent: (id, updatedAgent) =>
    set((state) => ({
      agents: state.agents.map((agent) => (agent.id === id ? { ...agent, ...updatedAgent } : agent)),
      currentAgent: state.currentAgent?.id === id ? { ...state.currentAgent, ...updatedAgent } : state.currentAgent,
    })),

  deleteAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((agent) => agent.id !== id),
      currentAgent: state.currentAgent?.id === id ? null : state.currentAgent,
    })),

  addTool: (agentId, tool) =>
    set((state) => ({
      agents: state.agents.map((agent) => (agent.id === agentId ? { ...agent, tools: [...agent.tools, tool] } : agent)),
      currentAgent:
        state.currentAgent?.id === agentId
          ? { ...state.currentAgent, tools: [...state.currentAgent.tools, tool] }
          : state.currentAgent,
    })),

  updateTool: (agentId, toolId, updatedTool) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              tools: agent.tools.map((tool) => (tool.id === toolId ? { ...tool, ...updatedTool } : tool)),
            }
          : agent,
      ),
      currentAgent:
        state.currentAgent?.id === agentId
          ? {
              ...state.currentAgent,
              tools: state.currentAgent.tools.map((tool) => (tool.id === toolId ? { ...tool, ...updatedTool } : tool)),
            }
          : state.currentAgent,
    })),

  deleteTool: (agentId, toolId) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, tools: agent.tools.filter((tool) => tool.id !== toolId) } : agent,
      ),
      currentAgent:
        state.currentAgent?.id === agentId
          ? { ...state.currentAgent, tools: state.currentAgent.tools.filter((tool) => tool.id !== toolId) }
          : state.currentAgent,
    })),
}))
