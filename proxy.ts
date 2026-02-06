import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export default async function middleware(request: NextRequest): Promise<NextResponse> {
    const path = request.nextUrl.pathname;

    const token = request.cookies.get('session')?.value;

    const protectedPaths = ['/sell', '/settings', '/profile', '/products/'];
    const authPaths = ['/login', '/signup'];
    const publicPaths = ['/'];

    const isProtectedRoute = protectedPaths.some((route) => path.startsWith(route));
    const isAuthRoute = authPaths.some((route) => path.startsWith(route));
    const isPublicRoute = publicPaths.some((route) => path === route);

    if (isPublicRoute) {
        return NextResponse.next();
    }

    // There is no token
    if (!token) {
        if (isProtectedRoute) {
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }
        return NextResponse.next();
    }

    const payload = await verifyToken(token);

    // Payload invalid
    if (!payload) {
        const response = NextResponse.redirect(new URL('/login', request.nextUrl));
        response.cookies.delete('session');
        return response;
    }

    // Redirect authenticated users away from auth pages
    const isAuthenticated = true;

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
