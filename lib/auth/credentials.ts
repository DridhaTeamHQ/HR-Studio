import "server-only"
import { scrypt, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"

const scryptAsync = promisify(scrypt) as (password: string, salt: string, keylen: number) => Promise<Buffer>

/** Checks the login against AUTH_EMAIL / AUTH_PASSWORD_HASH from the environment. */
export async function verifyCredentials(email: string, password: string) {
  const expectedEmail = process.env.AUTH_EMAIL
  const stored = process.env.AUTH_PASSWORD_HASH
  if (!expectedEmail || !stored) throw new Error("AUTH_EMAIL / AUTH_PASSWORD_HASH are not set (see .env.example)")

  const [scheme, salt, hashHex] = stored.split(":")
  if (scheme !== "scrypt" || !salt || !hashHex) throw new Error("AUTH_PASSWORD_HASH has an unexpected format")

  const expected = Buffer.from(hashHex, "hex")
  // Always hash, even for a wrong email, so response time doesn't reveal which part was wrong.
  const actual = await scryptAsync(password, salt, expected.length)
  const passwordOk = timingSafeEqual(actual, expected)
  const emailOk = email.trim().toLowerCase() === expectedEmail.trim().toLowerCase()
  return emailOk && passwordOk
}
