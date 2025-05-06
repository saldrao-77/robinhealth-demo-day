"use client"

import { useEffect, useRef } from "react"

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
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    // Load the Leaflet library
    const loadLeaflet = async () => {
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
        document.body.appendChild(scriptEl)

        return new Promise<void>((resolve) => {
          scriptEl.onload = () => resolve()
        })
      }
      return Promise.resolve()
    }

    const initMap = async () => {
      await loadLeaflet()

      if (!mapRef.current || mapInstanceRef.current) return

      // Wait for Leaflet to be loaded
      if (!window.L) {
        setTimeout(initMap, 100)
        return
      }

      const L = window.L

      // If no centers, set default view to San Francisco
      if (centers.length === 0) {
        mapInstanceRef.current = L.map(mapRef.current).setView([37.7749, -122.4194], 12)

        // Add tile layer (OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current)

        return
      }

      // Calculate center based on markers
      const avgLat = centers.reduce((sum, center) => sum + center.lat, 0) / centers.length
      const avgLng = centers.reduce((sum, center) => sum + center.lng, 0) / centers.length

      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView([avgLat, avgLng], 12)

      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current)

      // Add markers for each center
      markersRef.current = centers.map((center) => {
        // Create custom icon with price
        const customIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: white; border: 2px solid #3b82f6; color: #3b82f6; font-weight: bold; padding: 3px 8px; border-radius: 4px; font-size: 12px;">$${Math.round(center.price)}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })

        const marker = L.marker([center.lat, center.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="min-width: 200px;">
              <strong>${center.name}</strong><br>
              <small>${center.address}</small><br>
              <strong>Price: $${center.price}</strong>
            </div>
          `)
          .on("click", () => onCenterSelect(center.id))

        return { id: center.id, marker }
      })
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [centers])

  // Update selected marker
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current.length) return

    markersRef.current.forEach(({ id, marker }) => {
      if (id === selectedCenter) {
        marker.openPopup()

        // Pan to the selected marker
        mapInstanceRef.current.panTo(marker.getLatLng())
      }
    })
  }, [selectedCenter])

  return <div ref={mapRef} className="h-full w-full" />
}

// Add type definition for Leaflet
declare global {
  interface Window {
    L: any
  }
}
