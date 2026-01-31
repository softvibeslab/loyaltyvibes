import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Route configuration
const PUBLIC_ROUTES = ['/', '/login', '/register'];
const AUTH_ROUTES = ['/login', '/register'];

const ROLE_ROUTES: Record<string, string[]> = {
  admin: ['/dashboard', '/scanner', '/wallet', '/profile'],
  staff: ['/scanner', '/wallet', '/profile'],
  customer: ['/wallet', '/profile'],
};

const ROLE_REDIRECTS: Record<string, string> = {
  admin: '/dashboard',
  staff: '/scanner',
  customer: '/wallet',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create response to modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Public routes - allow all
  if (PUBLIC_ROUTES.includes(pathname)) {
    // Redirect authenticated users away from auth pages
    if (session && AUTH_ROUTES.includes(pathname)) {
      // Get user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const role = profile?.role || 'customer';
      const redirectPath = ROLE_REDIRECTS[role] || '/wallet';

      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return response;
  }

  // Protected routes - require authentication
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Get user profile for role check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const userRole = profile?.role || 'customer';

  // Check role-based access
  const allowedRoutes = ROLE_ROUTES[userRole] || [];
  const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!isAllowed) {
    // Redirect to appropriate home page for role
    const homePath = ROLE_REDIRECTS[userRole] || '/wallet';
    return NextResponse.redirect(new URL(homePath, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
