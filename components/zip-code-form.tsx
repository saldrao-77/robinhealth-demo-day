"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ScanListingsSection from "./scan-listings-section"

export default function ZipCodeForm() {
  const [zipCode, setZipCode] = useState("")
  const [scanType, setScanType] = useState("mri")
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate zip code (simple 5-digit US zip code validation)
    if (!/^\d{5}$/.test(zipCode)) {
      setError("Please enter a valid 5-digit zip code")
      return
    }

    setError("")
    setIsSearching(true)

    // Simulate API call delay
    setTimeout(() => {
      setIsSearching(false)
      setHasSearched(true)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
        <div className="space-y-2">
          <Label htmlFor="zipCode">Enter your zip code to find affordable scans near you</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="Enter zip code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="text-lg"
            maxLength={5}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="scanType">Scan Type</Label>
          <Select value={scanType} onValueChange={setScanType}>
            <SelectTrigger id="scanType">
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

        <Button type="submit" className="w-full text-lg py-6" disabled={isSearching}>
          {isSearching ? "Searching..." : "Get affordable scan quotes now"}
        </Button>
      </form>

      {hasSearched && <ScanListingsSection zipCode={zipCode} scanType={scanType} />}
    </div>
  )
}
