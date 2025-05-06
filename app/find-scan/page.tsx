import ZipCodeForm from "@/components/zip-code-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Find Affordable Scans Near You | Robin Health",
  description: "Search for affordable medical scans in your area with Robin Health.",
}

export default function FindScanPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Find Affordable Scans Near You</h1>
      <div className="max-w-xl mx-auto">
        <ZipCodeForm />
      </div>
    </main>
  )
}
