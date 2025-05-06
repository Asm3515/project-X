import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ExecutionList } from "@/components/execution-list"

export default function ExecutionsPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executions</h1>
          <p className="text-muted-foreground">View and monitor your workflow executions</p>
        </div>
        <Button variant="outline" className="gap-1">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search executions..." className="w-full pl-8" />
        </div>
        <Button variant="outline">Date Range</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
          <CardDescription>A list of all your recent workflow executions</CardDescription>
        </CardHeader>
        <CardContent>
          <ExecutionList />
        </CardContent>
      </Card>
    </div>
  )
}
