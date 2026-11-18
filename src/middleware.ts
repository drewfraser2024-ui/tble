import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const LAUNCH_PASSWORD = process.env.LAUNCH_PASSWORD || 'tableit2026';
// Gate is OFF by default (site is public). Set LAUNCH_GATE=on to re-enable the password screen.
const IS_GATED = process.env.LAUNCH_GATE === 'on';

export async function middleware(request: NextRequest) {
  // Launch gate: restrict access until ready to launch
  if (IS_GATED) {
    const hasAccess = request.cookies.get('launch_access')?.value === 'granted';
    const isGatePage = request.nextUrl.pathname === '/gate';

    const isGateApi = request.nextUrl.pathname === '/api/gate';

    if (!hasAccess && !isGatePage && !isGateApi) {
      return NextResponse.redirect(new URL('/gate', request.url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
