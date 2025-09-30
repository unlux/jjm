"use client"

import { useState } from "react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [agree, setAgree] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!agree) {
      setError("Please agree to the Privacy Policy.")
      return
    }

    setSubmitting(true)
    try {
      const resp = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!resp.ok) {
        const data = await resp.json().catch(() => null)
        throw new Error(
          data?.details?.[0] ||
            data?.error ||
            "Unable to subscribe. Please try again."
        )
      }
      setSuccess("Thanks! You’re on the list.")
      setEmail("")
      setAgree(false)
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-900/30 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-green-500/30 bg-green-900/20 px-3 py-2 text-sm text-green-200">
          {success}
        </div>
      )}
      <div className="relative">
        <div className="absolute left-0 top-[50%] -translate-y-1/2 transform text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <input
          type="email"
          placeholder="Enter Your Email Address"
          className="w-full border-b border-gray-400 bg-transparent py-2 pl-7 pr-10 text-white placeholder-gray-400 transition-colors focus:border-white focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={submitting}
          className="absolute right-0 top-[50%] flex h-8 w-8 -translate-y-1/2 transform items-center justify-center text-white disabled:opacity-60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>

      <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-300">
        <div className="relative mt-1 flex items-center">
          <input
            type="checkbox"
            id="privacy-checkbox"
            className="peer h-4 w-4 appearance-none rounded-sm border border-gray-400 bg-transparent transition-colors checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <svg
            className="pointer-events-none absolute left-0.5 top-0.5 h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <span>
          I agree to the{" "}
          <a
            href="/privacy-policy"
            className="text-white underline transition hover:text-blue-300"
          >
            Privacy Policy
          </a>
        </span>
      </label>
    </form>
  )
}
