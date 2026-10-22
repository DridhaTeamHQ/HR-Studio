"use server"

import { redirect } from "next/navigation"
import { verifyCredentials } from "@/lib/auth/credentials"
import { createSession, deleteSession } from "@/lib/auth/session"

export type LoginState = { error?: string; email?: string } | undefined

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) return { error: "Enter your email and password.", email }
  if (!(await verifyCredentials(email, password))) {
    return { error: "Incorrect email or password.", email }
  }

  await createSession(email.toLowerCase())
  redirect("/")
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
