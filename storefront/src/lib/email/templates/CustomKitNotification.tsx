import * as React from "react"

export type CustomKitNotificationProps = {
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

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <tr>
    <td style={{ padding: 8, fontWeight: 600, width: 160 }}>{label}</td>
    <td style={{ padding: 8 }}>{value}</td>
  </tr>
)

const safe = (v?: string) => String(v ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;")

export default function CustomKitNotification(props: CustomKitNotificationProps) {
  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        padding: 24,
        color: "#111827",
      }}
    >
      <h2 style={{ margin: "0 0 12px" }}>New Custom Kit Request</h2>
      <p style={{ margin: "0 0 16px", color: "#374151" }}>
        A user has submitted the custom kit questionnaire.
      </p>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          <Row label="Email" value={<a href={`mailto:${safe(props.email)}`}>{safe(props.email)}</a>} />
          <Row label="Phone" value={safe(props.phone)} />
          <Row label="Age" value={safe(props.age)} />
          <Row label="Gender" value={safe(props.gender)} />
          <Row label="Traits" value={safe(props.trait?.join(", "))} />
          <Row label="Skills" value={safe(props.skills?.join(", "))} />
          <Row label="Happy" value={safe(props.happy)} />
          <Row label="Interests" value={safe(props.interests)} />
          <Row label="Struggles" value={safe(props.struggles?.join(", "))} />
        </tbody>
      </table>

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
            dangerouslySetInnerHTML={{ __html: safe(props.extra) }}
          />
        </div>
      ) : null}
    </div>
  )
}
