import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Sensor, SensorReading } from '../../lib/supabase'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface SensorMapProps {
  sensors: Sensor[]
  readings: SensorReading[]
  onSensorClick?: (sensor: Sensor) => void
}

export function SensorMap({ sensors, readings, onSensorClick }: SensorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 2)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current = []

    // Add sensor markers
    sensors.forEach(sensor => {
      if (!mapInstanceRef.current) return

      const latestReading = readings.find(r => r.sensor_id === sensor.id)
      
      // Create custom icon based on sensor status
      const iconColor = sensor.is_active ? 
        (latestReading ? '#10b981' : '#f59e0b') : '#ef4444'
      
      const customIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${iconColor};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          "></div>
        `,
        className: 'custom-sensor-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })

      const marker = L.marker([sensor.location_lat, sensor.location_lng], {
        icon: customIcon
      }).addTo(mapInstanceRef.current)

      // Create popup content
      const popupContent = `
        <div class="p-2">
          <h3 class="font-semibold text-gray-900 mb-2">${sensor.name}</h3>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span class="${sensor.is_active ? 'text-green-600' : 'text-red-600'}">
                ${sensor.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            ${latestReading ? `
              <div class="flex justify-between">
                <span class="text-gray-600">Last Reading:</span>
                <span class="text-gray-900">
                  ${new Date(latestReading.timestamp).toLocaleString()}
                </span>
              </div>
              <div class="mt-2 pt-2 border-t border-gray-200">
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div>pH: ${latestReading.ph.toFixed(2)}</div>
                  <div>Temp: ${latestReading.temperature.toFixed(1)}°C</div>
                  <div>DO: ${latestReading.dissolved_oxygen.toFixed(2)} mg/L</div>
                  <div>Turbidity: ${latestReading.turbidity.toFixed(1)} NTU</div>
                </div>
              </div>
            ` : '<div class="text-gray-500 text-sm">No recent data</div>'}
          </div>
        </div>
      `

      marker.bindPopup(popupContent)
      
      if (onSensorClick) {
        marker.on('click', () => onSensorClick(sensor))
      }

      markersRef.current.push(marker)
    })

    // Fit map to show all sensors
    if (sensors.length > 0) {
      const group = new L.FeatureGroup(markersRef.current)
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [sensors, readings, onSensorClick])

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sensor Locations</h3>
        <p className="text-sm text-gray-600">
          {sensors.filter(s => s.is_active).length} of {sensors.length} sensors active
        </p>
      </div>
      <div 
        ref={mapRef} 
        className="map-container"
        style={{ minHeight: '400px' }}
      />
    </div>
  )
}