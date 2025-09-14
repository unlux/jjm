import * as React from "react"

export type ContactNotificationProps = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

// Simple, robust template using inline styles to ensure mail client compatibility
export const ContactNotification: React.FC<ContactNotificationProps> = ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  const row = (label: string, value?: React.ReactNode) => (
    <tr>
      <td style={{ padding: "8px", fontWeight: 600, width: 120 }}>{label}</td>
      <td style={{ padding: "8px" }}>{value}</td>
    </tr>
  )

  const safe = (v?: string) => String(v ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        padding: 24,
        color: "#111827",
      }}
    >
      <h2 style={{ margin: "0 0 12px" }}>New Contact Form Submission</h2>
      <p style={{ margin: "0 0 20px", color: "#374151" }}>
        You have received a new message from The Joy Junction website contact form.
      </p>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          {row("Name", safe(name))}
          {row(
            "Email",
            <a href={`mailto:${safe(email)}`} style={{ color: "#2563EB", textDecoration: "underline" }}>
              {safe(email)}
            </a>
          )}
          {phone ? row("Phone", safe(phone)) : null}
          {subject ? row("Subject", safe(subject)) : null}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Message</div>
        <div
          style={{
            whiteSpace: "pre-wrap",
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: 12,
          }}
          dangerouslySetInnerHTML={{ __html: safe(message) }}
        />
      </div>
    </div>
  )
}

export default ContactNotification
