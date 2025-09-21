import React from 'react'
import { useTranslation } from 'react-i18next'
import { ReportGenerator } from '../components/Reports/ReportGenerator'

export function Reports() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('reports')}</h1>
        <p className="text-gray-600">
          Generate and download comprehensive monitoring reports
        </p>
      </div>

      <ReportGenerator />
    </div>
  )
}