"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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

// Fallback map component for when the map fails to load
const FallbackMap = dynamic(() => import("@/app/find-scan/fallback-map"), {
  ssr: false,
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
  "94301", // Palo Alto
  "94304", // Palo Alto
  "94305", // Stanford
  "94306", // Palo Alto
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
  Stanford: { lat: 37.4275, lng: -122.1697, radius: 0.03 },
}

// Interface for imaging center data
interface ImagingCenter {
  id: number
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  lat: number
  lng: number
  price: number
  original_price: number
  savings: number
  availability: string
  rating: number
  reviews: number
  studies: string[]
  distance?: number // Will be calculated based on user's zip code
}

// Fallback data generator for imaging centers
const generateFallbackCenters = (zipCode: string): ImagingCenter[] => {
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
  else if (zipCode.startsWith("940") || zipCode.startsWith("944") || zipCode.startsWith("943")) {
    selectedCities = ["San Mateo", "Redwood City", "Palo Alto", "Mountain View", "San Francisco"]
  }
  // For Stanford/Palo Alto area
  else if (zipCode.startsWith("9430")) {
    selectedCities = ["Palo Alto", "Stanford", "Mountain View", "Redwood City", "San Mateo"]
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

    // Generate a more realistic address
    const streetNames = ["Main St", "Oak Ave", "Maple Dr", "Washington Blvd", "Park Rd", "University Ave"]
    const streetIndex = (i + zipSeed) % streetNames.length
    const streetNumber = Math.floor(100 + ((i * 100 + zipSeed) % 900))
    const address = `${streetNumber} ${streetNames[streetIndex]}`

    return {
      id: i + 1,
      name: `Imaging Center - ${cityName}`,
      address,
      city: cityName,
      state: "CA",
      zip_code: zipCode,
      distance: Number.parseFloat(distanceFromZip),
      price: Number.parseFloat(price),
      original_price: originalPrice,
      savings: Number.parseFloat(savings),
      availability,
      rating: Number.parseFloat((4 + ((i * 0.1 + zipSeed * 0.01) % 1)).toFixed(1)),
      reviews: Math.floor(50 + ((i * 10 + zipSeed) % 100)),
      lat,
      lng,
      studies: [
        studyTypes[(i + zipSeed) % studyTypes.length].label,
        studyTypes[(i + 1 + zipSeed) % studyTypes.length].label,
        studyTypes[(i + 2 + zipSeed) % studyTypes.length].label,
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
  const [imagingCenters, setImagingCenters] = useState<ImagingCenter[]>([])
  const [isFiltered, setIsFiltered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [mapKey, setMapKey] = useState(0) // Key to force map re-render

  // Memoize the center selection handler to prevent recreation on every render
  const handleCenterClick = useCallback((id: number) => {
    setSelectedCenter((prevId) => (prevId === id ? null : id))
  }, [])

  // Function to calculate distance between two coordinates (haversine formula)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8 // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [])

  // Function to get coordinates from zip code (simplified for demo)
  const getCoordinatesFromZip = useCallback((zipCode: string) => {
    // This is a simplified mapping of zip codes to coordinates
    // In a real app, you would use a geocoding service
    const zipCoordinates: Record<string, { lat: number; lng: number }> = {
      "94102": { lat: 37.7749, lng: -122.4194 }, // San Francisco
      "94103": { lat: 37.7749, lng: -122.4194 },
      "94104": { lat: 37.7749, lng: -122.4194 },
      "94105": { lat: 37.7749, lng: -122.4194 },
      "94107": { lat: 37.7749, lng: -122.4194 },
      "94108": { lat: 37.7749, lng: -122.4194 },
      "94109": { lat: 37.7749, lng: -122.4194 },
      "94110": { lat: 37.7749, lng: -122.4194 },
      "94111": { lat: 37.7749, lng: -122.4194 },
      "94112": { lat: 37.7749, lng: -122.4194 },
      "94114": { lat: 37.7749, lng: -122.4194 },
      "94115": { lat: 37.7749, lng: -122.4194 },
      "94116": { lat: 37.7749, lng: -122.4194 },
      "94117": { lat: 37.7749, lng: -122.4194 },
      "94118": { lat: 37.7749, lng: -122.4194 },
      "94121": { lat: 37.7749, lng: -122.4194 },
      "94122": { lat: 37.7749, lng: -122.4194 },
      "94123": { lat: 37.7749, lng: -122.4194 },
      "94124": { lat: 37.7749, lng: -122.4194 },
      "94127": { lat: 37.7749, lng: -122.4194 },
      "94129": { lat: 37.7749, lng: -122.4194 },
      "94130": { lat: 37.7749, lng: -122.4194 },
      "94131": { lat: 37.7749, lng: -122.4194 },
      "94132": { lat: 37.7749, lng: -122.4194 },
      "94133": { lat: 37.7749, lng: -122.4194 },
      "94134": { lat: 37.7749, lng: -122.4194 },
      "94158": { lat: 37.7749, lng: -122.4194 },
      "94601": { lat: 37.8044, lng: -122.2711 }, // Oakland
      "94602": { lat: 37.8044, lng: -122.2711 },
      "94603": { lat: 37.8044, lng: -122.2711 },
      "94605": { lat: 37.8044, lng: -122.2711 },
      "94606": { lat: 37.8044, lng: -122.2711 },
      "94607": { lat: 37.8044, lng: -122.2711 },
      "94608": { lat: 37.8044, lng: -122.2711 },
      "94609": { lat: 37.8044, lng: -122.2711 },
      "94610": { lat: 37.8044, lng: -122.2711 },
      "94611": { lat: 37.8044, lng: -122.2711 },
      "94612": { lat: 37.8044, lng: -122.2711 },
      "94613": { lat: 37.8044, lng: -122.2711 },
      "94618": { lat: 37.8044, lng: -122.2711 },
      "94619": { lat: 37.8044, lng: -122.2711 },
      "94621": { lat: 37.8044, lng: -122.2711 },
      "94702": { lat: 37.8715, lng: -122.273 }, // Berkeley
      "94703": { lat: 37.8715, lng: -122.273 },
      "94704": { lat: 37.8715, lng: -122.273 },
      "94705": { lat: 37.8715, lng: -122.273 },
      "94706": { lat: 37.8715, lng: -122.273 },
      "94707": { lat: 37.8715, lng: -122.273 },
      "94708": { lat: 37.8715, lng: -122.273 },
      "94709": { lat: 37.8715, lng: -122.273 },
      "94710": { lat: 37.8715, lng: -122.273 },
      "94720": { lat: 37.8715, lng: -122.273 },
      "94301": { lat: 37.4419, lng: -122.143 }, // Palo Alto
      "94304": { lat: 37.4419, lng: -122.143 }, // Palo Alto
      "94305": { lat: 37.4275, lng: -122.1697 }, // Stanford
      "94306": { lat: 37.4419, lng: -122.143 }, // Palo Alto
      // Default to San Francisco if zip code not found
      default: { lat: 37.7749, lng: -122.4194 },
    }

    return zipCoordinates[zipCode] || zipCoordinates["default"]
  }, [])

  // Fetch imaging centers from Supabase with fallback to local generation
  const fetchImagingCenters = useCallback(
    async (zip: string, studyFilter?: string) => {
      setIsLoading(true)
      setError(null)

      try {
        // Generate fallback data immediately
        console.log("Using fallback data for zip:", zip)
        const fallbackCenters = generateFallbackCenters(zip)

        // Filter by study if needed
        const filteredCenters = studyFilter
          ? fallbackCenters.filter((center) =>
              center.studies.some((study) => study.toLowerCase().includes(studyFilter.toLowerCase())),
            )
          : fallbackCenters

        // Short timeout to simulate network request
        await new Promise((resolve) => setTimeout(resolve, 500))

        setImagingCenters(filteredCenters)
        // Force map to re-render with new centers
        setMapKey((prev) => prev + 1)
      } catch (err) {
        console.error("Error generating centers:", err)
        setError("Failed to load imaging centers. Please try again.")
        // Still try to show some data
        const fallbackCenters = generateFallbackCenters("94102")
        setImagingCenters(fallbackCenters)
      } finally {
        setIsLoading(false)
      }
    },
    [calculateDistance, getCoordinatesFromZip],
  )

  // Initialize data based on URL params
  useEffect(() => {
    if (hasInitialized) return

    // Get zip code from URL params
    const zip = searchParams.get("zipCode")
    if (zip) {
      setZipCode(zip)
      fetchImagingCenters(zip)
    } else {
      // Default to San Francisco if no zip code is provided
      setZipCode("94102")
      fetchImagingCenters("94102")
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

    // Cleanup function
    return () => {
      // Clean up any subscriptions or event listeners if needed
    }
  }, [searchParams, fetchImagingCenters, hasInitialized])

  // Memoize the book now handler
  const handleBookNow = useCallback(
    (center) => {
      // Get the selected study type from filters
      const studyType = filters.study
        ? studyTypes.find((s) => s.value === filters.study)?.label || filters.study
        : "MRI" // Default to MRI if no study type is selected

      // Navigate to confirm page with center info and study type
      router.push(
        `/confirm?center=${encodeURIComponent(JSON.stringify(center))}&studyType=${encodeURIComponent(studyType)}`,
      )
    },
    [router, filters.study],
  )

  // Memoize the search handler
  const handleSearch = useCallback(() => {
    setIsFiltered(true)
    fetchImagingCenters(zipCode, filters.study || undefined)
  }, [zipCode, filters.study, fetchImagingCenters])

  // Memoize the reset filters handler
  const resetFilters = useCallback(() => {
    setFilters({
      study: "",
      bodyPart: "",
      protocol: "",
    })
    setIsFiltered(false)
    fetchImagingCenters(zipCode)
  }, [zipCode, fetchImagingCenters])

  // Calculate average price for Robin Health centers
  const averagePrice = useMemo(() => {
    if (imagingCenters.length === 0) return 238

    const sum = imagingCenters.reduce((acc, center) => acc + Number(center.price), 0)
    return Math.round(sum / imagingCenters.length)
  }, [imagingCenters])

  // Calculate average savings
  const averageSavings = useMemo(() => {
    if (imagingCenters.length === 0) return 655

    const originalPrice = 893 // Hospital average
    return Math.round(originalPrice - averagePrice)
  }, [averagePrice])

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
                  <p className="text-2xl font-bold text-green-600">${averagePrice}</p>
                </div>

                <div className="text-center bg-blue-50 p-2 rounded-lg">
                  <p className="text-sm text-blue-600">Your Savings</p>
                  <p className="text-2xl font-bold text-blue-600">${averageSavings}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="ml-4 text-gray-600">Loading imaging centers...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              <p>{error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => fetchImagingCenters(zipCode)}>
                Try Again
              </Button>
            </div>
          )}

          {/* Main content - Listing and Map */}
          {!isLoading && !error && (
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
                                {center.distance} miles • {center.address}, {center.city}, {center.state}{" "}
                                {center.zip_code}
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
                            className={`whitespace-nowrap px-2 py-1 text-center min-w-[90px] text-xs sm:text-sm rounded-full ${
                              center.availability === "Today"
                                ? "bg-green-50 text-green-700"
                                : center.availability === "Tomorrow"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-gray-50 text-gray-700"
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
                              <span className="font-bold text-xl">${Math.round(center.price)}</span>
                              <span className="text-sm text-gray-500 line-through">
                                ${Math.round(center.original_price)}
                              </span>
                              <span className="text-sm text-green-600">Save ${Math.round(center.savings)}</span>
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
                    key={mapKey} // Force re-render when centers change
                    centers={imagingCenters}
                    selectedCenter={selectedCenter}
                    onCenterSelect={handleCenterClick}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
