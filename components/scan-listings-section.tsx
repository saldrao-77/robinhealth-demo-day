"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for demonstration
const mockLocations = [
  {
    id: 1,
    name: "Bay Area Medical Imaging Center",
    address: "123 Medical Plaza Dr, San Francisco, CA 94107",
    price: 350,
    distance: 2.4,
    availability: "Same-Week",
    phone: "(415) 555-1234",
    rating: 4.8,
    reviews: 124,
    isInNetwork: true,
    isMostAffordable: true,
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: 2,
    name: "Advanced Diagnostic Imaging",
    address: "456 Healthcare Blvd, San Francisco, CA 94107",
    price: 450,
    distance: 3.1,
    availability: "Next-Day",
    phone: "(415) 555-5678",
    rating: 4.6,
    reviews: 89,
    isInNetwork: true,
    isMostAffordable: false,
    lat: 37.7833,
    lng: -122.4167,
  },
  {
    id: 3,
    name: "City Radiology Partners",
    address: "789 Medical Center Way, San Francisco, CA 94107",
    price: 380,
    distance: 4.2,
    availability: "Same-Day",
    phone: "(415) 555-9012",
    rating: 4.5,
    reviews: 76,
    isInNetwork: false,
    isMostAffordable: false,
    lat: 37.7694,
    lng: -122.4862,
  },
  {
    id: 4,
    name: "Peninsula Imaging Center",
    address: "321 Health Sciences Dr, San Francisco, CA 94107",
    price: 520,
    distance: 5.7,
    availability: "Same-Week",
    phone: "(415) 555-3456",
    rating: 4.9,
    reviews: 112,
    isInNetwork: true,
    isMostAffordable: false,
    lat: 37.7835,
    lng: -122.4314,
  },
]

interface ScanListingsSectionProps {
  zipCode: string
  scanType: string
}

export default function ScanListingsSection({ zipCode, scanType }: ScanListingsSectionProps) {
  const [locations, setLocations] = useState(mockLocations)
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState("price")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [zipCode, scanType])

  useEffect(() => {
    // Sort locations based on sortBy value
    const sortedLocations = [...mockLocations].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "distance") return a.distance - b.distance
      if (sortBy === "availability") {
        const availabilityRank = {
          "Same-Day": 1,
          "Next-Day": 2,
          "Same-Week": 3,
        }
        return (
          availabilityRank[a.availability as keyof typeof availabilityRank] -
          availabilityRank[b.availability as keyof typeof availabilityRank]
        )
      }
      return 0
    })
    setLocations(sortedLocations)
  }, [sortBy])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Finding the best scan locations near {zipCode}...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">
          Scan locations near {zipCode}
          <span className="text-sm font-normal text-gray-500 ml-2">({locations.length} results)</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <Tabs defaultValue="price" value={sortBy} onValueChange={setSortBy} className="w-[200px]">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="price">Price</TabsTrigger>
              <TabsTrigger value="distance">Distance</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {locations.map((location) => (
          <Card
            key={location.id}
            className={`overflow-hidden transition-all ${selectedLocation === location.id ? "ring-2 ring-blue-600" : ""}`}
            onClick={() => setSelectedLocation(location.id)}
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-4 flex-1">
                  {location.isMostAffordable && (
                    <div className="inline-block bg-amber-100 text-amber-800 px-2 py-1 text-xs font-medium rounded mb-2">
                      Most Affordable
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{location.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{location.address}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="ml-1 text-green-600 font-bold">${location.price}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">Distance:</span>
                      <span className="ml-1">{location.distance} mi</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">Availability:</span>
                      <span className="ml-1">{location.availability}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button size="sm">Book Appointment</Button>
                    <Button size="sm" variant="outline" className="ml-2">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
