import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { Analytics } from "@vercel/analytics/next"
import { Quicksand } from "next/font/google"
import ClickSpark from "@/apne-component/ClickSpark"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
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
        className={`${quicksand.className} font-quicksand antialiased m-0 p-0 group/nav`}
      >
        <main className="relative">
          {props.children}
          <ClickSpark />
        </main>
        <Analytics />
      </body>
    </html>
  )
}
