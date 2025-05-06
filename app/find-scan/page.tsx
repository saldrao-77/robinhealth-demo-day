import type { Metadata } from "next"
import ZipCodeForm from "@/components/zip-code-form"
import ScanListingsSection from "@/components/scan-listings-section"

export const metadata: Metadata = {
  title: "Find Affordable Scans | Robin Health",
  description: "Search for affordable medical scans in your area with Robin Health.",
}

export default function FindScanPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="bg-blue-50 py-12 md:py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Find Affordable Medical Scans Near You</h1>
            <p className="text-lg mb-8">Enter your zip code to see available imaging centers and compare prices.</p>
            <ZipCodeForm />
          </div>
        </div>
      </section>

      <ScanListingsSection />
    </main>
  )
}
