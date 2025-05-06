"use client"

import { useState, useEffect, useCallback } from "react"
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

// Bay Area zip codes
const bayAreaZipCodes = [
  "94102",
  "94103",
  "94104",
  "94105",
  "94107",
  "94108",
  "94109",
  "94110",
  "94111",
  "94112",
  "94114",
  "94115",
  "94116",
  "94117",
  "94118",
  "94121",
  "94122",
  "94123",
  "94124",
  "94127",
  "94129",
  "94130",
  "94131",
  "94132",
  "94133",
  "94134",
  "94158",
  "94601",
  "94602",
  "94603",
  "94605",
  "94606",
  "94607",
  "94608",
  "94609",
  "94610",
  "94611",
  "94612",
  "94613",
  "94618",
  "94619",
  "94621",
  "94702",
  "94703",
  "94704",
  "94705",
  "94706",
  "94707",
  "94708",
  "94709",
  "94710",
  "94720",
  "94536",
  "94537",
  "94538",
  "94539",
  "94555",
  "94540",
  "94541",
  "94542",
  "94543",
  "94544",
  "94545",
  "94501",
  "94502",
  "94546",
  "94552",
  "94568",
  "94560",
  "94550",
  "94551",
  "94566",
  "94588",
  "94577",
  "94578",
  "94579",
  "94587",
  "94801",
  "94804",
  "94805",
  "94806",
  "94518",
  "94519",
  "94520",
  "94521",
  "94595",
  "94596",
  "94597",
  "94598",
  "94509",
  "94531",
  "94513",
  "94506",
  "94526",
  "94553",
  "94565",
  "94582",
  "94583",
  "94014",
  "94015",
  "94016",
  "94017",
  "94061",
  "94062",
  "94063",
  "94065",
  "94401",
  "94402",
  "94403",
  "94404",
  "94027",
  "94002",
  "94010",
  "94019",
  "94025",
  "94030",
  "94044",
  "94066",
  "94080",
  "95110",
  "95111",
  "95112",
  "95113",
  "95116",
  "95117",
  "95118",
  "95119",
  "95120",
  "95121",
  "95122",
  "95123",
  "95124",
  "95125",
  "95126",
  "95127",
  "95128",
  "95129",
  "95130",
  "95131",
  "95132",
  "95133",
  "95134",
  "95135",
  "95136",
  "95138",
  "95139",
  "95148",
  "94301",
  "94303",
  "94304",
  "94306",
  "95008",
  "95014",
  "94022",
  "94024",
  "95035",
  "94040",
  "94041",
  "94043",
  "95050",
  "95051",
  "95054",
  "94085",
  "94086",
  "94087",
  "94089",
  "94901",
  "94903",
  "94941",
  "94965",
  "94920",
  "94925",
  "94930",
  "94939",
  "94945",
  "94947",
  "94949",
  "94957",
  "94589",
  "94590",
  "94591",
  "94592",
  "94533",
  "94534",
]

// Land-based coordinates for Bay Area cities
const cityCoordinates = {
  "San Francisco": { lat: 37.7749, lng: -122.4194, radius: 0.05 },
  Oakland: { lat: 37.8044, lng: -122.2711, radius: 0.05 },
  Berkeley: { lat: 37.8715, lng: -122.273, radius: 0.04 },
  "San Jose": { lat: 37.3382, lng: -121.8863, radius: 0.08 },
  "Palo Alto": { lat: 37.4419, lng: -122.143, radius: 0.04 },
  "Redwood City": { lat: 37.4852, lng: -122.2364, radius: 0.04 },
  "Mountain View": { lat: 37.3861, lng: -122.0839, radius: 0.04 },
  Sunnyvale: { lat: 37.3688, lng: -122.0363, radius: 0.05 },
  "Santa Clara": { lat: 37.3541, lng: -121.9552, radius: 0.05 },
  Fremont: { lat: 37.5485, lng: -121.9886, radius: 0.06 },
  Hayward: { lat: 37.6688, lng: -122.0808, radius: 0.05 },
  Richmond: { lat: 37.9357, lng: -122.3477, radius: 0.05 },
  Alameda: { lat: 37.7652, lng: -122.2416, radius: 0.03 },
  "Walnut Creek": { lat: 37.9101, lng: -122.0652, radius: 0.04 },
  Concord: { lat: 37.9779, lng: -122.0301, radius: 0.05 },
  "San Mateo": { lat: 37.563, lng: -122.3255, radius: 0.04 },
  "San Rafael": { lat: 37.9735, lng: -122.5311, radius: 0.04 },
  Novato: { lat: 38.1074, lng: -122.5697, radius: 0.05 },
  Vallejo: { lat: 38.1041, lng: -122.2566, radius: 0.05 },
  Fairfield: { lat: 38.2493, lng: -122.04, radius: 0.05 },
}

