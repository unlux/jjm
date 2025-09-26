import { NextResponse } from "next/server"
import { Resend } from "resend"

import {
  renderContactConfirmationEmailHtml,
  renderContactEmailHtml,
} from "@/lib/email/contact"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "noreply@thejoyjunction.app"

const validateEmail = (email: string) => /.+@.+\..+/.test(email)

export async function POST(req: Request) {
  try {
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
    const { name, email, phone, subject, message, agreementChecked } =
      body || {}

    const errors: string[] = []
    if (!name || typeof name !== "string") errors.push("name is required")
    if (!email || typeof email !== "string" || !validateEmail(email))
      errors.push("valid email is required")
    if (!message || typeof message !== "string")
      errors.push("message is required")
    if (agreementChecked !== true) errors.push("agreement must be accepted")

    if (errors.length) {
      return NextResponse.json(
        { error: "validation_error", details: errors },
        { status: 400 }
      )
    }

    const resend = new Resend(RESEND_API_KEY)
    const html = renderContactEmailHtml({
      name,
      email,
      phone,
      subject,
      message,
    })

    // 1) Send notification to site owner
    const { error } = await resend.emails.send({
      to: CONTACT_TO_EMAIL,
      from: CONTACT_FROM_EMAIL,
      subject: subject?.trim()
        ? `[Contact] ${subject}`
        : `[Contact] New message from ${name}`,
      html,
      reply_to: email,
    } as any)

    if (error) {
      throw new Error(error.message || "resend_error")
    }

    // 2) Send confirmation to the submitter
    const confirmationHtml = renderContactConfirmationEmailHtml({
      name,
      email,
      phone,
      subject,
      message,
    })
    const { error: confirmError } = await resend.emails.send({
      to: email,
      from: CONTACT_FROM_EMAIL,
      subject: "We received your message — The Joy Junction",
      html: confirmationHtml,
      reply_to: CONTACT_TO_EMAIL,
    } as any)

    if (confirmError) {
      // Do not fail the entire request if confirmation fails; log-like response for debugging
      return NextResponse.json({ ok: true, warn: "confirmation_failed" })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: "email_failed", details: [e?.message || "unknown_error"] },
      { status: 500 }
    )
  }
}
