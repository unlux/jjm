import { NextResponse } from "next/server"
import { Resend } from "resend"
// We render HTML strings directly to avoid extra server deps

const RESEND_API_KEY = process.env.RESEND_API_KEY
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "noreply@thejoyjunction.app"

// Simple in-memory rate limiter: 5 requests per 10 minutes per IP
type Bucket = { count: number; resetAt: number }

const safe = (v?: string) =>
  String(v ?? "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

function buildNotificationHtml(data: {
  email: string
  phone: string
  age: string
  gender: string
  trait: string[]
  skills: string[]
  happy: string
  interests: string
  struggles: string[]
  extra: string
}) {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; padding: 24px; color: #111827;">
    <h2 style="margin: 0 0 12px;">New Custom Kit Request</h2>
    <p style="margin: 0 0 16px; color: #374151;">A user has submitted the custom kit questionnaire.</p>
    <table style="border-collapse: collapse; width: 100%;">
      <tbody>
        <tr><td style="padding:8px; font-weight:600; width:160px;">Email</td><td style="padding:8px;"><a href="mailto:${safe(
          data.email
        )}">${safe(data.email)}</a></td></tr>
        <tr><td style="padding:8px; font-weight:600;">Phone</td><td style="padding:8px;">${safe(
          data.phone
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Age</td><td style="padding:8px;">${safe(
          data.age
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Gender</td><td style="padding:8px;">${safe(
          data.gender
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Traits</td><td style="padding:8px;">${safe(
          (data.trait || []).join(", ")
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Skills</td><td style="padding:8px;">${safe(
          (data.skills || []).join(", ")
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Happy</td><td style="padding:8px;">${safe(
          data.happy
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Interests</td><td style="padding:8px;">${safe(
          data.interests
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Struggles</td><td style="padding:8px;">${safe(
          (data.struggles || []).join(", ")
        )}</td></tr>
      </tbody>
    </table>
    ${
      data.extra?.trim()
        ? `<div style="margin-top:20px;"><div style="font-weight:600; margin-bottom:8px;">Additional Notes</div><div style="white-space: pre-wrap; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px;">${safe(
            data.extra
          )}</div></div>`
        : ""
    }
  </div>`
}

function buildConfirmationHtml(data: {
  email: string
  phone: string
  age: string
  gender: string
  trait: string[]
  skills: string[]
  happy: string
  interests: string
  struggles: string[]
  extra: string
}) {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; padding: 24px; color: #111827;">
    <h2 style="margin: 0 0 12px;">We received your custom kit request!</h2>
    <p style="margin: 0; color: #374151;">Thanks for filling out the questionnaire. Our team at The Joy Junction will review your responses and reach out shortly.</p>
    <div style="margin-top: 20px;">
      <div style="font-weight: 600; margin-bottom: 8px;">Summary of your responses</div>
      <table style="border-collapse: collapse; width: 100%;"><tbody>
        <tr><td style="padding:8px; font-weight:600; width:160px;">Email</td><td style="padding:8px;">${safe(
          data.email
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Phone</td><td style="padding:8px;">${safe(
          data.phone
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Age</td><td style="padding:8px;">${safe(
          data.age
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Gender</td><td style="padding:8px;">${safe(
          data.gender
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Traits</td><td style="padding:8px;">${safe(
          (data.trait || []).join(", ")
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Skills</td><td style="padding:8px;">${safe(
          (data.skills || []).join(", ")
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">What makes your kiddo happy</td><td style="padding:8px;">${safe(
          data.happy
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Interests</td><td style="padding:8px;">${safe(
          data.interests
        )}</td></tr>
        <tr><td style="padding:8px; font-weight:600;">Struggles</td><td style="padding:8px;">${safe(
          (data.struggles || []).join(", ")
        )}</td></tr>
      </tbody></table>
    </div>
    ${
      data.extra?.trim()
        ? `<div style="margin-top:20px;"><div style="font-weight:600; margin-bottom:8px;">Additional Notes</div><div style="white-space: pre-wrap; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px;">${safe(
            data.extra
          )}</div></div>`
        : ""
    }
    <p style="margin-top: 20px; color: #6B7280; font-size: 12px;">If you didn’t submit this, you can ignore this email.</p>
  </div>`
}
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

export async function POST(req: Request) {
  try {
    // Rate limit
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

    const body = await req.json()
    const {
      email,
      phone,
      age,
      gender,
      trait = [],
      skills = [],
      happy = "",
      interests = "",
      struggles = [],
      extra = "",
    } = body || {}

    const errors: string[] = []
    if (!email || typeof email !== "string" || !/.+@.+\..+/.test(email))
      errors.push("valid email is required")
    if (!phone || typeof phone !== "string" || !/^\d{10}$/.test(phone))
      errors.push("valid 10-digit phone is required")
    if (!age) errors.push("age is required")
    if (!gender) errors.push("gender is required")

    if (errors.length) {
      return NextResponse.json(
        { error: "validation_error", details: errors },
        { status: 400 }
      )
    }

    const resend = new Resend(RESEND_API_KEY)

    const html = buildNotificationHtml({
      email,
      phone,
      age: String(age ?? ""),
      gender: String(gender ?? ""),
      trait: Array.isArray(trait) ? trait : [],
      skills: Array.isArray(skills) ? skills : [],
      happy: String(happy ?? ""),
      interests: String(interests ?? ""),
      struggles: Array.isArray(struggles) ? struggles : [],
      extra: String(extra ?? ""),
    })

    const subject = `[Custom Kit] Request from ${email}${
      age ? ` (Age ${age})` : ""
    }`

    const { error } = await resend.emails.send({
      to: CONTACT_TO_EMAIL,
      from: CONTACT_FROM_EMAIL,
      subject,
      html,
      reply_to: email,
    } as any)

    if (error) {
      throw new Error(error.message || "resend_error")
    }

    // Send confirmation to the submitter
    const confirmationHtml = buildConfirmationHtml({
      email,
      phone,
      age: String(age ?? ""),
      gender: String(gender ?? ""),
      trait: Array.isArray(trait) ? trait : [],
      skills: Array.isArray(skills) ? skills : [],
      happy: String(happy ?? ""),
      interests: String(interests ?? ""),
      struggles: Array.isArray(struggles) ? struggles : [],
      extra: String(extra ?? ""),
    })

    await resend.emails.send({
      to: email,
      from: CONTACT_FROM_EMAIL,
      subject: "We received your custom kit request — The Joy Junction",
      html: confirmationHtml,
      reply_to: CONTACT_TO_EMAIL!,
    } as any)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: "email_failed", details: [e?.message || "unknown_error"] },
      { status: 500 }
    )
  }
}
