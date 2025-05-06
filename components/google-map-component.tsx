"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface GoogleMapComponentProps {
  locations: Array<{
    id: string
    name: string
    address: string
    lat: number
    lng: number
    price: number
    isMostAffordable?: boolean
  }>
  selectedLocationId?: string
  onMarkerClick?: (locationId: string) => void
  className?: string
}

export default function GoogleMapComponent({
  locations,
  selectedLocationId,
  onMarkerClick,
  className = "",
}: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [google, setGoogle] = useState<typeof google.maps | null>(null)

  // Fetch API key from server
  useEffect(() => {
    async function fetchApiKey() {
      try {
        const response = await fetch("/api/maps")
        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setIsLoading(false)
          return
        }

        setApiKey(data.apiKey)
      } catch (err) {
        setError("Failed to load Maps API key")
        setIsLoading(false)
      }
    }

    fetchApiKey()
  }, [])

  // Initialize map once we have the API key
  useEffect(() => {
    if (!apiKey || !mapRef.current) return

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
          libraries: ["places"],
        })

        const googleMaps = await loader.load()
        setGoogle(googleMaps.maps)

        const newMap = new googleMaps.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
          zoom: 10,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        })

        setMap(newMap)
        setInfoWindow(new googleMaps.maps.InfoWindow())
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading Google Maps:", err)
        setError("Failed to load Google Maps")
        setIsLoading(false)
      }
    }

    initMap()
  }, [apiKey])

  // Add markers when map is ready and locations change
  useEffect(() => {
    if (!map || !infoWindow || !google) return

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))
    setMarkers([])

    if (locations.length === 0) return

    // Create bounds to fit all markers
    const bounds = new google.maps.LatLngBounds()

    // Create new markers
    const newMarkers = locations.map((location) => {
      const position = { lat: location.lat, lng: location.lng }
      bounds.extend(position)

      const marker = new google.maps.Marker({
        position,
        map,
        title: location.name,
        animation: location.id === selectedLocationId ? google.maps.Animation.BOUNCE : undefined,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: location.isMostAffordable ? "#FFD700" : "#4285F4",
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: "#FFFFFF",
        },
      })

      marker.addListener("click", () => {
        infoWindow.setContent(`
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">${location.name}</h3>
            <p style="margin: 0 0 8px; font-size: 14px;">${location.address}</p>
            <p style="margin: 0; font-weight: bold; font-size: 14px;">$${location.price.toLocaleString()}</p>
          </div>
        `)
        infoWindow.open(map, marker)

        if (onMarkerClick) {
          onMarkerClick(location.id)
        }
      })

      return marker
    })

    setMarkers(newMarkers)

    // Fit map to bounds
    map.fitBounds(bounds)

    // Adjust zoom if too zoomed in
    const listener = google.maps.event.addListener(map, "idle", () => {
      if (map.getZoom() > 16) map.setZoom(16)
      google.maps.event.removeListener(listener)
    })
  }, [map, infoWindow, locations, selectedLocationId, onMarkerClick, google])

  // Update marker animation when selected location changes
  useEffect(() => {
    if (!markers.length || !google) return

    markers.forEach((marker, index) => {
      const location = locations[index]
      if (location.id === selectedLocationId) {
        marker.setAnimation(google.maps.Animation.BOUNCE)
        map?.panTo(marker.getPosition()!)
      } else {
        marker.setAnimation(null)
      }
    })
  }, [selectedLocationId, markers, locations, map, google])

  if (error) {
    return (
      <Card className={`p-4 flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
          <p className="mt-2">Please try again later</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {isLoading ? <Skeleton className="w-full h-[400px]" /> : <div ref={mapRef} className="w-full h-[400px]" />}
    </Card>
  )
}
