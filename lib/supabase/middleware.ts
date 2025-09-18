import { NextResponse, type NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
    '/',
    '/admin/login',
    '/citizen/login',
    '/auth/callback',
];

export async function updateSession(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Allow public routes to pass through
    if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        return NextResponse.next();
    }

    // Get the session from cookies
    const accessToken = request.cookies.get("sb-access-token")?.value;
    
    // If no access token and trying to access protected routes, redirect to login
    if (!accessToken) {
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        if (pathname.startsWith("/citizen")) {
            return NextResponse.redirect(new URL("/citizen/login", request.url));
        }
        return NextResponse.next();
    }

    try {
        // Validate session using Supabase
        const { createClient } = await import("./server");
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser(accessToken);
        
        // If session is invalid, clear cookies and redirect to login
        if (error || !data?.user) {
            const response = NextResponse.redirect(
                new URL(pathname.startsWith('/admin') ? '/admin/login' : '/citizen/login', request.url)
            );
            response.cookies.delete('sb-access-token');
            response.cookies.delete('sb-refresh-token');
            return response;
        }

        const user = data.user;
        const role = user.user_metadata?.role || user.role;

        // Handle role-based access control
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/citizen/dashboard', request.url));
        }

        if (pathname.startsWith('/citizen') && role === 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Error in middleware:', error);
        // On error, clear session and redirect to login
        const response = NextResponse.redirect(
            new URL(pathname.startsWith('/admin') ? '/admin/login' : '/citizen/login', request.url)
        );
        response.cookies.delete('sb-access-token');
        response.cookies.delete('sb-refresh-token');
        return response;
    }
    // All good, continue
    return NextResponse.next();
}
