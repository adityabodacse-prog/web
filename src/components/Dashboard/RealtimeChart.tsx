import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { SensorReading } from '../../lib/supabase'

interface RealtimeChartProps {
  data: SensorReading[]
  parameter: keyof Pick<SensorReading, 'ph' | 'temperature' | 'turbidity' | 'dissolved_oxygen' | 'conductivity' | 'salinity' | 'water_level'>
  title: string
  unit: string
  color?: string
}

export function RealtimeChart({ data, parameter, title, unit, color = '#0ea5e9' }: RealtimeChartProps) {
  const chartData = data
    .slice(0, 50) // Last 50 readings
    .reverse()
    .map(reading => ({
      time: new Date(reading.timestamp).toLocaleTimeString(),
      value: reading[parameter],
      timestamp: reading.timestamp
    }))

  const formatTooltip = (value: any, name: string) => {
    return [`${value} ${unit}`, title]
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">Real-time monitoring</p>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelStyle={{ color: '#374151' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}