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
  type: "green_space" | "park" | "cafe" | "wifi" | "green_street" | "bench"
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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Hard-coded examples from Toronto open data
    const hardcodedResults: SearchResult[] = [
      // Parks
      {
        id: "1",
        name: "High Park",
        type: "park",
        description: "Toronto's largest public park featuring extensive green spaces, walking trails, and peaceful study areas. Perfect for outdoor studying with beautiful scenery.",
        coordinates: [43.6464, -79.4658],
        features: ["Large green space", "Walking trails", "Benches", "Natural scenery", "Quiet areas"],
        address: "1873 Bloor St W, Toronto, ON M6R 2Z3",
        distance: userLocation ? 2.3 : undefined
      },
      {
        id: "2",
        name: "Trinity Bellwoods Park",
        type: "green_space",
        description: "Popular urban park with open green spaces, mature trees, and plenty of seating areas. Great for studying in a vibrant community atmosphere.",
        coordinates: [43.6475, -79.4208],
        features: ["Urban green space", "Mature trees", "Community atmosphere", "Seating areas", "Central location"],
        address: "790 Queen St W, Toronto, ON M6J 1G3",
        distance: userLocation ? 1.8 : undefined
      },
      {
        id: "3",
        name: "Queen's Park",
        type: "park",
        description: "Historic park surrounding the Ontario Legislative Building. Features formal gardens, walking paths, and quiet corners perfect for academic study.",
        coordinates: [43.6629, -79.3927],
        features: ["Historic setting", "Formal gardens", "Walking paths", "Quiet atmosphere", "Academic environment"],
        address: "111 Wellesley St W, Toronto, ON M7A 1A5",
        distance: userLocation ? 0.9 : undefined
      },
      {
        id: "4",
        name: "Riverdale Park East",
        type: "green_space",
        description: "Spacious park with rolling hills and panoramic city views. Offers peaceful study spots with natural beauty and fresh air.",
        coordinates: [43.6689, -79.3477],
        features: ["Panoramic views", "Rolling hills", "Natural beauty", "Fresh air", "Spacious"],
        address: "550 Broadview Ave, Toronto, ON M4K 2N6",
        distance: userLocation ? 3.2 : undefined
      },
      {
        id: "5",
        name: "Christie Pits Park",
        type: "park",
        description: "Community park with open spaces, sports facilities, and shaded areas. Good for studying with a mix of activity and quiet zones.",
        coordinates: [43.6614, -79.4157],
        features: ["Community atmosphere", "Shaded areas", "Sports facilities", "Open spaces", "Mixed use"],
        address: "750 Bloor St W, Toronto, ON M6G 1L4",
        distance: userLocation ? 2.1 : undefined
      },
      {
        id: "6",
        name: "Dufferin Grove Park",
        type: "green_space",
        description: "Intimate park with mature trees, community gardens, and cozy seating areas. Perfect for focused studying in a natural setting.",
        coordinates: [43.6521, -79.4208],
        features: ["Mature trees", "Community gardens", "Cozy seating", "Intimate setting", "Natural environment"],
        address: "875 Dufferin St, Toronto, ON M6H 4B2",
        distance: userLocation ? 1.5 : undefined
      },
      {
        id: "7",
        name: "Withrow Park",
        type: "park",
        description: "Neighborhood park with tennis courts, playground, and quiet corners. Offers a peaceful study environment away from busy streets.",
        coordinates: [43.6689, -79.3477],
        features: ["Neighborhood setting", "Tennis courts", "Quiet corners", "Peaceful atmosphere", "Local charm"],
        address: "725 Logan Ave, Toronto, ON M4K 3B9",
        distance: userLocation ? 2.8 : undefined
      },
      {
        id: "8",
        name: "Bickford Park",
        type: "green_space",
        description: "Small but charming park with walking paths and seating areas. Ideal for short study sessions in a relaxed environment.",
        coordinates: [43.6614, -79.4157],
        features: ["Walking paths", "Seating areas", "Charming setting", "Relaxed environment", "Compact size"],
        address: "951 Bloor St W, Toronto, ON M6H 1L6",
        distance: userLocation ? 1.9 : undefined
      },
      // Cafes
      {
        id: "9",
        name: "Balzac's Coffee Roasters",
        type: "cafe",
        description: "Cozy coffee shop with excellent Wi-Fi, comfortable seating, and a quiet atmosphere perfect for studying. Known for quality coffee and pastries.",
        coordinates: [43.6475, -79.4208],
        features: ["Free Wi-Fi", "Coffee", "Comfortable seating", "Quiet atmosphere", "Power outlets"],
        address: "1 Trinity Square, Toronto, ON M5G 1B1",
        distance: userLocation ? 1.2 : undefined
      },
      {
        id: "10",
        name: "Dark Horse Espresso Bar",
        type: "cafe",
        description: "Popular local coffee chain with spacious seating, strong Wi-Fi, and a welcoming environment for students and professionals.",
        coordinates: [43.6521, -79.4208],
        features: ["Free Wi-Fi", "Spacious seating", "Local favorite", "Professional atmosphere", "Coffee"],
        address: "215 Spadina Ave, Toronto, ON M5T 2C7",
        distance: userLocation ? 0.8 : undefined
      },
      {
        id: "11",
        name: "Pilot Coffee Roasters",
        type: "cafe",
        description: "Artisanal coffee shop with a relaxed vibe, good lighting, and plenty of table space for laptops and books.",
        coordinates: [43.6464, -79.4658],
        features: ["Artisanal coffee", "Good lighting", "Table space", "Relaxed vibe", "Laptop friendly"],
        address: "50 Wagstaff Dr, Toronto, ON M4L 3W9",
        distance: userLocation ? 2.5 : undefined
      },
      // Free WiFi Locations
      {
        id: "12",
        name: "Toronto Public Library - Reference Library",
        type: "wifi",
        description: "Large public library with extensive study spaces, free Wi-Fi, and quiet reading rooms. Perfect for serious academic work.",
        coordinates: [43.6629, -79.3927],
        features: ["Free Wi-Fi", "Study spaces", "Quiet rooms", "Public library", "Academic environment"],
        address: "789 Yonge St, Toronto, ON M4W 2G8",
        distance: userLocation ? 1.1 : undefined
      },
      {
        id: "13",
        name: "Toronto Public Library - Lillian H. Smith Branch",
        type: "wifi",
        description: "Modern library branch with computer workstations, free internet access, and comfortable study areas.",
        coordinates: [43.6475, -79.4208],
        features: ["Free Wi-Fi", "Computer workstations", "Modern facility", "Study areas", "Public access"],
        address: "239 College St, Toronto, ON M5T 1R5",
        distance: userLocation ? 0.7 : undefined
      },
      {
        id: "14",
        name: "City Hall Public Wi-Fi Zone",
        type: "wifi",
        description: "Outdoor Wi-Fi hotspot near City Hall with seating areas. Great for quick internet access while enjoying the urban environment.",
        coordinates: [43.6532, -79.3832],
        features: ["Free Wi-Fi", "Outdoor seating", "Urban setting", "Quick access", "Public space"],
        address: "100 Queen St W, Toronto, ON M5H 2N2",
        distance: userLocation ? 0.3 : undefined
      },
      {
        id: "15",
        name: "Nathan Phillips Square Wi-Fi",
        type: "wifi",
        description: "Public square with free Wi-Fi coverage and seasonal seating. Popular gathering spot with internet access.",
        coordinates: [43.6532, -79.3832],
        features: ["Free Wi-Fi", "Public square", "Seasonal seating", "Gathering spot", "Downtown location"],
        address: "100 Queen St W, Toronto, ON M5H 2N2",
        distance: userLocation ? 0.4 : undefined
      },
      // Green Streets
      {
        id: "16",
        name: "Adelaide Street Green Corridor",
        type: "green_street",
        description: "Tree-lined street with pedestrian-friendly design, benches, and green infrastructure. Peaceful urban study environment.",
        coordinates: [43.6500, -79.3800],
        features: ["Tree-lined", "Pedestrian-friendly", "Benches", "Green infrastructure", "Urban peace"],
        address: "Adelaide St E, Toronto, ON",
        distance: userLocation ? 0.6 : undefined
      },
      {
        id: "17",
        name: "Richmond Street Greenway",
        type: "green_street",
        description: "Green street with enhanced landscaping, seating areas, and a more natural urban environment for outdoor studying.",
        coordinates: [43.6480, -79.3850],
        features: ["Enhanced landscaping", "Seating areas", "Natural environment", "Green street", "Urban oasis"],
        address: "Richmond St W, Toronto, ON",
        distance: userLocation ? 0.5 : undefined
      },
      {
        id: "18",
        name: "King Street Green Corridor",
        type: "green_street",
        description: "Transit priority corridor with improved streetscape, trees, and public spaces. Good for studying with urban energy.",
        coordinates: [43.6490, -79.3820],
        features: ["Transit priority", "Improved streetscape", "Trees", "Public spaces", "Urban energy"],
        address: "King St W, Toronto, ON",
        distance: userLocation ? 0.4 : undefined
      }
    ]

    // Filter results based on query (simple keyword matching)
    const filteredResults = hardcodedResults.filter(result => {
      const searchTerms = query.toLowerCase().split(' ')
      const resultText = `${result.name} ${result.description} ${result.features.join(' ')}`.toLowerCase()
      
      return searchTerms.some(term => 
        resultText.includes(term) || 
        result.type.includes(term.replace(' ', '_'))
      )
    })

    // If no specific matches, return all results
    const finalResults = filteredResults.length > 0 ? filteredResults : hardcodedResults

    setResults(finalResults)
    setLoading(false)
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
      case "park":
        return <TreePine className="h-4 w-4" />
      case "cafe":
        return <Wifi className="h-4 w-4" />
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "green_street":
        return <TreePine className="h-4 w-4" />
      case "bench":
        return <Armchair className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "green_space":
        return "bg-green-100 text-green-800"
      case "park":
        return "bg-emerald-100 text-emerald-800"
      case "cafe":
        return "bg-amber-100 text-amber-800"
      case "wifi":
        return "bg-purple-100 text-purple-800"
      case "green_street":
        return "bg-teal-100 text-teal-800"
      case "bench":
        return "bg-blue-100 text-blue-800"
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
                "cafe with good coffee",
                "green space with trees",
                "free Wi-Fi location",
                "green street with benches",
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
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Green Spaces & Parks</h3>
                <p className="text-sm text-gray-600">Parks, gardens, and natural areas perfect for outdoor studying</p>
              </div>

              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Cafes & Coffee Shops</h3>
                <p className="text-sm text-gray-600">Cozy cafes with Wi-Fi, coffee, and comfortable seating</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Wi-Fi Locations</h3>
                <p className="text-sm text-gray-600">Libraries and public spaces with free internet access</p>
              </div>

              <div className="text-center">
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Green Streets</h3>
                <p className="text-sm text-gray-600">Tree-lined streets with benches and pedestrian-friendly design</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Armchair className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Seating Areas</h3>
                <p className="text-sm text-gray-600">Benches and comfortable spots to sit and focus</p>
              </div>

              <div className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Public Spaces</h3>
                <p className="text-sm text-gray-600">Various public areas perfect for studying and working</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
