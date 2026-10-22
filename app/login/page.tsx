import type { Metadata } from "next"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Sign in · HR Letter Studio",
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/letter/logo.png" alt="Dridha Technologies" className="h-14 w-auto" />
          <h1 className="text-lg font-semibold">HR Letter Studio</h1>
          <p className="text-sm text-muted-foreground">Sign in to prepare offer and relieving letters</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
