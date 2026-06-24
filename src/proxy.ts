import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isSessionValid(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  return !isNaN(Number(cookieValue)) || cookieValue.length === 36;
}

export function proxy(request: NextRequest) {
  const access = request.cookies.get("solace-access");
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!isSessionValid(access?.value)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
