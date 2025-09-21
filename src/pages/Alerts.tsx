import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, CheckCircle, Clock, MapPin, Filter, Search } from 'lucide-react'
import { useAlerts } from '../hooks/useAlerts'
import { HazardAlert } from '../lib/supabase'

export function Alerts() {
  const { t } = useTranslation()
  const { alerts, loading } = useAlerts()
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')
  const [severityFilter, setSeverityFilter] = useState<'all' | HazardAlert['severity']>('all')
  const [searchTerm, setSearchTerm] = useState('')

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-24 w-full"></div>
          ))}
        </div>
      </div>
    )
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && alert.is_active) ||
      (filter === 'resolved' && !alert.is_active)
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    
    const matchesSearch = searchTerm === '' || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSeverity && matchesSearch
  })

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
        return <AlertTriangle className="w-5 h-5" />
      case 'medium':
        return <Clock className="w-5 h-5" />
      case 'low':
        return <CheckCircle className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
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

  const getHazardTypeColor = (type: HazardAlert['type']) => {
    switch (type) {
      case 'tsunami': return 'bg-red-100 text-red-800'
      case 'high_waves': return 'bg-blue-100 text-blue-800'
      case 'oil_spill': return 'bg-gray-100 text-gray-800'
      case 'chemical_pollution': return 'bg-purple-100 text-purple-800'
      case 'biological_pollution': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('alerts')}</h1>
          <p className="text-gray-600">
            {alerts.filter(a => a.is_active).length} active alerts, {alerts.length} total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
          >
            <option value="all">All Alerts</option>
            <option value="active">Active Only</option>
            <option value="resolved">Resolved Only</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="card text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">No alerts match your current filters</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`card border-l-4 ${
                alert.is_active 
                  ? getSeverityColor(alert.severity).replace('bg-', 'border-').split(' ')[0]
                  : 'border-gray-300'
              } ${!alert.is_active ? 'opacity-75' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getHazardTypeColor(alert.type)}`}>
                        {getHazardTypeLabel(alert.type)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                        {t(alert.severity)}
                      </span>
                      {!alert.is_active && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          Resolved
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {alert.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-3">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {alert.location_lat.toFixed(4)}, {alert.location_lng.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        Radius: {alert.affected_radius}km
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary text-sm">
                    {t('viewDetails')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}