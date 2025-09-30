export type ContactEmailPayload = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

const safe = (v?: string) =>
  String(v ?? "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

export const renderContactEmailHtml = (data: ContactEmailPayload) => {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; padding: 24px; color: #111827;">
    <h2 style="margin: 0 0 12px;">New Contact Form Submission</h2>
    <p style="margin: 0 0 20px; color: #374151;">You have received a new message from The Joy Junction website contact form.</p>

    <table style="border-collapse: collapse; width: 100%;">
      <tbody>
        <tr>
          <td style="padding: 8px; font-weight: 600; width: 120px;">Name</td>
          <td style="padding: 8px;">${safe(data.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: 600;">Email</td>
          <td style="padding: 8px;"><a href="mailto:${safe(data.email)}">${safe(
            data.email
          )}</a></td>
        </tr>
        ${
          data.phone
            ? `<tr><td style=\"padding: 8px; font-weight: 600;\">Phone</td><td style=\"padding: 8px;\">${safe(
                data.phone
              )}</td></tr>`
            : ""
        }
        ${
          data.subject
            ? `<tr><td style=\"padding: 8px; font-weight: 600;\">Subject</td><td style=\"padding: 8px;\">${safe(
                data.subject
              )}</td></tr>`
            : ""
        }
      </tbody>
    </table>

    <div style="margin-top: 20px;">
      <div style="font-weight: 600; margin-bottom: 8px;">Message</div>
      <div style="white-space: pre-wrap; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px;">${safe(
        data.message
      )}</div>
    </div>
  </div>
  `
}

export const renderContactConfirmationEmailHtml = (
  data: ContactEmailPayload
) => {
  const s = (v?: string) => String(v ?? "")
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; padding: 24px; color: #111827;">
    <h2 style="margin: 0 0 12px;">Thanks for reaching out, ${
      s(data.name) || "there"
    }!</h2>
    <p style="margin: 0 0 16px; color: #374151;">We’ve received your message and our team at The Joy Junction will get back to you as soon as possible.</p>

    <div style="margin-top: 20px;">
      <div style="font-weight: 600; margin-bottom: 8px;">Your message</div>
      <div style="white-space: pre-wrap; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px;">${safe(
        data.message
      )}</div>
    </div>

    <p style="margin-top: 20px; color: #6B7280; font-size: 12px;">If you didn’t submit this, you can ignore this email.</p>
  </div>
  `
}
