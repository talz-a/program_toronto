"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, Wifi, TreePine, Armchair } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"

// Dynamically import map to avoid SSR issues
const StudySpaceMap = dynamic(() => import("@/components/study-space-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
      <div className="text-center text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
        <p>Loading map...</p>
      </div>
    </div>
  ),
})

interface SearchResult {
  id: string
  name: string
  type: "green_space" | "bench" | "wifi"
  description: string
  coordinates: [number, number]
  features: string[]
  address?: string
  distance?: number
}

export default function StudySpaceFinder() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Get user location for proximity ranking
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log("Location access denied:", error)
        },
      )
    }
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const params = new URLSearchParams({ q: query })
      if (userLocation) {
        params.append("lat", userLocation[0].toString())
        params.append("lng", userLocation[1].toString())
      }

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Search failed:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "green_space":
        return <TreePine className="h-4 w-4" />
      case "bench":
        return <Armchair className="h-4 w-4" />
      case "wifi":
        return <Wifi className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "green_space":
        return "bg-green-100 text-green-800"
      case "bench":
        return "bg-blue-100 text-blue-800"
      case "wifi":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Toronto Study Space Finder</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect study spot using natural language. Search for parks, benches, and Wi-Fi locations across
            Toronto.
          </p>
        </div>

        {/* Search Interface */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Try: 'quiet park with Wi-Fi' or 'bench near water'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading || !query.trim()} className="h-12 px-6">
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Example queries */}
          <div className="mt-4 text-sm text-gray-500">
            <span className="font-medium">Try these examples:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "quiet park with Wi-Fi",
                "bench near water",
                "green space with trees",
                "somewhere to sit and study",
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setQuery(example)}
                  className="px-3 py-1 bg-white border rounded-full hover:bg-gray-50 transition-colors"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Results List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Top {results.length} Results</h2>

              {results.map((result, index) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <div>
                          <CardTitle className="text-lg">{result.name}</CardTitle>
                          {result.address && (
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {result.address}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <Badge className={getTypeColor(result.type)}>
                        <span className="flex items-center gap-1">
                          {getTypeIcon(result.type)}
                          {result.type.replace("_", " ")}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{result.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {result.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Distance */}
                    {result.distance && (
                      <p className="text-sm text-gray-500">📍 {result.distance.toFixed(1)} km away</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map */}
            <div className="lg:sticky lg:top-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Map View</h2>
              <div className="h-[500px] w-full">
                <StudySpaceMap results={results} userLocation={userLocation} />
              </div>
            </div>
          </div>
        )}

        {/* No results */}
        {results.length === 0 && query && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No study spaces found</h3>
            <p className="text-gray-600">Try different keywords like "park", "bench", "Wi-Fi", or "green space"</p>
          </div>
        )}

        {/* Initial state */}
        {results.length === 0 && !query && (
          <div className="text-center py-12">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Green Spaces</h3>
                <p className="text-sm text-gray-600">Parks, gardens, and natural areas perfect for outdoor studying</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Armchair className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Seating Areas</h3>
                <p className="text-sm text-gray-600">Benches and comfortable spots to sit and focus</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Wi-Fi Access</h3>
                <p className="text-sm text-gray-600">Free public internet for online research and connectivity</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
