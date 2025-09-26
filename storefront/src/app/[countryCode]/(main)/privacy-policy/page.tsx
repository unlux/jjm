// components/PrivacyPolicy.tsx
// Server component: static content only
export const dynamic = "force-static"

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 text-gray-800">
      <h1 className="mb-6 text-center text-3xl font-bold">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to Joy Junction! This Privacy Policy explains how we collect,
          use, and protect your personal information when you use our website
          and services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">
          2. Information We Collect
        </h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Personal info (name, email, shipping address, phone number)</li>
          <li>Order details and payment information</li>
          <li>Browsing behavior (pages visited, time spent, etc.)</li>
          <li>Device & IP address for analytics and fraud prevention</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">
          3. How We Use Your Information
        </h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>To process orders and deliver products</li>
          <li>To send order updates and promotional emails (opt-in only)</li>
          <li>To improve our website and customer experience</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">4. Cookies</h2>
        <p>
          We use cookies to remember your preferences, keep you logged in, and
          track usage for analytics. You can control cookies in your browser
          settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">5. Data Protection</h2>
        <p>
          We take your privacy seriously. All sensitive data is encrypted, and
          we never sell or share your information with third-party marketers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">6. Your Rights</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Access or update your personal info</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">
          7. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy occasionally. Any changes will be
          posted here with an updated effective date.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <a
            href="mailto:support@joyjunction.com"
            className="text-blue-600 hover:underline"
          >
            support@joyjunction.com
          </a>
          .
        </p>
      </section>

      <p className="mt-10 text-center text-sm text-gray-500">
        Last updated: July 17, 2025
      </p>
    </div>
  )
}

export default PrivacyPolicy
