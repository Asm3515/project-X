"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApi } from "@/hooks/use-api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

export function MetricsChart() {
  const { fetchData, isLoading, error } = useApi()
  const [metrics, setMetrics] = useState<any[]>([])

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchData("/api/executions/metrics")

        // Transform the data for the chart
        const formattedData = data.map((item: any) => ({
          date: `${item._id.month}/${item._id.day}`,
          total: item.count,
          success: item.successCount,
          failure: item.failureCount,
          avgDuration: Math.round(item.avgDuration / 1000), // Convert to seconds
          tokens: item.totalTokens,
        }))

        setMetrics(formattedData)
      } catch (error) {
        console.error("Failed to load metrics:", error)
      }
    }

    loadMetrics()
  }, [fetchData])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Execution Metrics</CardTitle>
          <CardDescription>Workflow execution metrics over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Execution Metrics</CardTitle>
          <CardDescription>Workflow execution metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-80 items-center justify-center">
            <p className="text-muted-foreground">Failed to load metrics data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution Metrics</CardTitle>
        <CardDescription>Workflow execution metrics over time</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={metrics}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="success" stackId="a" fill="#10b981" name="Successful" />
            <Bar dataKey="failure" stackId="a" fill="#ef4444" name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
