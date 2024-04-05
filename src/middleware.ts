import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname is already localized or is an API route
  if (pathname.startsWith("/en") || pathname.includes("/api/")) {
    return NextResponse.next();
  }
  // Target URL with language prefix
  const urlWithLang = request.nextUrl.clone();
  urlWithLang.pathname = `/en${pathname}`;

  return NextResponse.redirect(urlWithLang);
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }