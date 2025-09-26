import { NextResponse } from "next/server"
import { Resend } from "resend"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "noreply@thejoyjunction.app"

// Simple in-memory rate limiter: 5 req / 10 min / IP
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()
const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 5

function getClientIp(req: Request) {
  const h = req.headers
  const fwd = h.get("x-forwarded-for") || ""
  const ip = fwd.split(",")[0].trim() || h.get("x-real-ip") || "unknown"
  return ip
}

function rateLimit(req: Request) {
  const ip = getClientIp(req)
  const now = Date.now()
  const b = buckets.get(ip)
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true, remaining: LIMIT - 1, resetAt: now + WINDOW_MS }
  }
  if (b.count >= LIMIT) {
    return { ok: false, remaining: 0, resetAt: b.resetAt }
  }
  b.count += 1
  return { ok: true, remaining: LIMIT - b.count, resetAt: b.resetAt }
}

const safe = (v?: string) =>
  String(v ?? "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

export async function POST(req: Request) {
  try {
    const rl = rateLimit(req)
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: "rate_limited",
          details: ["Too many requests. Please try again later."],
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (rl.resetAt - Date.now()) / 1000
            ).toString(),
          },
        }
      )
    }

    if (!RESEND_API_KEY) {
      return NextResponse.json(
        {
          error: "server_misconfigured",
          details: ["RESEND_API_KEY is not set"],
        },
        { status: 500 }
      )
    }
    if (!CONTACT_TO_EMAIL) {
      return NextResponse.json(
        {
          error: "server_misconfigured",
          details: ["CONTACT_TO_EMAIL is not set"],
        },
        { status: 500 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const { email } = body || {}

    if (!email || typeof email !== "string" || !/.+@.+\..+/.test(email)) {
      return NextResponse.json(
        { error: "validation_error", details: ["valid email is required"] },
        { status: 400 }
      )
    }

    const resend = new Resend(RESEND_API_KEY)

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; padding: 24px; color: #111827;">
        <h2 style="margin: 0 0 12px;">New Newsletter Subscription</h2>
        <p style="margin: 0 0 16px; color: #374151;">A new user subscribed to your newsletter.</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tbody>
            <tr>
              <td style="padding: 8px; font-weight: 600; width: 160px;">Email</td>
              <td style="padding: 8px;"><a href="mailto:${safe(email)}">${safe(
                email
              )}</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    `

    const { error } = await resend.emails.send({
      to: CONTACT_TO_EMAIL,
      from: CONTACT_FROM_EMAIL,
      subject: `New newsletter subscription: ${email}`,
      html,
      reply_to: email,
    } as any)

    if (error) {
      throw new Error(error.message || "resend_error")
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: "email_failed", details: [e?.message || "unknown_error"] },
      { status: 500 }
    )
  }
}
