import posthog from "posthog-js"

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://eu.posthog.com",
  capture_pageview: true,
  capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: "[data-ph-mask]",
    blockSelector: "[data-ph-no-capture]",
  },
  debug: process.env.NODE_ENV === "development",
});