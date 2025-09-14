import * as React from "react"

export type ContactConfirmationProps = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

const safe = (v?: string) => String(v ?? "")

export const ContactConfirmation: React.FC<ContactConfirmationProps> = ({
  name,
  message,
}) => {
  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        padding: 24,
        color: "#111827",
      }}
    >
      <h2 style={{ margin: "0 0 12px" }}>Thanks for reaching out{safe(name) ? `, ${safe(name)}` : ""}!</h2>
      <p style={{ margin: 0, color: "#374151" }}>
        We’ve received your message and our team at The Joy Junction will get back to you as soon as possible.
      </p>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Your message</div>
        <div
          style={{
            whiteSpace: "pre-wrap",
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: 12,
          }}
        >
          {safe(message)}
        </div>
      </div>

      <p style={{ marginTop: 20, color: "#6B7280", fontSize: 12 }}>
        If you didn’t submit this, you can ignore this email.
      </p>
    </div>
  )
}

export default ContactConfirmation
