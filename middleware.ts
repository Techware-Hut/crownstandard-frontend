import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    const { pathname } = request.nextUrl;

    const authRoutes = ["/login", "/register"];

    const protectedRoutes = [
        "/dashboard",
        "/provider/dashboard",
        "/profile",
        "/bookings",
    ];

    const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/register",
        "/dashboard/:path*",
        "/provider/dashboard/:path*",
        "/profile/:path*",
        "/bookings/:path*",
    ],
};