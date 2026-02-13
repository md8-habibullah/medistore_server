import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { RootWrapper } from './root-wrapper'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MediStore - Your Trusted Online Medicine Shop',
  description: 'Browse and purchase medicines online with fast delivery and trusted sellers',
}

export const viewport: Viewport = {
  themeColor: '#0d9488',
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${geistSans.className} bg-background text-foreground`}>
        <RootWrapper>{children}</RootWrapper>
      </body>
    </html>
  )
}
