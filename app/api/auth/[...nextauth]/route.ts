import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Check if NEXTAUTH_URL is set
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`
  console.log(`NEXTAUTH_URL set to ${process.env.NEXTAUTH_URL}`)
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
