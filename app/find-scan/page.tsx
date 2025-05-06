import ZipCodeForm from "@/components/zip-code-form"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Find Affordable Scans Near You | Robin Health",
  description: "Search for affordable medical scans in your area with Robin Health.",
}

export default function FindScanPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <ZipCodeForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
