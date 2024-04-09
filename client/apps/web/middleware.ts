import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

const authCheckWhitelist = [
  '/v1/login',
  '/v1/signup',
  '/v1/reset-password',
  '/v1/reset-password/new',
]


export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareClient<Database>({ req, res })
  const { data: session } = await supabase.auth.getSession()

  if (authCheckWhitelist.includes(req.nextUrl.pathname)) {
    return res
  }

  if (!session) {
    return NextResponse.redirect('/v1/login')
  }


  return res
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
