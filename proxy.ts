import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, decrypt } from "@/lib/auth/session"

const PUBLIC_PATHS = ["/login"]

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC_PATHS.includes(pathname)
  const session = await decrypt(req.cookies.get(SESSION_COOKIE)?.value)

  if (!isPublic && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }
  if (isPublic && session) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }
  return NextResponse.next()
}

export const config = {
  // Everything except Next internals and static files (logo, signature, favicon…).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|csv)$).*)"],
}