// Mock data for imaging centers - memoized to prevent regeneration on every render
const generateImagingCenters = (zipCode) => {
  // If the zip code is not in the Bay Area, default to San Francisco
  if (!bayAreaZipCodes.includes(zipCode)) {
    zipCode = "94102" // Default to San Francisco
  }

  // Select cities to use based on the zip code
  // This is a simplified approach - in a real app, you'd use geocoding
  let selectedCities = Object.keys(cityCoordinates)

  // For San Francisco zip codes
  if (zipCode.startsWith("941")) {
    selectedCities = ["San Francisco", "Oakland", "Berkeley", "San Mateo", "Alameda"]
  }
  // For East Bay zip codes
  else if (zipCode.startsWith("945") || zipCode.startsWith("946") || zipCode.startsWith("947")) {
    selectedCities = ["Oakland", "Berkeley", "Alameda", "Hayward", "Fremont", "Richmond"]
  }
  // For South Bay zip codes
  else if (zipCode.startsWith("950") || zipCode.startsWith("951")) {
    selectedCities = ["San Jose", "Santa Clara", "Sunnyvale", "Mountain View", "Palo Alto"]
  }
  // For Peninsula zip codes
  else if (zipCode.startsWith("940") || zipCode.startsWith("944")) {
    selectedCities = ["San Mateo", "Redwood City", "Palo Alto", "Mountain View", "San Francisco"]
  }
  // For North Bay zip codes
  else if (zipCode.startsWith("949")) {
    selectedCities = ["San Rafael", "Novato", "Richmond", "San Francisco"]
  }

  // Use a seed based on the zip code for consistent results
  const zipSeed = zipCode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return Array.from({ length: 10 }, (_, i) => {
    // Use a deterministic approach to select cities based on index and zip seed
    const cityIndex = (i + zipSeed) % selectedCities.length
    const cityName = selectedCities[cityIndex]
    const cityData = cityCoordinates[cityName]

    // Generate coordinates within the city's radius (on land)
    // Use a deterministic angle based on index and zip seed
    const angle = ((i * 36 + zipSeed) % 360) * (Math.PI / 180)
    const distance = (0.2 + ((i * 0.07 + zipSeed * 0.01) % 0.8)) * cityData.radius
    const lat = cityData.lat + distance * Math.cos(angle)
    const lng = cityData.lng + distance * Math.sin(angle)

    // Generate deterministic values based on index and zip seed
    const distanceFromZip = (1 + ((i * 1.1 + zipSeed * 0.01) % 9)).toFixed(1)
    const price = (150 + ((i * 20 + zipSeed) % 200)).toFixed(2)
    const originalPrice = 893
    const savings = (originalPrice - Number.parseFloat(price)).toFixed(2)

    // Generate availability based on index
    const availabilityOptions = ["Today", "Tomorrow", "This Week", "Next Week"]
    const availabilityIndex = (i + zipSeed) % availabilityOptions.length
    const availability = availabilityOptions[availabilityIndex]

    return {
      id: i + 1,
      name: `Imaging Center - ${cityName}`,
      distance: Number.parseFloat(distanceFromZip),
      price: Number.parseFloat(price),
      originalPrice,
      savings: Number.parseFloat(savings),
      availability,
      address: `${Math.floor(100 + ((i * 100 + zipSeed) % 900))} Main St, ${cityName}, CA`,
      rating: (4 + ((i * 0.1 + zipSeed * 0.01) % 1)).toFixed(1),
      reviews: Math.floor(50 + ((i * 10 + zipSeed) % 100)),
      lat,
      lng,
      studies: [
        studyTypes[(i + zipSeed) % studyTypes.length].label,
        studyTypes[(i + 1 + zipSeed) % studyTypes.length].label,
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
  const [hasInitialized, setHasInitialized] = useState(false)

  // Memoize the center selection handler to prevent recreation on every render
  const handleCenterClick = useCallback((id: number) => {
    setSelectedCenter((prevId) => (prevId === id ? null : id))
  }, [])

  // Initialize data based on URL params - only run once
  useEffect(() => {
    if (hasInitialized) return

    // Get zip code from URL params
    const zip = searchParams.get("zipCode")
    if (zip) {
      setZipCode(zip)
      // Generate centers based on the zip code
      setImagingCenters(generateImagingCenters(zip))
    } else {
      // Default to San Francisco if no zip code is provided
      setZipCode("94102")
      setImagingCenters(generateImagingCenters("94102"))
    }

    // Add global styles for z-index
    if (typeof document !== "undefined") {
      const styleId = "global-dropdown-styles"
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style")
        style.id = styleId
        style.innerHTML = `
          .radix-select-content {
            z-index: 9999 !important;
          }
        `
        document.head.appendChild(style)
      }
    }

    setHasInitialized(true)
  }, [searchParams, hasInitialized])

  // Memoize the book now handler
  const handleBookNow = useCallback(
    (center) => {
      // Navigate to confirm page with center info
      router.push(`/confirm?center=${encodeURIComponent(JSON.stringify(center))}`)
    },
    [router],
  )

  // Memoize the search handler
  const handleSearch = useCallback(() => {
    // Filter centers based on selected criteria
    setIsFiltered(true)
    // In a real app, this would make an API call with the filters
    // For now, we'll just simulate filtering by regenerating centers
    setImagingCenters(generateImagingCenters(zipCode))
  }, [zipCode])

  // Memoize the reset filters handler
  const resetFilters = useCallback(() => {
    setFilters({
      study: "",
      bodyPart: "",
      protocol: "",
    })
    setIsFiltered(false)
    setImagingCenters(generateImagingCenters(zipCode))
  }, [zipCode])

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
              <Select
                value={filters.study}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, study: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Study Type" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {studyTypes.map((study) => (
                    <SelectItem key={study.value} value={study.value}>
                      {study.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.bodyPart}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, bodyPart: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Body Part" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {bodyParts.map((part) => (
                    <SelectItem key={part.value} value={part.value}>
                      {part.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.protocol}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, protocol: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Protocol" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
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
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setFilters((prev) => ({ ...prev, study: "" }))}
                    />
                  </Badge>
                )}

                {filters.bodyPart && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {bodyParts.find((b) => b.value === filters.bodyPart)?.label || filters.bodyPart}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setFilters((prev) => ({ ...prev, bodyPart: "" }))}
                    />
                  </Badge>
                )}

                {filters.protocol && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {protocols.find((p) => p.value === filters.protocol)?.label || filters.protocol}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setFilters((prev) => ({ ...prev, protocol: "" }))}
                    />
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
                          className={`whitespace-nowrap px-2 py-1 text-center min-w-[90px] ${
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
                          className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
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
