import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { WorkflowList } from "@/components/workflow-list"
import { Input } from "@/components/ui/input"

export default function WorkflowsPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">Create and manage your AI agent workflows</p>
        </div>
        <Link href="/dashboard/workflows/new">
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> New Workflow
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search workflows..." className="w-full pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Workflows</CardTitle>
          <CardDescription>A list of all your AI agent workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkflowList extended />
        </CardContent>
      </Card>
    </div>
  )
}
