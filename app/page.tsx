import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Braces, Database, GitBranch, Layers, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AutoAgentX</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#use-cases" className="text-sm font-medium hover:underline underline-offset-4">
              Use Cases
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Build Autonomous AI Agents Visually
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Design, configure, and deploy AI agents that can perform complex tasks with our drag-and-drop
                    workflow builder.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#demo">
                    <Button size="lg" variant="outline">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative aspect-video overflow-hidden rounded-xl border bg-background shadow-xl">
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  alt="AutoAgentX Dashboard Preview"
                  width={1280}
                  height={720}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to build and deploy autonomous AI agents
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <GitBranch className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Visual Workflow Builder</h3>
                <p className="text-center text-muted-foreground">
                  Drag-and-drop interface to design complex agent workflows without code
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">LLM-Powered Agents</h3>
                <p className="text-center text-muted-foreground">
                  Autonomous agents with memory, reasoning, and tool-using capabilities
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Context-Aware Reasoning</h3>
                <p className="text-center text-muted-foreground">
                  RAG integration with vector databases for knowledge-enhanced agents
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Multi-Agent Collaboration</h3>
                <p className="text-center text-muted-foreground">
                  Create teams of specialized agents that work together on complex tasks
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Braces className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Custom Tool Integration</h3>
                <p className="text-center text-muted-foreground">
                  Connect your agents to APIs, databases, and external services
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Real-Time Monitoring</h3>
                <p className="text-center text-muted-foreground">
                  Observe agent execution with detailed logs and performance metrics
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="use-cases" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Example Use Cases</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover what you can build with AutoAgentX
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 mt-8">
              <div className="rounded-lg border bg-background p-6">
                <h3 className="text-xl font-bold mb-2">🔍 Automated Research Reports</h3>
                <p className="text-muted-foreground mb-4">
                  Create agents that gather information from multiple sources, analyze data, and generate comprehensive
                  research reports.
                </p>
                <Link href="/templates/research">
                  <Button variant="outline" className="w-full">
                    View Template
                  </Button>
                </Link>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <h3 className="text-xl font-bold mb-2">🤖 Customer Support Agent</h3>
                <p className="text-muted-foreground mb-4">
                  Build a RAG-powered support agent that answers customer queries using your knowledge base and can
                  escalate when needed.
                </p>
                <Link href="/templates/support">
                  <Button variant="outline" className="w-full">
                    View Template
                  </Button>
                </Link>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <h3 className="text-xl font-bold mb-2">🧑‍💼 LinkedIn Lead Generation</h3>
                <p className="text-muted-foreground mb-4">
                  Deploy agents that identify potential leads, craft personalized outreach messages, and manage
                  follow-ups.
                </p>
                <Link href="/templates/lead-gen">
                  <Button variant="outline" className="w-full">
                    View Template
                  </Button>
                </Link>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <h3 className="text-xl font-bold mb-2">📊 Data Cleaning Pipeline</h3>
                <p className="text-muted-foreground mb-4">
                  Create LLM-driven workflows that clean, normalize, and enrich data sets with minimal human
                  intervention.
                </p>
                <Link href="/templates/data-cleaning">
                  <Button variant="outline" className="w-full">
                    View Template
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">© 2024 AutoAgentX. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
