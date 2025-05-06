"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockScanLocations } from "@/lib/mock-data"

export default function ZipCodeForm() {
  const [zipCode, setZipCode] = useState("")
  const [scanType, setScanType] = useState("mri")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState("")
  const [locations, setLocations] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate zip code
    if (!/^\d{5}$/.test(zipCode)) {
      setError("Please enter a valid 5-digit zip code")
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      // Simulate API call with a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get mock data
      const results = mockScanLocations(zipCode, scanType)
      setLocations(results)
      setHasSearched(true)
    } catch (error) {
      console.error("Error fetching scan locations:", error)
      setError("Failed to fetch locations. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Tired of overpriced scans and endless wait times? We'll find you an affordable, high-quality MRIs, CTs, and
          more near you — fast.
        </h2>
        <p className="text-lg text-center mb-8">
          You'll only pay our <span className="text-blue-500 font-semibold">$25 booking fee</span> once your appointment
          is confirmed — and if we don't save you at least $100, it's on us.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="zipCode" className="text-lg">
                Zip code
              </Label>
              <Input
                id="zipCode"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter your zip code"
                className="text-lg h-12"
                maxLength={5}
              />
              {error && <p className="text-red-500 mt-1">{error}</p>}
            </div>

            <div className="hidden">
              <Label htmlFor="scanType" className="text-lg">
                Scan Type
              </Label>
              <Select value={scanType} onValueChange={setScanType}>
                <SelectTrigger id="scanType" className="text-lg h-12">
                  <SelectValue placeholder="Select scan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mri">MRI</SelectItem>
                  <SelectItem value="ct">CT Scan</SelectItem>
                  <SelectItem value="xray">X-Ray</SelectItem>
                  <SelectItem value="ultrasound">Ultrasound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full h-12 text-lg bg-blue-500 hover:bg-blue-600" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Get affordable scan quotes now"}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">— OR —</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button variant="outline" className="h-12 text-lg text-blue-500">
              Call us
            </Button>
            <Button variant="outline" className="h-12 text-lg text-blue-500">
              Text us
            </Button>
          </div>
        </div>
      </div>

      {hasSearched && !isSubmitting && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Scan Locations near {zipCode}</h3>
          <div className="grid gap-4">
            {locations.map((location, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between">
                  <h4 className="font-semibold">{location.name}</h4>
                  <span className="font-bold text-green-600">${location.price}</span>
                </div>
                <p className="text-gray-600">{location.address}</p>
                <p className="text-gray-600">{location.distance} miles away</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
