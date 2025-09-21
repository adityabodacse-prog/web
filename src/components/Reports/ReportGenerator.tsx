import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, FileText } from 'lucide-react'
import jsPDF from 'jspdf'
import { SensorReading, HazardAlert } from '../../lib/supabase'
import { useSensorData } from '../../hooks/useSensorData'
import { useAlerts } from '../../hooks/useAlerts'

export function ReportGenerator() {
  const { t } = useTranslation()
  const { readings } = useSensorData()
  const { alerts } = useAlerts()
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [generating, setGenerating] = useState(false)

  const generatePDFReport = async () => {
    setGenerating(true)
    try {
      const pdf = new jsPDF()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Title
      pdf.setFontSize(20)
      pdf.text('Aqua Alert - Ocean Monitoring Report', 20, 30)
      
      // Date range
      pdf.setFontSize(12)
      pdf.text(`Report Period: ${dateRange.start} to ${dateRange.end}`, 20, 45)
      
      // Filter data by date range
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)
      
      const filteredReadings: SensorReading[] = readings.filter(reading => {
        const readingDate = new Date(reading.timestamp)
        return readingDate >= startDate && readingDate <= endDate
      })
      
      const filteredAlerts: HazardAlert[] = alerts.filter(alert => {
        const alertDate = new Date(alert.created_at)
        return alertDate >= startDate && alertDate <= endDate
      })

      // Summary statistics
      let yPosition = 65
      pdf.setFontSize(16)
      pdf.text('Summary', 20, yPosition)
      yPosition += 15
      
      pdf.setFontSize(12)
      pdf.text(`Total Sensor Readings: ${filteredReadings.length}`, 20, yPosition)
      yPosition += 10
      pdf.text(`Total Alerts: ${filteredAlerts.length}`, 20, yPosition)
      yPosition += 10
      pdf.text(`Critical Alerts: ${filteredAlerts.filter(a => a.severity === 'critical').length}`, 20, yPosition)
      yPosition += 20

      // Sensor data averages
      if (filteredReadings.length > 0) {
        pdf.setFontSize(16)
        pdf.text('Average Sensor Values', 20, yPosition)
        yPosition += 15
        
        const avgPh = filteredReadings.reduce((sum, r) => sum + r.ph, 0) / filteredReadings.length
        const avgTemp = filteredReadings.reduce((sum, r) => sum + r.temperature, 0) / filteredReadings.length
        const avgDO = filteredReadings.reduce((sum, r) => sum + r.dissolved_oxygen, 0) / filteredReadings.length
        const avgTurbidity = filteredReadings.reduce((sum, r) => sum + r.turbidity, 0) / filteredReadings.length
        
        pdf.setFontSize(12)
        pdf.text(`pH Level: ${avgPh.toFixed(2)}`, 20, yPosition)
        yPosition += 10
        pdf.text(`Temperature: ${avgTemp.toFixed(1)}°C`, 20, yPosition)
        yPosition += 10
        pdf.text(`Dissolved Oxygen: ${avgDO.toFixed(2)} mg/L`, 20, yPosition)
        yPosition += 10
        pdf.text(`Turbidity: ${avgTurbidity.toFixed(1)} NTU`, 20, yPosition)
        yPosition += 20
      }

      // Alerts section
      if (filteredAlerts.length > 0) {
        pdf.setFontSize(16)
        pdf.text('Recent Alerts', 20, yPosition)
        yPosition += 15
        
        filteredAlerts.slice(0, 10).forEach(alert => {
          if (yPosition > pageHeight - 40) {
            pdf.addPage()
            yPosition = 30
          }
          
          pdf.setFontSize(12)
          pdf.text(`${alert.type.toUpperCase()} - ${alert.severity.toUpperCase()}`, 20, yPosition)
          yPosition += 8
          pdf.setFontSize(10)
          pdf.text(alert.title, 25, yPosition)
          yPosition += 6
          pdf.text(`Location: ${alert.location_lat.toFixed(4)}, ${alert.location_lng.toFixed(4)}`, 25, yPosition)
          yPosition += 6
          pdf.text(`Date: ${new Date(alert.created_at).toLocaleString()}`, 25, yPosition)
          yPosition += 12
        })
      }

      // Footer
      pdf.setFontSize(8)
      pdf.text(`Generated on ${new Date().toLocaleString()}`, 20, pageHeight - 20)
      pdf.text('Aqua Alert - Ocean Hazard Monitoring System', 20, pageHeight - 10)
      
      // Save the PDF
      pdf.save(`aqua-alert-report-${dateRange.start}-to-${dateRange.end}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF report')
    } finally {
      setGenerating(false)
    }
  }

  const generateCSVReport = () => {
    setGenerating(true)
    try {
      // Filter data by date range
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)
      
      const filteredReadings = readings.filter(reading => {
        const readingDate = new Date(reading.timestamp)
        return readingDate >= startDate && readingDate <= endDate
      })

      // Create CSV content
      const headers = [
        'Timestamp',
        'Sensor ID',
        'pH',
        'Temperature (°C)',
        'Turbidity (NTU)',
        'Dissolved Oxygen (mg/L)',
        'Conductivity (μS/cm)',
        'Salinity (PSU)',
        'Water Level (m)',
        'Latitude',
        'Longitude'
      ]

      const csvContent = [
        headers.join(','),
        ...filteredReadings.map(reading => [
          reading.timestamp,
          reading.sensor_id,
          reading.ph,
          reading.temperature,
          reading.turbidity,
          reading.dissolved_oxygen,
          reading.conductivity,
          reading.salinity,
          reading.water_level,
          reading.location_lat,
          reading.location_lng
        ].join(','))
      ].join('\n')

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `aqua-alert-data-${dateRange.start}-to-${dateRange.end}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error generating CSV:', error)
      alert('Error generating CSV report')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-6 h-6 text-ocean-600" />
          <h2 className="text-xl font-semibold text-gray-900">{t('generateReport')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={generatePDFReport}
            disabled={generating}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{generating ? 'Generating...' : 'Download PDF Report'}</span>
          </button>

          <button
            onClick={generateCSVReport}
            disabled={generating}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{generating ? 'Generating...' : 'Export CSV Data'}</span>
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Report Period:</strong> {dateRange.start} to {dateRange.end}</p>
            <p><strong>Data Points:</strong> {readings.filter(r => {
              const date = new Date(r.timestamp)
              return date >= new Date(dateRange.start) && date <= new Date(dateRange.end)
            }).length}</p>
            <p><strong>Alerts:</strong> {alerts.filter(a => {
              const date = new Date(a.created_at)
              return date >= new Date(dateRange.start) && date <= new Date(dateRange.end)
            }).length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}