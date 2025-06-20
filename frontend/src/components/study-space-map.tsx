"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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

interface StudySpaceMapProps {
  results: SearchResult[]
  userLocation: [number, number] | null
}

export default function StudySpaceMap({ results, userLocation }: StudySpaceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    try {
      const map = L.map(mapRef.current, {
        center: [43.6532, -79.3832],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map
      setIsMapReady(true)

      // Force resize after a short delay
      setTimeout(() => {
        map.invalidateSize()
      }, 250)
    } catch (error) {
      console.error("Error initializing map:", error)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        setIsMapReady(false)
      }
    }
  }, [])

  // Update markers when results change
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return

    const map = mapInstanceRef.current

    // Clear existing markers
    map.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    const markers: L.Marker[] = []

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        html: `<div style="
          background-color: #3b82f6; 
          width: 12px; 
          height: 12px; 
          border-radius: 50%; 
          border: 2px solid white; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        className: "user-location-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const userMarker = L.marker(userLocation, { icon: userIcon }).addTo(map).bindPopup("Your Location")

      markers.push(userMarker)
    }

    // Add result markers
    results.forEach((result, index) => {
      const getMarkerColor = (type: string) => {
        switch (type) {
          case "green_space":
            return "#22c55e"
          case "park":
            return "#16a34a"
          case "cafe":
            return "#f59e0b"
          case "wifi":
            return "#a855f7"
          case "green_street":
            return "#059669"
          case "bench":
            return "#3b82f6"
          default:
            return "#6b7280"
        }
      }

      const markerIcon = L.divIcon({
        html: `<div style="
          background-color: ${getMarkerColor(result.type)}; 
          color: white; 
          width: 28px; 
          height: 28px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: bold; 
          font-size: 14px; 
          border: 3px solid white; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          font-family: system-ui, -apple-system, sans-serif;
        ">${index + 1}</div>`,
        className: "custom-marker",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      })

      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${result.name}</h3>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; line-height: 1.4;">${result.description}</p>
          ${result.address ? `<p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;"><strong>Address:</strong> ${result.address}</p>` : ""}
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
            ${result.features
              .map(
                (feature) =>
                  `<span style="background: #f3f4f6; padding: 2px 6px; border-radius: 12px; font-size: 11px; color: #374151;">${feature}</span>`,
              )
              .join("")}
          </div>
          ${result.distance ? `<p style="margin: 0; font-size: 12px; color: #6b7280;">📍 ${result.distance.toFixed(1)} km away</p>` : ""}
        </div>
      `

      const marker = L.marker(result.coordinates, { icon: markerIcon }).addTo(map).bindPopup(popupContent)

      markers.push(marker)
    })

    // Fit map to show all markers if we have any
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers)
      map.fitBounds(group.getBounds(), {
        padding: [20, 20],
        maxZoom: 15,
      })
    }
  }, [results, userLocation, isMapReady])

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      <div
        ref={mapRef}
        className="absolute inset-0 w-full h-full"
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      />
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
            <p>Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
