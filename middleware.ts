import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || 
                       req.nextUrl.pathname.startsWith("/register")
    const isDashboardPage = req.nextUrl.pathname.startsWith("/play")

    // If user is authenticated and trying to access auth pages (login/register)
    // Redirect them to the dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/play", req.url))
    }

    // If user is not authenticated and trying to access dashboard pages
    // Redirect them to login
    if (isDashboardPage && !isAuth) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // We handle authorization in the middleware function above
    },
  }
)

export const config = {
  matcher: [
    "/login",
    "/register",
    "/play/:path*",
  ],
}
