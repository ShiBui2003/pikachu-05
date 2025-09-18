import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables:", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey,
    })
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Redirect unauthenticated users to login for protected routes
    if (
      !user &&
      (request.nextUrl.pathname.startsWith("/citizen/dashboard") ||
        request.nextUrl.pathname.startsWith("/citizen/report") ||
        request.nextUrl.pathname.startsWith("/citizen/my-issues") ||
        request.nextUrl.pathname.startsWith("/citizen/notifications") ||
        request.nextUrl.pathname.startsWith("/citizen/leaderboard") ||
        request.nextUrl.pathname.startsWith("/citizen/issues") ||
        request.nextUrl.pathname.startsWith("/admin/dashboard") ||
        request.nextUrl.pathname.startsWith("/admin/issues") ||
        request.nextUrl.pathname.startsWith("/admin/notifications") ||
        request.nextUrl.pathname.startsWith("/admin/reports") ||
        request.nextUrl.pathname.startsWith("/admin/users"))
    ) {
      const url = request.nextUrl.clone()
      url.pathname = "/citizen/login"
      return NextResponse.redirect(url)
    }
  } catch (error) {
    console.error("Error in middleware:", error)
  }

  return supabaseResponse
}
