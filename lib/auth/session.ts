import "server-only"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

export const SESSION_COOKIE = "hr_session"
const SESSION_DAYS = 7

type SessionPayload = { sub: string }

function key() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error("SESSION_SECRET is not set (see .env.example)")
  return new TextEncoder().encode(secret)
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(key())
}

/** Returns the session payload, or null if the token is missing, tampered with or expired. */
export async function decrypt(token: string | undefined) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, key(), { algorithms: ["HS256"] })
    return payload
  } catch {
    return null
  }
}

export async function createSession(email: string) {
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  const token = await encrypt({ sub: email })
  ;(await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  })
}

export async function deleteSession() {
  ;(await cookies()).delete(SESSION_COOKIE)
}

export async function getSession() {
  return decrypt((await cookies()).get(SESSION_COOKIE)?.value)
}
