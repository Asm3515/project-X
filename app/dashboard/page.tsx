"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Bot, GitBranch, Play, Clock } from "lucide-react"
import Link from "next/link"
import { WorkflowList } from "@/components/workflow-list"
import { useEffect, useState } from "react"
import { MetricsChart } from "@/components/metrics-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import { fetchWorkflows } from "@/lib/actions/workflow-actions"
import { fetchAgents } from "@/lib/actions/agent-actions"
import { fetchExecutions } from "@/lib/actions/execution-actions"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    activeAgents: 0,
    executionsToday: 0,
    avgExecutionTime: "0s",
  })

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!session?.user?.id) return

      try {
        setIsLoading(true)

        // Fetch data using server actions
        const [workflows, agents, executions] = await Promise.all([
          fetchWorkflows(session.user.id),
          fetchAgents(session.user.id),
          fetchExecutions(session.user.id, 50),
        ])

        // Calculate stats
        const activeAgents = agents.filter((agent: any) => agent.status === "Active").length

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const executionsToday = executions.filter((execution: any) => new Date(execution.createdAt) >= today).length

        // Calculate average execution time
        const completedExecutions = executions.filter(
          (execution: any) => execution.status === "Completed" && execution.metrics?.duration,
        )

        let avgDuration = 0
        if (completedExecutions.length > 0) {
          const totalDuration = completedExecutions.reduce(
            (sum: number, execution: any) => sum + (execution.metrics?.duration || 0),
            0,
          )
          avgDuration = totalDuration / completedExecutions.length
        }

        // Format average duration
        let avgExecutionTime = "0s"
        if (avgDuration > 0) {
          if (avgDuration < 1000) {
            avgExecutionTime = `${Math.round(avgDuration)}ms`
          } else if (avgDuration < 60000) {
            avgExecutionTime = `${Math.round(avgDuration / 1000)}s`
          } else {
            avgExecutionTime = `${Math.round(avgDuration / 60000)}m`
          }
        }

        setStats({
          totalWorkflows: workflows.length,
          activeAgents,
          executionsToday,
          avgExecutionTime,
        })
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.id) {
      loadDashboardData()
    }
  }, [session])

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your AI agents and workflows</p>
        </div>
        <Link href="/dashboard/workflows/new">
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> New Workflow
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
                <p className="text-xs text-muted-foreground">Your AI workflow templates</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeAgents}</div>
                <p className="text-xs text-muted-foreground">Agents ready for deployment</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions Today</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.executionsToday}</div>
                <p className="text-xs text-muted-foreground">Workflow runs in the last 24h</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Execution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.avgExecutionTime}</div>
                <p className="text-xs text-muted-foreground">Average workflow completion time</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Workflows</CardTitle>
            <CardDescription>Your recently created or modified workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkflowList />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Execution Metrics</CardTitle>
            <CardDescription>Workflow execution success rate</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <MetricsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
