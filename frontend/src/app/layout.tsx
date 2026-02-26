import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UK Agency Jobs',
  description: 'Jobs from ARC Hospitality, Blue Arrow, Adecco, Hays, Staffline & more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper">{children}</body>
    </html>
  )
}
