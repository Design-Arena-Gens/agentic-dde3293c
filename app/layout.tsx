import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hudson Heights Bistro - AI Voice Assistant',
  description: 'Voice-powered restaurant assistant for reservations, menu inquiries, and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
