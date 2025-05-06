"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, MapPin, Filter, X, Building2, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/app/find-scan/map-component"), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg"
      style={{ minHeight: "600px" }}
    >
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
})

// Study types data
const studyTypes = [
  { value: "mri", label: "MRI" },
  { value: "ct", label: "CT" },
  { value: "ultrasound", label: "Ultrasound" },
  { value: "xray", label: "Xray" },
  { value: "mammogram", label: "Mammogram" },
  { value: "stress-tests-ekg", label: "Stress Tests & EKG" },
  { value: "pet-scan", label: "PET Scan" },
  { value: "dexa", label: "DEXA" },
  { value: "virtual-colonoscopy", label: "Virtual Colonoscopy" },
  { value: "mra", label: "MRA" },
  { value: "cta", label: "CTA" },
]

// Body parts data
const bodyParts = [
  { value: "abdomen", label: "Abdomen" },
  { value: "ankle", label: "Ankle" },
  { value: "arthrogram", label: "Arthrogram" },
  { value: "brain", label: "Brain" },
  { value: "brain-with-pituitary", label: "Brain with Pituitary" },
  { value: "breast-unilateral", label: "Breast - Unilateral" },
  { value: "breast-bilateral", label: "Breast - Bilateral" },
  { value: "cervical-spine", label: "Cervical Spine" },
  { value: "chest-thorax", label: "Chest/Thorax" },
  { value: "cholangiopancreatography", label: "Cholangiopancreatography" },
  { value: "elbow", label: "Elbow" },
  { value: "enterography", label: "Enterography" },
  { value: "face", label: "Face" },
  { value: "finger", label: "Finger" },
  { value: "foot", label: "Foot" },
  { value: "forearm", label: "Forearm" },
  { value: "hand", label: "Hand" },
  { value: "hip-unilateral", label: "Hip - Unilateral" },
  { value: "humerus", label: "Humerus" },
  { value: "iac", label: "IAC (Internal Auditory Canal)" },
  { value: "knee-unilateral", label: "Knee - Unilateral" },
  { value: "lower-extremity-joint", label: "Lower Extremity Joint" },
  { value: "lower-extremity", label: "Lower Extremity" },
  { value: "lower-leg", label: "Lower Leg" },
  { value: "lumbar-spine", label: "Lumbar Spine" },
  { value: "neck", label: "Neck" },
  { value: "orbit-face-neck", label: "Orbit / Face / Neck" },
  { value: "mrcp", label: "MRCP" },
  { value: "pelvis", label: "Pelvis" },
  { value: "pituitary-and-brain", label: "Pituitary and Brain" },
  { value: "shoulder", label: "Shoulder" },
  { value: "thigh", label: "Thigh" },
  { value: "thoracic-spine", label: "Thoracic Spine" },
  { value: "tmj", label: "TMJ" },
  { value: "upper-extremity-joint", label: "Upper Extremity Joint" },
  { value: "upper-extremity-non-joint", label: "Upper Extremity Non Joint" },
  { value: "wrist", label: "Wrist" },
]

// Protocols data
const protocols = [
  { value: "with-without-contrast", label: "With & Without Contrast" },
  { value: "with-contrast", label: "With Contrast" },
  { value: "without-contrast", label: "Without Contrast" },
  { value: "mrcp", label: "MRCP" },
]

// Mock data for imaging centers
const generateImagingCenters = (zipCode) => {
  const cities = [
    "San Francisco",
    "Oakland",
    "Berkeley",
    "San Jose",
    "Palo Alto",
    "Redwood City",
    "Mountain View",
    "Sunnyvale",
    "Santa Clara",
    "Fremont",
  ]

  return Array.from({ length: 10 }, (_, i) => {
    const city = cities[i % cities.length]
    const distance = (1 + Math.random() * 9).toFixed(1)
    const price = (150 + Math.random() * 200).toFixed(2)
    const originalPrice = 893
    const savings = (originalPrice - Number.parseFloat(price)).toFixed(2)

    // Generate random availability
    const availabilityOptions = ["Today", "Tomorrow", "This Week", "Next Week"]
    const availabilityIndex = Math.floor(Math.random() * availabilityOptions.length)
    const availability = availabilityOptions[availabilityIndex]

    // Generate random coordinates near the zip code area
    // This is a simplified approach - in a real app, you'd use geocoding
    const baseLat = 37.7749 + (Math.random() - 0.5) * 0.2
    const baseLng = -122.4194 + (Math.random() - 0.5) * 0.2

    return {
      id: i + 1,
      name: `Imaging Center - ${city}`,
      distance: Number.parseFloat(distance),
      price: Number.parseFloat(price),
      originalPrice,
      savings: Number.parseFloat(savings),
      availability,
      address: `${Math.floor(Math.random() * 999) + 100} Main St, ${city}, CA`,
      rating: (4 + Math.random()).toFixed(1),
      reviews: Math.floor(Math.random() * 150) + 50,
      lat: baseLat,
      lng: baseLng,
      studies: [
        studyTypes[Math.floor(Math.random() * studyTypes.length)].label,
        studyTypes[Math.floor(Math.random() * studyTypes.length)].label,
      ].filter((value, index, self) => self.indexOf(value) === index), // Remove duplicates
    }
  }).sort((a, b) => a.distance - b.distance) // Sort by distance
}

