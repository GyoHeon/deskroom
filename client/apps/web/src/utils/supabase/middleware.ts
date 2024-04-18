import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const supabaseProjectID = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0]

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session }, error } = await supabase.auth.getSession()
  if (!session) {
    response.cookies.delete(`sb-${supabaseProjectID}-access-token`)
    response.cookies.delete(`sb-${supabaseProjectID}-refresh-token`)

    return NextResponse.redirect(new URL("/v1/login", request.url))
  }
  if (error) {
    console.error('error', error)
    return response
  }
  if (session) {
    response.cookies.set({
      name: `sb-${supabaseProjectID}-access-token`,
      value: session.access_token,
      maxAge: session.expires_in,
      path: '/',
    })
    response.cookies.set({
      name: `sb-${supabaseProjectID}-refresh-token`,
      value: session.refresh_token,
      maxAge: session.expires_in,
      path: '/',
    })

  }

  return response
}
