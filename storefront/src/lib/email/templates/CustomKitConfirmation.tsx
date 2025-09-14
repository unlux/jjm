import * as React from "react"

export type CustomKitConfirmationProps = {
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
}

const safe = (v?: string) => String(v ?? "")

export default function CustomKitConfirmation(props: CustomKitConfirmationProps) {
  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        padding: 24,
        color: "#111827",
      }}
    >
      <h2 style={{ margin: "0 0 12px" }}>We received your custom kit request!</h2>
      <p style={{ margin: 0, color: "#374151" }}>
        Thanks for filling out the questionnaire. Our team at The Joy Junction will review your
        responses and reach out shortly.
      </p>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Summary of your responses</div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ padding: 8, fontWeight: 600, width: 160 }}>Email</td>
              <td style={{ padding: 8 }}>{safe(props.email)}</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 600 }}>Phone</td>
              <td style={{ padding: 8 }}>{safe(props.phone)}</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 600 }}>Age</td>
              <td style={{ padding: 8 }}>{safe(props.age)}</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 600 }}>Gender</td>
              <td style={{ padding: 8 }}>{safe(props.gender)}</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 600 }}>Traits</td>
              <td style={{ padding: 8 }}>{safe(props.trait?.join(", "))}</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 600 }}>Skills</td>
              <td style={{ padding: 8 }}>{safe(props.skills?.join(", "))}</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 600 }}>What makes your kiddo happy</td>
              <td style={{ padding: 8 }}>{safe(props.happy)}</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 600 }}>Interests</td>
              <td style={{ padding: 8 }}>{safe(props.interests)}</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 600 }}>Struggles</td>
              <td style={{ padding: 8 }}>{safe(props.struggles?.join(", "))}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {props.extra?.trim() ? (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Additional Notes</div>
          <div
            style={{
              whiteSpace: "pre-wrap",
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: 12,
            }}
          >
            {safe(props.extra)}
          </div>
        </div>
      ) : null}

      <p style={{ marginTop: 20, color: "#6B7280", fontSize: 12 }}>
        If you didn’t submit this, you can ignore this email.
      </p>
    </div>
  )
}
