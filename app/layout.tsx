import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Robin Health - Affordable Medical Imaging",
  description: "Find affordable medical imaging near you. MRIs starting at $225, CTs at $250, and more.",
  metadataBase: new URL("https://rbnhealth.vercel.app"),
  openGraph: {
    title: "Robin Health - Affordable Medical Imaging",
    description: "Find affordable medical imaging near you. Save up to 90% on MRIs, CTs, and more.",
    url: "https://rbnhealth.vercel.app/",
    siteName: "Robin Health",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/robin-health-social-card.png",
        width: 1200,
        height: 630,
        alt: "Robin Health - Affordable Medical Imaging",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robin Health - Affordable Medical Imaging",
    description: "Find affordable medical imaging near you. Save up to 90% on MRIs, CTs, and more.",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/robin-health-social-card.png"],
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T62742QD');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T62742QD"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  )
}
