"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Save, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const { fetchData, isLoading } = useApi()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [showOpenAI, setShowOpenAI] = useState(false)
  const [showAnthropic, setShowAnthropic] = useState(false)
  const [showPinecone, setShowPinecone] = useState(false)

  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    pinecone: "",
  })

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const userData = await fetchData("/api/user/settings")

        setName(userData.name || "")
        setEmail(userData.email || "")

        // We don't get the actual API keys for security reasons
        // Just set placeholders if they exist
        if (userData.hasApiKeys) {
          setApiKeys({
            openai: "sk-••••••••••••••••••••••••••••••••",
            anthropic: "sk-ant-••••••••••••••••••••••••••••••••",
            pinecone: "••••••••••••••••••••••••••••••••",
          })
        }
      } catch (error) {
        console.error("Failed to load user settings:", error)
        toast({
          title: "Error",
          description: "Failed to load user settings",
          variant: "destructive",
        })
      }
    }

    if (session?.user) {
      loadUserSettings()
    }
  }, [fetchData, session, toast])

  const handleSaveProfile = async () => {
    try {
      await fetchData("/api/user/settings", {
        method: "PUT",
        body: { name },
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleSaveApiKeys = async () => {
    try {
      // Only send API keys that have been changed (not placeholders)
      const keysToUpdate: Record<string, string> = {}

      if (!apiKeys.openai.includes("••••")) {
        keysToUpdate.openai = apiKeys.openai
      }

      if (!apiKeys.anthropic.includes("••••")) {
        keysToUpdate.anthropic = apiKeys.anthropic
      }

      if (!apiKeys.pinecone.includes("••••")) {
        keysToUpdate.pinecone = apiKeys.pinecone
      }

      await fetchData("/api/user/api-keys", {
        method: "PUT",
        body: keysToUpdate,
      })

      toast({
        title: "API keys updated",
        description: "Your API keys have been updated successfully",
      })

      // Replace with placeholders
      setApiKeys({
        openai: apiKeys.openai ? "sk-••••••••••••••••••••••••••••••••" : "",
        anthropic: apiKeys.anthropic ? "sk-ant-••••••••••••••••••••••••••••••••" : "",
        pinecone: apiKeys.pinecone ? "••••••••••••••••••••••••••••••••" : "",
      })
    } catch (error) {
      console.error("Failed to update API keys:", error)
      toast({
        title: "Error",
        description: "Failed to update API keys",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application settings</p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your account and application preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} disabled />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Application Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for workflow executions
                      </p>
                    </div>
                    <Switch id="notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="theme">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
                    </div>
                    <Switch id="theme" />
                  </div>
                </div>
              </div>
              <Button className="gap-1" onClick={handleSaveProfile} disabled={isLoading}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">LLM Providers</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai">OpenAI API Key</Label>
                    <div className="flex">
                      <Input
                        id="openai"
                        type={showOpenAI ? "text" : "password"}
                        value={apiKeys.openai}
                        onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                        className="rounded-r-none"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-l-none"
                        onClick={() => setShowOpenAI(!showOpenAI)}
                      >
                        {showOpenAI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Required for OpenAI models (gpt-3.5-turbo, gpt-4, gpt-4o)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anthropic">Anthropic API Key</Label>
                    <div className="flex">
                      <Input
                        id="anthropic"
                        type={showAnthropic ? "text" : "password"}
                        value={apiKeys.anthropic}
                        onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                        className="rounded-r-none"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-l-none"
                        onClick={() => setShowAnthropic(!showAnthropic)}
                      >
                        {showAnthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Required for Anthropic models (claude-3-opus, claude-3-sonnet)
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vector Databases</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pinecone">Pinecone API Key</Label>
                    <div className="flex">
                      <Input
                        id="pinecone"
                        type={showPinecone ? "text" : "password"}
                        value={apiKeys.pinecone}
                        onChange={(e) => setApiKeys({ ...apiKeys, pinecone: e.target.value })}
                        className="rounded-r-none"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-l-none"
                        onClick={() => setShowPinecone(!showPinecone)}
                      >
                        {showPinecone ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Required for RAG agents and knowledge retrieval</p>
                  </div>
                </div>
              </div>
              <Button className="gap-1" onClick={handleSaveApiKeys} disabled={isLoading}>
                <Save className="h-4 w-4" /> Save API Keys
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Settings</CardTitle>
              <CardDescription>Manage your team members and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Team Members</h3>
                  <Button variant="outline" size="sm">
                    Invite
                  </Button>
                </div>
                <div className="space-y-4">
                  {[{ name: session?.user?.name || "You", email: session?.user?.email, role: "Admin" }].map(
                    (member, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">{member.role}</span>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
