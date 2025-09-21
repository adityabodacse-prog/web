import { useTranslation } from 'react-i18next'
import { Activity, AlertTriangle, Database, Radio } from 'lucide-react'
import { StatsCard } from '../components/Dashboard/StatsCard'
import { RealtimeChart } from '../components/Dashboard/RealtimeChart'
import { AlertsPanel } from '../components/Dashboard/AlertsPanel'
import { SensorMap } from '../components/Sensors/SensorMap'
import { useSensorData } from '../hooks/useSensorData'
import { useAlerts } from '../hooks/useAlerts'

export function Dashboard() {
  const { t } = useTranslation()
  const { sensors, readings, loading: sensorsLoading } = useSensorData()
  const { getActiveAlerts } = useAlerts()

  const activeSensors = sensors.filter(sensor => sensor.is_active)
  const activeAlerts = getActiveAlerts()
  const todayReadings = readings.filter(reading => {
    const today = new Date()
    const readingDate = new Date(reading.timestamp)
    return readingDate.toDateString() === today.toDateString()
  })

  if (sensorsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-20 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('activeSensors')}
          value={activeSensors.length}
          icon={Radio}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title={t('activeAlerts')}
          value={activeAlerts.length}
          icon={AlertTriangle}
          color={activeAlerts.length > 0 ? 'red' : 'green'}
        />
        <StatsCard
          title={t('dataPoints')}
          value={todayReadings.length}
          icon={Database}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title={t('systemStatus')}
          value={t('online')}
          icon={Activity}
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          <RealtimeChart
            data={readings.slice(0, 50)}
            parameter="ph"
            title={t('ph')}
            unit=""
            color="#0ea5e9"
          />
          
          <RealtimeChart
            data={readings.slice(0, 50)}
            parameter="temperature"
            title={t('temperature')}
            unit="°C"
            color="#f59e0b"
          />
          
          <RealtimeChart
            data={readings.slice(0, 50)}
            parameter="dissolved_oxygen"
            title={t('dissolvedOxygen')}
            unit="mg/L"
            color="#10b981"
          />
        </div>

        {/* Alerts Panel */}
        <div className="space-y-6">
          <AlertsPanel />
        </div>
      </div>

      {/* Map */}
      <div className="grid grid-cols-1">
        <SensorMap
          sensors={sensors}
          readings={readings}
        />
      </div>
    </div>
  )
}