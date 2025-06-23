import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "../contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LUNEXIS - Emotionally Immersive Social Universe",
  description: "AI-powered social media universe blending stories, videos, chats, and creativity",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
  <Head>
    <title>Lunexis</title>
    <meta name='description' content='Lunexis - A futuristic social media experience.' />
    <meta property='og:title' content='Lunexis' />
    <meta property='og:description' content='Connect, share, and explore in a vibrant digital cosmos.' />
    <meta property='og:image' content='/lunexis-logo.png' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <link rel='icon' href='/favicon.ico' />
  </Head>
      <body suppressHydrationWarning={true} className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
