import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware runs on both the client and server
// It doesn't use any MongoDB code, but ensures proper routing
export function middleware(request: NextRequest) {
  // You can add authentication checks or other middleware logic here
  return NextResponse.next()
}

// Specify paths that don't need to run the middleware
export const config = {
  matcher: [
    // Skip all static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
