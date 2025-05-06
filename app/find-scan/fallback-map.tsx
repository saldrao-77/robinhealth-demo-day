"use client"

import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Center {
  id: number
  name: string
  price: number
}

interface FallbackMapProps {
  centers: Center[]
  selectedCenter: number | null
  onCenterSelect: (id: number) => void
}

export default function FallbackMap({ centers, selectedCenter, onCenterSelect }: FallbackMapProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6">
      <MapPin className="h-16 w-16 text-blue-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Map Unavailable</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        We're having trouble loading the map. You can still view and select imaging centers from the list.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {centers.slice(0, 6).map((center) => (
          <Button
            key={center.id}
            variant={selectedCenter === center.id ? "default" : "outline"}
            className="flex flex-col items-center justify-center h-24 p-2 text-center"
            onClick={() => onCenterSelect(center.id)}
          >
            <span className="font-medium">{center.name}</span>
            <span className="text-lg font-bold mt-1">${Math.round(center.price)}</span>
          </Button>
        ))}
      </div>

      {centers.length > 6 && (
        <p className="mt-4 text-sm text-gray-500">+ {centers.length - 6} more centers available in the list</p>
      )}
    </div>
  )
}
