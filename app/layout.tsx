import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import Nav from "@/components/Nav"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Med AI",
  description: "AI for medical diagnosis",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <div
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 w-full"
            role="alert"
          >
            <p className="font-bold">Update – 23 June 2024</p>
            <p>
              We won the Precision Care Challenge hosted by GE Healthcare and
              secured the first position and this project has been set into
              quarantine mode and won't be updated anymore.
            </p>
          </div>
          <Nav />
          {children}
          <Analytics />
        </main>
      </body>
    </html>
  )
}
