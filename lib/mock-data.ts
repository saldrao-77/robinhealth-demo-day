export type ScanLocation = {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  availability: string
  distance: number
  type: string
  provider: string
  status: string
}

// Function to generate random scan locations based on zip code
export function mockScanLocations(zipCode: string, scanType: string): ScanLocation[] {
  // Map of zip codes to city/state
  const zipCodeMap: Record<string, { city: string; state: string }> = {
    "94103": { city: "San Francisco", state: "CA" },
    "10001": { city: "New York", state: "NY" },
    "60601": { city: "Chicago", state: "IL" },
    "90210": { city: "Beverly Hills", state: "CA" },
    "75201": { city: "Dallas", state: "TX" },
    "02108": { city: "Boston", state: "MA" },
    "33139": { city: "Miami Beach", state: "FL" },
    "98101": { city: "Seattle", state: "WA" },
  }

  // Default to San Francisco if zip code not in map
  const location = zipCodeMap[zipCode] || { city: "Unknown City", state: "CA" }

  // Facility name prefixes
  const facilityPrefixes = [
    "Advanced",
    "Premier",
    "Elite",
    "Comprehensive",
    "Modern",
    "Quality",
    "Precision",
    "Reliable",
    "Affordable",
    "Community",
  ]

  // Facility name suffixes
  const facilitySuffixes = [
    "Imaging Center",
    "Diagnostic Imaging",
    "Radiology",
    "Medical Imaging",
    "Scan Center",
    "Health Imaging",
    "Diagnostic Center",
    "MRI Center",
    "Imaging Associates",
    "Radiology Group",
  ]

  // Street names
  const streets = [
    "Main St",
    "Oak Ave",
    "Maple Rd",
    "Washington Blvd",
    "Park Ave",
    "Market St",
    "Broadway",
    "Highland Ave",
    "Sunset Blvd",
    "Lincoln Ave",
  ]

  // Providers
  const providers = [
    "HealthNet",
    "Blue Shield",
    "Aetna",
    "UnitedHealth",
    "Cigna",
    "Humana",
    "Kaiser",
    "Medicare",
    "Medicaid",
    "Self-pay",
  ]

  // Availability options
  const availabilityOptions = ["Next day", "Same week", "2-3 days", "This week", "Next week", "Today"]

  // Status options
  const statusOptions = ["active", "most-affordable"]

  // Generate 5-10 random locations
  const numLocations = Math.floor(Math.random() * 6) + 5
  const locations: ScanLocation[] = []

  for (let i = 0; i < numLocations; i++) {
    const prefixIndex = Math.floor(Math.random() * facilityPrefixes.length)
    const suffixIndex = Math.floor(Math.random() * facilitySuffixes.length)
    const streetIndex = Math.floor(Math.random() * streets.length)
    const streetNumber = Math.floor(Math.random() * 2000) + 100
    const providerIndex = Math.floor(Math.random() * providers.length)
    const availabilityIndex = Math.floor(Math.random() * availabilityOptions.length)
    const statusIndex = Math.floor(Math.random() * statusOptions.length)

    // Generate a price between $300 and $2000
    const price = Math.floor(Math.random() * 1700) + 300

    // Generate a distance between 0.5 and 20 miles
    const distance = (Math.random() * 19.5 + 0.5).toFixed(1)

    locations.push({
      id: `loc-${zipCode}-${i}`,
      name: `${facilityPrefixes[prefixIndex]} ${facilitySuffixes[suffixIndex]}`,
      address: `${streetNumber} ${streets[streetIndex]}`,
      city: location.city,
      state: location.state,
      zipCode,
      price,
      availability: availabilityOptions[availabilityIndex],
      distance: Number.parseFloat(distance),
      type: scanType.toUpperCase(),
      provider: providers[providerIndex],
      status: statusOptions[statusIndex],
    })
  }

  // Sort by price (lowest first)
  return locations.sort((a, b) => a.price - b.price)
}
