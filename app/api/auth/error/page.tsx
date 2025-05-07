"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bot } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorMessage = "An error occurred during authentication."
  let errorDescription = "Please try again or contact support if the problem persists."

  // Handle specific error types
  if (error === "Configuration") {
    errorMessage = "Server configuration error"
    errorDescription = "There is a problem with the server configuration. Please contact support."
  } else if (error === "AccessDenied") {
    errorMessage = "Access denied"
    errorDescription = "You do not have permission to sign in."
  } else if (error === "Verification") {
    errorMessage = "Verification error"
    errorDescription = "The verification link may have expired or already been used."
  } else if (error === "CredentialsSignin") {
    errorMessage = "Invalid credentials"
    errorDescription = "The email or password you entered is incorrect."
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">{errorDescription}</p>
          <div className="flex justify-center space-x-4">
            <Link href="/login">
              <Button>Return to Login</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Go to Homepage</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
