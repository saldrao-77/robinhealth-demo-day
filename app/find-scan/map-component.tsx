"use client"

import { useEffect, useRef, useState } from "react"

interface Center {
  id: number
  name: string
  lat: number
  lng: number
  price: number
  address: string
}

interface MapComponentProps {
  centers: Center[]
  selectedCenter: number | null
  onCenterSelect: (id: number) => void
}

export default function MapComponent({ centers, selectedCenter, onCenterSelect }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    let isMounted = true
    let mapInstance: any = null
    let markers: any[] = []

    // Function to load Leaflet scripts and styles
    const loadLeaflet = async () => {
      try {
        if (typeof window !== "undefined" && !window.L) {
          // Add Leaflet CSS
          const linkEl = document.createElement("link")
          linkEl.rel = "stylesheet"
          linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(linkEl)

          // Add Leaflet JS
          const scriptEl = document.createElement("script")
          scriptEl.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          scriptEl.async = true

          // Create a promise that resolves when the script loads or rejects on error
          await new Promise<void>((resolve, reject) => {
            scriptEl.onload = () => resolve()
            scriptEl.onerror = () => reject(new Error("Failed to load Leaflet"))
            document.body.appendChild(scriptEl)
          })
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading Leaflet:", error)
          setMapError("Failed to load map. Please try again later.")
        }
      }
    }

    // Function to create custom marker HTML
    const createMarkerHtml = (price: number, isSelected: boolean) => {
      const formattedPrice = Math.round(price).toLocaleString()

      return `
        <div class="relative flex flex-col items-center">
          <div class="${isSelected ? "shadow-lg scale-110" : "shadow"} transition-all duration-200 flex flex-col items-center">
            <!-- Marker Pin Top -->
            <div class="flex items-center justify-center w-16 h-16 rounded-full ${isSelected ? "bg-blue-600" : "bg-blue-500"} text-white font-bold shadow-md overflow-hidden border-2 ${isSelected ? "border-white" : "border-blue-200"}">
              <div class="flex flex-col items-center justify-center text-center w-full">
                <span class="text-xs font-normal">$</span>
                <span class="text-lg leading-none">${formattedPrice}</span>
              </div>
            </div>
            <!-- Marker Pin Bottom -->
            <div class="w-4 h-4 -mt-1 rotate-45 ${isSelected ? "bg-blue-600" : "bg-blue-500"} shadow-md"></div>
          </div>
          ${isSelected ? '<div class="mt-1 w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>' : ""}
        </div>
      `
    }

    // Function to initialize the map
    const initMap = async () => {
      if (!mapRef.current || !isMounted) return

      try {
        await loadLeaflet()

        // Wait for Leaflet to be loaded
        if (!window.L) {
          if (isMounted) {
            setMapError("Map library not available. Please try again later.")
          }
          return
        }

        const L = window.L

        // Clear any existing map
        if (mapInstance) {
          mapInstance.remove()
        }

        // Default view (San Francisco)
        const defaultLat = 37.7749
        const defaultLng = -122.4194

        // Calculate center based on markers or use default
        let centerLat = defaultLat
        let centerLng = defaultLng
        const zoomLevel = 12

        if (centers && centers.length > 0) {
          centerLat = centers.reduce((sum, center) => sum + center.lat, 0) / centers.length
          centerLng = centers.reduce((sum, center) => sum + center.lng, 0) / centers.length
        }

        // Initialize map
        mapInstance = L.map(mapRef.current, {
          center: [centerLat, centerLng],
          zoom: zoomLevel,
          zoomControl: true,
        })

        // Add tile layer (OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstance)

        // Add custom CSS for markers
        if (!document.getElementById("custom-marker-styles")) {
          const style = document.createElement("style")
          style.id = "custom-marker-styles"
          style.innerHTML = `
            .leaflet-marker-icon {
              background: transparent !important;
              border: none !important;
            }
            .marker-selected {
              z-index: 1000 !important;
            }
          `
          document.head.appendChild(style)
        }

        // Add markers for each center
        if (centers && centers.length > 0) {
          markers = centers.map((center) => {
            const isSelected = center.id === selectedCenter

            // Create custom icon with Robin Health branding
            const customIcon = L.divIcon({
              className: `custom-marker ${isSelected ? "marker-selected" : ""}`,
              html: createMarkerHtml(center.price, isSelected),
              iconSize: [64, 64],
              iconAnchor: [32, 48], // Position the tip of the pin at the marker's location
              popupAnchor: [0, -40], // Position the popup above the marker
            })

            const marker = L.marker([center.lat, center.lng], { icon: customIcon, riseOnHover: true })
              .addTo(mapInstance)
              .bindPopup(`
                <div class="p-2 min-w-[220px]">
                  <div class="font-bold text-blue-600 text-lg mb-1">${center.name}</div>
                  <div class="text-gray-600 text-sm mb-2">${center.address}</div>
                  <div class="flex justify-between items-center">
                    <div class="font-bold text-lg">$${Math.round(center.price).toLocaleString()}</div>
                    <button 
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      onclick="window.selectCenter(${center.id})"
                    >
                      Select
                    </button>
                  </div>
                </div>
              `)
              .on("click", () => {
                if (isMounted) {
                  onCenterSelect(center.id)
                }
              })

            return { id: center.id, marker }
          })

          // Add a global function to handle the select button click in popups
          window.selectCenter = (id: number) => {
            if (isMounted) {
              onCenterSelect(id)
            }
          }

          // Open popup for selected center
          if (selectedCenter !== null) {
            const selectedMarker = markers.find((m) => m.id === selectedCenter)
            if (selectedMarker) {
              selectedMarker.marker.openPopup()
              mapInstance.panTo(selectedMarker.marker.getLatLng())
            }
          }
        }

        if (isMounted) {
          setIsMapLoaded(true)
          setMapError(null)
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error initializing map:", error)
          setMapError("Failed to initialize map. Please try again later.")
        }
      }
    }

    // Initialize the map
    initMap()

    // Cleanup function
    return () => {
      isMounted = false
      if (mapInstance) {
        mapInstance.remove()
      }
      // Remove the global function
      if (window.selectCenter) {
        delete window.selectCenter
      }
    }
  }, [centers, selectedCenter, onCenterSelect])

  // Update markers when selected center changes
  useEffect(() => {
    if (!isMapLoaded || !window.L || !mapRef.current) return

    const updateMarkers = () => {
      try {
        const L = window.L
        const mapInstance = mapRef.current?._leaflet_id ? L.maps[mapRef.current._leaflet_id] : null
        if (!mapInstance) return

        // Remove all existing markers
        mapInstance.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
            mapInstance.removeLayer(layer)
          }
        })

        // Re-add all markers with updated styles
        centers.forEach((center) => {
          const isSelected = center.id === selectedCenter

          // Create custom icon with Robin Health branding
          const customIcon = L.divIcon({
            className: `custom-marker ${isSelected ? "marker-selected" : ""}`,
            html: createMarkerHtml(center.price, isSelected),
            iconSize: [64, 64],
            iconAnchor: [32, 48],
            popupAnchor: [0, -40],
          })

          const marker = L.marker([center.lat, center.lng], { icon: customIcon, riseOnHover: true })
            .addTo(mapInstance)
            .bindPopup(`
              <div class="p-2 min-w-[220px]">
                <div class="font-bold text-blue-600 text-lg mb-1">${center.name}</div>
                <div class="text-gray-600 text-sm mb-2">${center.address}</div>
                <div class="flex justify-between items-center">
                  <div class="font-bold text-lg">$${Math.round(center.price).toLocaleString()}</div>
                  <button 
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    onclick="window.selectCenter(${center.id})"
                  >
                    Select
                  </button>
                </div>
              </div>
            `)
            .on("click", () => onCenterSelect(center.id))

          // Open popup for selected center
          if (isSelected) {
            marker.openPopup()
            mapInstance.panTo(marker.getLatLng())
          }
        })
      } catch (error) {
        console.error("Error updating markers:", error)
      }
    }

    updateMarkers()
  }, [selectedCenter, centers, isMapLoaded])

  if (mapError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <p className="text-red-500 mb-2">{mapError}</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" style={{ minHeight: "600px" }} />
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-blue-600 font-medium">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Add type definition for Leaflet and global selectCenter function
declare global {
  interface Window {
    L: any
    selectCenter: (id: number) => void
  }
}
