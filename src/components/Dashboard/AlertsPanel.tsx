import { useTranslation } from 'react-i18next'
import { AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react'
import { HazardAlert } from '../../lib/supabase'
import { useAlerts } from '../../hooks/useAlerts'

export function AlertsPanel() {
  const { t } = useTranslation()
  const { getActiveAlerts } = useAlerts()
  
  const activeAlerts = getActiveAlerts().slice(0, 5) // Show latest 5

  const getSeverityColor = (severity: HazardAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: HazardAlert['severity']) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />
      case 'medium':
        return <Clock className="w-4 h-4" />
      case 'low':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getHazardTypeLabel = (type: HazardAlert['type']) => {
    const labels = {
      tsunami: t('tsunami'),
      high_waves: t('highWaves'),
      oil_spill: t('oilSpill'),
      chemical_pollution: t('chemicalPollution'),
      biological_pollution: t('biologicalPollution'),
    }
    return labels[type] || type
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('activeAlerts')}</h3>
        <span className="text-sm text-gray-500">
          {activeAlerts.length} active
        </span>
      </div>

      {activeAlerts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600">{t('noActiveAlerts')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">
                        {getHazardTypeLabel(alert.type)}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                        {t(alert.severity)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.title}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>
                        {alert.location_lat.toFixed(4)}, {alert.location_lng.toFixed(4)}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(alert.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}