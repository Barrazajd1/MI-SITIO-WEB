import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

const VALID_LOCALES = new Set(['en', 'es', 'fr', 'pt', 'it', 'de', 'id'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()

  const segment = req.nextUrl.pathname.split('/')[1] ?? ''
  const res = NextResponse.next()

  if (VALID_LOCALES.has(segment)) {
    // On a localized page — update the cookie and set the header
    res.cookies.set('preferred-locale', segment, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    res.headers.set('x-locale', segment)
  } else {
    // On /sign-in, /sign-up, /dashboard etc. — read saved locale from cookie
    const saved = req.cookies.get('preferred-locale')?.value ?? 'en'
    const locale = VALID_LOCALES.has(saved) ? saved : 'en'
    res.headers.set('x-locale', locale)
  }

  return res
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
