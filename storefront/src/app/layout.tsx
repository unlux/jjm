import "styles/globals.css"

import { getBaseURL } from "@lib/util/env"
import { Analytics } from "@vercel/analytics/next"
import { Metadata } from "next"
import { Quicksand } from "next/font/google"
import { OrganizationJsonLd } from "@/lib/seo/jsonld"

import ClickSpark from "@/components/ui/ClickSpark"
import ResponsiveToaster from "@/components/ui/ResponsiveToaster"
import Providers from "@/lib/context/Providers"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "The Joy Junction",
    template: "%s | The Joy Junction",
  },
  description: "The Joy Junction - A Sustainable and Eco-friendly Toy Store.",
  openGraph: {
    type: "website",
    siteName: "The Joy Junction",
    title: "The Joy Junction",
    description: "The Joy Junction - A Sustainable and Eco-friendly Toy Store.",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Joy Junction",
    description: "The Joy Junction - A Sustainable and Eco-friendly Toy Store.",
    images: ["/logo.png"],
  },
  themeColor: "#ffffff",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
}

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body
        className={`${quicksand.className} font-quicksand group/nav m-0 p-0 antialiased`}
      >
        <ResponsiveToaster />
        <Providers>
          <main className="relative">
            {props.children}
            <ClickSpark />
          </main>
          {/* Organization JSON-LD */}
          <OrganizationJsonLd />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
