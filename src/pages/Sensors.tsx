import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio, MapPin, Clock, Activity, AlertCircle } from 'lucide-react'
import { SensorMap } from '../components/Sensors/SensorMap'
import { RealtimeChart } from '../components/Dashboard/RealtimeChart'
import { useSensorData } from '../hooks/useSensorData'
import { Sensor } from '../lib/supabase'

export function Sensors() {
  const { t } = useTranslation()
  const { sensors, readings, loading, getLatestReading, getReadingsBySensor } = useSensorData()
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-96"></div>
          <div className="skeleton h-96"></div>
        </div>
      </div>
    )
  }

  const getSensorStatus = (sensor: Sensor) => {
    if (!sensor.is_active) return { status: 'offline', color: 'text-red-600 bg-red-50' }
    
    const latestReading = getLatestReading(sensor.id)
    if (!latestReading) return { status: 'no_data', color: 'text-yellow-600 bg-yellow-50' }
    
    const lastReadingTime = new Date(latestReading.timestamp)
    const now = new Date()
    const timeDiff = now.getTime() - lastReadingTime.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    if (hoursDiff > 2) return { status: 'stale', color: 'text-yellow-600 bg-yellow-50' }
    return { status: 'online', color: 'text-green-600 bg-green-50' }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return t('online')
      case 'offline': return t('offline')
      case 'stale': return 'Stale Data'
      case 'no_data': return 'No Data'
      default: return 'Unknown'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('sensors')}</h1>
          <p className="text-gray-600">
            {sensors.filter(s => s.is_active).length} of {sensors.length} sensors active
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor Map */}
        <SensorMap
          sensors={sensors}
          readings={readings}
          onSensorClick={setSelectedSensor}
        />

        {/* Sensor List */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Status</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sensors.map((sensor) => {
              const { status, color } = getSensorStatus(sensor)
              const latestReading = getLatestReading(sensor.id)
              
              return (
                <div
                  key={sensor.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedSensor?.id === sensor.id 
                      ? 'border-ocean-300 bg-ocean-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSensor(sensor)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Radio className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{sensor.name}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{sensor.location_lat.toFixed(4)}, {sensor.location_lng.toFixed(4)}</span>
                    </div>
                    {latestReading && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(latestReading.timestamp).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {latestReading && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>pH: {latestReading.ph.toFixed(2)}</div>
                      <div>Temp: {latestReading.temperature.toFixed(1)}°C</div>
                      <div>DO: {latestReading.dissolved_oxygen.toFixed(2)} mg/L</div>
                      <div>Turbidity: {latestReading.turbidity.toFixed(1)} NTU</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Selected Sensor Details */}
      {selectedSensor && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedSensor.name} - Detailed View
              </h3>
              <button
                onClick={() => setSelectedSensor(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {(() => {
                const latestReading = getLatestReading(selectedSensor.id)
                if (!latestReading) return <p className="text-gray-500">No recent data available</p>
                
                return (
                  <>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-ocean-600">{latestReading.ph.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">pH Level</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{latestReading.temperature.toFixed(1)}°C</div>
                      <div className="text-sm text-gray-600">Temperature</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{latestReading.dissolved_oxygen.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">DO (mg/L)</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{latestReading.turbidity.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Turbidity (NTU)</div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>

          {/* Charts for selected sensor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealtimeChart
              data={getReadingsBySensor(selectedSensor.id, 24)}
              parameter="ph"
              title="pH Level - 24h"
              unit=""
              color="#0ea5e9"
            />
            <RealtimeChart
              data={getReadingsBySensor(selectedSensor.id, 24)}
              parameter="temperature"
              title="Temperature - 24h"
              unit="°C"
              color="#f59e0b"
            />
            <RealtimeChart
              data={getReadingsBySensor(selectedSensor.id, 24)}
              parameter="dissolved_oxygen"
              title="Dissolved Oxygen - 24h"
              unit="mg/L"
              color="#10b981"
            />
            <RealtimeChart
              data={getReadingsBySensor(selectedSensor.id, 24)}
              parameter="turbidity"
              title="Turbidity - 24h"
              unit="NTU"
              color="#8b5cf6"
            />
          </div>
        </div>
      )}
    </div>
  )
}