export default function FindScanPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [zipCode, setZipCode] = useState("")
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null)
  const [filters, setFilters] = useState({
    study: "",
    bodyPart: "",
    protocol: "",
  })
  const [imagingCenters, setImagingCenters] = useState([])
  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    // Get zip code from URL params
    const zip = searchParams.get("zipCode")
    if (zip) {
      setZipCode(zip)
      // Generate centers based on the zip code
      setImagingCenters(generateImagingCenters(zip))
    }
  }, [searchParams])

  const handleCenterClick = (id: number) => {
    setSelectedCenter(id === selectedCenter ? null : id)
  }

  const handleBookNow = (center) => {
    // Navigate to confirm page with center info
    router.push(`/confirm?center=${encodeURIComponent(JSON.stringify(center))}`)
  }

  const handleSearch = () => {
    // Filter centers based on selected criteria
    setIsFiltered(true)
    // In a real app, this would make an API call with the filters
    // For now, we'll just simulate filtering by regenerating centers
    setImagingCenters(generateImagingCenters(zipCode))
  }

  const resetFilters = () => {
    setFilters({
      study: "",
      bodyPart: "",
      protocol: "",
    })
    setIsFiltered(false)
    setImagingCenters(generateImagingCenters(zipCode))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <h1 className="text-3xl font-bold mb-2">Find Affordable Imaging Centers</h1>
          <p className="text-gray-600 mb-6">Compare prices and book appointments at imaging centers near you</p>

          {/* Search and filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Select value={filters.study} onValueChange={(value) => setFilters({ ...filters, study: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Study Type" />
                </SelectTrigger>
                <SelectContent>
                  {studyTypes.map((study) => (
                    <SelectItem key={study.value} value={study.value}>
                      {study.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.bodyPart} onValueChange={(value) => setFilters({ ...filters, bodyPart: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Body Part" />
                </SelectTrigger>
                <SelectContent>
                  {bodyParts.map((part) => (
                    <SelectItem key={part.value} value={part.value}>
                      {part.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.protocol} onValueChange={(value) => setFilters({ ...filters, protocol: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Protocol" />
                </SelectTrigger>
                <SelectContent>
                  {protocols.map((protocol) => (
                    <SelectItem key={protocol.value} value={protocol.value}>
                      {protocol.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <Input
                  type="text"
                  placeholder="Zip Code or City"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>

                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>

                {filters.study && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {studyTypes.find((s) => s.value === filters.study)?.label || filters.study}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, study: "" })} />
                  </Badge>
                )}

                {filters.bodyPart && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {bodyParts.find((b) => b.value === filters.bodyPart)?.label || filters.bodyPart}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, bodyPart: "" })} />
                  </Badge>
                )}

                {filters.protocol && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {protocols.find((p) => p.value === filters.protocol)?.label || filters.protocol}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, protocol: "" })} />
                  </Badge>
                )}
              </div>

              {isFiltered && (
                <Button variant="link" size="sm" className="text-blue-600" onClick={resetFilters}>
                  Reset All
                </Button>
              )}
            </div>
          </div>

          {/* Savings comparison */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">Save on Medical Imaging</h2>
                <p className="text-gray-600">Robin Health prices vs. average hospital prices</p>
              </div>

              <div className="flex items-center mt-4 md:mt-0 space-x-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Hospital Average</p>
                  <p className="text-2xl font-bold text-gray-800">$893</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">Robin Health Average</p>
                  <p className="text-2xl font-bold text-green-600">$249</p>
                </div>

                <div className="text-center bg-blue-50 p-2 rounded-lg">
                  <p className="text-sm text-blue-600">Your Savings</p>
                  <p className="text-2xl font-bold text-blue-600">$644</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main content - Listing and Map */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Listing of imaging centers */}
            <div className="md:col-span-1 space-y-4 overflow-y-auto max-h-[800px] pr-2">
              {imagingCenters.length > 0 ? (
                imagingCenters.map((center) => (
                  <Card
                    key={center.id}
                    className={`cursor-pointer transition-all ${selectedCenter === center.id ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => handleCenterClick(center.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{center.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>
                              {center.distance} miles • {center.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                              <span>
                                {center.rating} ({center.reviews})
                              </span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Open 8am-6pm</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${
                            center.availability === "Today"
                              ? "bg-green-50 text-green-700"
                              : center.availability === "Tomorrow"
                                ? "bg-blue-50 text-blue-700"
                                : ""
                          }`}
                        >
                          {center.availability}
                        </Badge>
                      </div>

                      <Separator className="my-3" />

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xl">${center.price}</span>
                            <span className="text-sm text-gray-500 line-through">${center.originalPrice}</span>
                            <span className="text-sm text-green-600">Save ${center.savings}</span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBookNow(center)
                          }}
                        >
                          Book Now
                        </Button>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-gray-500">Available Studies:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {center.studies.map((study, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {study}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">No imaging centers found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search criteria or enter a different zip code.
                  </p>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="md:col-span-2">
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden"
                style={{ height: "800px", minHeight: "600px" }}
              >
                <MapComponent
                  centers={imagingCenters}
                  selectedCenter={selectedCenter}
                  onCenterSelect={handleCenterClick}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
